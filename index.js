const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

//Middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7r6jn89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db("smiley-dental-services").collection("services");

        const service = {
            name: "Dental Crown",
            img: "https://i.ibb.co/qgZMHC5/dental-crown.jpg",
            cost: 500,
            description: "A dental crown is a dental prosthesis which replaces the visible part of a tooth. A dental crown functions to strengthen teeth, restore their original shape, and improve their appearance. Dental crowns are also used to hold dental bridges in place and cover dental implants.",
            rating: 4.4
        }

        const result = await servicesCollection.insertOne(service);

        console.log(result);

    } finally {
    }
}
// run().catch(error => console.log(error));



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