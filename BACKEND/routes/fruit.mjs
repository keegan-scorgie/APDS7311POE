import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("fruit");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.post("/fruit", async (req, res) =>{
    let newDocument = {
        name: req.body.name,
        comment: req.body.comment
    };
    let collection = await db.collection("fruit");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);

});

export default router;