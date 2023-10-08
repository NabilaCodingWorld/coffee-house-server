const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zx1pf4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const addCoffeeCollection = client.db('CoffeeHouse').collection('addCoffee');



        // get coffee
        app.get('/coffee', async (req, res) => {
            const result = await addCoffeeCollection.find().toArray();
            res.send(result);
        })

        // post coffee
        app.post('/coffee', async (req, res) => {
            const newItem = req.body;
            const result = await addCoffeeCollection.insertOne(newItem);

            res.send(result)
        })


        // delete coffee
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addCoffeeCollection.deleteOne(query);
            res.send(result);
        })


        // update data, single data get
        app.get('/coffee/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await addCoffeeCollection.findOne(query);
            res.send(result);
        });


        // put coffee part of update
        app.put('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedCoffee = req.body;

            const coffee = {
                $set: {
            
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    taste: updatedCoffee.taste,
                    supplier: updatedCoffee.supplier,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }

            const result = await addCoffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Nabilar coffee shop')
})

app.listen(port, () => {
    console.log(`Nabila is sitting soon ${port}`)
})