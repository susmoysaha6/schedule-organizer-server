const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yna6pse.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const todoCollection = client.db('schedule_organizer').collection('todo');

        app.get('/todos', async (req, res) => {
            const todos = await todoCollection.find({}).toArray();
            res.send(todos)
        })
        app.get('/todo', async (req, res) => {
            const email = req.query.email;
            const query = { email: email, status: "pending" };
            const todos = await todoCollection.find(query).toArray();
            res.send(todos)
        })

        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        })
    }
    finally { }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send(' server is running on')
})

app.listen(port, () => {
    console.log(`server running on ${port}`);
})