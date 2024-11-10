import https from "https";
import http from "http";
import fs from "fs";
import fruits from "./routes/fruit.mjs";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.mjs"; //importing the user routes here
import employeeRoutes from "./routes/employee.mjs";

/*
updated this file as per part 2 feedback to ensure all traffic is served
over ssl */

const PORT = 3000;
const HTTP_PORT = 3002; // a port for HTTP server (if needed)
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

app.use(cors({
    origin: ["https://localhost:3000", "http://localhost:3001"], // ensuring all CORS is restricted to HTTPS
}));
app.use(express.json());

// enforcing https
app.use((req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

// setting custom security headers
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' https://localhost:3000; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://localhost:3000");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
});

// user routes here
app.use("/api/users", userRoutes); 
app.use("/api/employees", employeeRoutes); 


const httpsServer = https.createServer(options, app);
httpsServer.listen(PORT, () => {
    console.log(`Secure server running at https://localhost:${PORT}`);
});

// if needed, creating a https to redirect all to https
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`HTTP server running on http://localhost:${HTTP_PORT} and redirecting to HTTPS`);
});