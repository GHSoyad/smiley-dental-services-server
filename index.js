const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

//Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7r6jn89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("smiley-dental-services").collection("services");
        const reviewsCollection = client.db("smiley-dental-services").collection("reviews");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
            res.send({ token });
        })

        app.post('/add-service', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services-3', async (req, res) => {
            const query = {};
            const options = { sort: { _id: -1 } };
            const cursor = servicesCollection.find(query, options).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const id = req.query.serviceId;
            const query = { serviceId: id };
            const options = { sort: { dateTime: -1 } };
            const cursor = reviewsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/my-reviews', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { userEmail: email };
            const options = { sort: { dateTime: -1 } };
            const cursor = reviewsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/my-reviews', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/update-review/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const filter = { _id: ObjectId(id) };
            const updateReview = { $set: review }
            const result = await reviewsCollection.updateOne(filter, updateReview)
            res.send(result);
        })

    } finally {

    }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send("Server is running");
})

app.get('/test', (req, res) => {
    const testData = [
        {
            test1: "testing data"
        }
    ]
    res.send(testData)
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})