const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

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