const express = require('express');
const app = express();

const mongosee = require('mongosee');
mongosee.connect('',{useNewUrlParser: true})
    .then(() => {
        console.log('DB Conected');
    })
    .catch( err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(5000);