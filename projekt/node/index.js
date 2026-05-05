const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000; // musi odpowiadać teragetPort w serwisie

// 📦 env z K8s
const dbUrl = process.env.DB_URL;
const username = process.env.USER_NAME;
const password = process.env.USER_PWD;

// 🔌 connection string
const mongoUri = `mongodb://${username}:${password}@${dbUrl}`;

let collection;

// 🔗 połączenie z Mongo
async function connectDB() {
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("testdb");
    collection = db.collection("numbers");

    console.log("Connected to MongoDB");
}

connectDB().catch(console.error);

app.get("/", async (req, res) => {
    res.send("Hello from Node.js v3!");
});

// 📖 historia (to czego chcesz)
app.get("/api/history", async (req, res) => {
    try {
        const items = await collection
            .find({}, { projection: { _id: 0 } })
            .toArray();

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
