import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(`MongoDB connection string: ${connectionString}`); 


const client = new MongoClient(connectionString, {
    tls: true,
    tlsCAFile: './keys/certificate.pem',
    tlsAllowInvalidCertificates: true,

});

let conn;
try {
    conn = await client.connect();
    console.log('mongoDB is connected');
} catch(e) {
    console.error('Connection error:', e);
}

let db = client.db("payment_portal");

export default db;