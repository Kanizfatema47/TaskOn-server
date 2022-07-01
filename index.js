const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbi6k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





app.get('/', (req, res) => {
    res.send('server is running')
})

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('tasklist').collection('tasks');

        console.log('db connected')


        //Send task to db
        app.post("/task", async (req, res) => {
            const task = req.body;
            console.log(task)
            const result = await taskCollection.insertOne(task);
            res.send(result)
        })

        //Get tasks from db

        app.get("/gettask", async (req, res) => {
            const query = {}
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task)
        })

        // //Edit tasks
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body.tasks;
            console.log(task)
            const result = await taskCollection.updateOne(
                {
                    _id : ObjectId(id)
                },
                {
                    $set:{
                        tasks:req.body.tasks
                    }
                   
                },
                {upsert:true}
            )
            res.send(result)

        })



        //Delete Tasks

        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = taskCollection.deleteOne(query);
            res.send(result);
        });






    }
    finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`port: ${port}`)
})