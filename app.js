const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/database");
const morgan = require('morgan')
require('dotenv').config();


// Connecting database
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database connection confirmation
mongoose.connection.on("connected", () => {
    console.info("Connected to database " + config.database);
});

// On db error
mongoose.connection.on('error', (err) => {
    console.error('Database error: ' + err);
  });

const app = express();
const port = process.env.PORT

// CORS Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(morgan('dev'))

// Defining principal routing
const users = require('./routes/user');
const message = require('./routes/message');

const router = express.Router();
app.use("/api", router);

// API Routing
router.use('/user', users)
router.use('/message', message)





app.listen(port, () => {
    console.log("Server started on port " + port);
});