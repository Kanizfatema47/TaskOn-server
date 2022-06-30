const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbi6k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





app.get('/', (req, res)=>{
    res.send('server is running')
})

async function run(){
    try{
        await client.connect();
        const taskCollection = client.db('tasklist').collection('tasks');

        console.log('db connected')



        app.post("/task", async(req,res)=>{
            const task = req.body;
            console.log(task)
            const result = await taskCollection.insertOne(task);
            res.send(result)
        })

        app.get("/gettask", async(req,res)=>{
            const query = {}
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task)
        })

        




    }
    finally{

    }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`port: ${port}`)
})