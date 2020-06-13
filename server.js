const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config  = require('./config/key');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

const mongosee = require('mongosee');
mongosee.connect(config.mongoURI,{useNewUrlParser: true})
    .then(() => {
        console.log('DB Conected');
    })
    .catch( err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/user/auth", auth, (req, res)=> {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) =>{
        if(err) return res.json({ success: false, err})
    })
    return res.status(200);
})

app.post('/api/user/login', (req, res) => {
    //find the email
    User.find({ email: req.body.email}, (err, user) => {
        if(!user) {
            return req.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        //compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "wrong password"
                })
            }
        })

        //generate token
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })
        })

    })
    
})

app.listen(5000);