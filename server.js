const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config  = require('./config/key');

const { User } = require('./models/user');

const mongosee = require('mongosee');
mongosee.connect(config.mongoURI,{useNewUrlParser: true})
    .then(() => {
        console.log('DB Conected');
    })
    .catch( err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) =>{
        if(err) return res.json({ success: false, err})
    })
    return res.status(200);
})

app.listen(5000);