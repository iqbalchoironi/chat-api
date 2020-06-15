const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const config  = require('./config/key');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

mongoose.connect(config.mongoURI,{useNewUrlParser: true})
    .then(() => {
        console.log('DB Conected');
    })
    .catch( err => console.log(err))


const io = socketIO(server);
io.origins('*:*');
io.on('connection', socket => {
    console.log("user connected");

    socket.on('change color', (color) => {
        console.log('Color Changed to: ', color)
        io.sockets.emit('change color', color)
    })

    socket.on('message', (socket) => {
        console.log(socket)
        io.sockets.emit('message', socket);
    })

    socket.on('disconnect', () => {
        console.log('user disconnect')
    })
})

app.use('/api/users', require('./routes/users'));

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running at ${port}`)
});