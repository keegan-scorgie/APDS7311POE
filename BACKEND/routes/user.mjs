import express from "express";
import bcrypt from "bcrypt";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";

/*as per part 2 feedback ive implemented numerous security measures
including express-validator, rate limiting, a more indepth jwt authentication
helmt 
*/
dotenv.config(); 

const router = express.Router();
const MAX_LOGIN_ATTEMPTS = 5; // max login attempts before account lock out
const LOCK_TIME = 15 * 60 * 1000; // account lockout time period

// checking if the user collection exists
async function ensureUsersCollection(req, res, next) {
    try {
        const usersCollection = db.collection("users");
        const count = await usersCollection.countDocuments();
        if (count === 0) {
            console.log("Creating users collection...");
            await usersCollection.insertOne({});
        }
        next();
    } catch (error) {
        console.error("Can't validate if users collection exists", error);
        res.status(500).json({ message: "Internal server error. Please try again." });
    }
}

// user registration route  implemented express-validator
router.post(
    "/register",
    ensureUsersCollection,
    [
        body("fullName").notEmpty().withMessage("Full Name is required."),
        body("accountNumber").isLength({ min: 10, max: 10 }).withMessage("Account number must be exactly 10 digits."),
        body("idNumber").isLength({ min: 8, max: 12 }).withMessage("ID number must be 8-12 characters."),
        body("password").isStrongPassword().withMessage("Password must be strong (8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol)."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, idNumber, accountNumber, password } = req.body;
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ accountNumber });
        if (existingUser) {
            return res.status(400).json({ message: "This user has already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            fullName,
            idNumber,
            accountNumber,
            password: hashedPassword,
            loginAttempts: 0,
            lockUntil: null,
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User successfully registered." });
    }
);

// changed login route to implement rate limiting as per part 2 feedback (implementing more security to preventt more attacks)
router.post("/login", ensureUsersCollection, async (req, res) => {
    const { accountNumber, password } = req.body;
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ accountNumber });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

    // checking if the account is locked out
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({ message: "Account is temporarily locked. Try again later." });
    }

    // comparing password entered with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        await usersCollection.updateOne(
            { accountNumber },
            {
                $inc: { loginAttempts: 1 },
                $set: { lockUntil: user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCK_TIME : null },
            }
        );
        return res.status(400).json({ message: "Invalid credentials." });
    }

    //resets the login attempts once a successful login occurs
    await usersCollection.updateOne(
        { accountNumber },
        { $set: { loginAttempts: 0, lockUntil: null } }
    );

    // generating a jwt and now with data unique to each user
    const token = jwt.sign(
        {
            id: user._id,
            accountNumber: user.accountNumber,
            fullName: user.fullName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful! Welcome.", token });
});

export default router;