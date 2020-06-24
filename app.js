const express = require("express");
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

require('dotenv').config();


//import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const carousalRoutes =require('./routes/carousal');
const categoryRoutes = require('./routes/category');
const requestRoutes = require('./routes/request');
const movieRoutes = require('./routes/movie');
const webseriesRoutes = require('./routes/webseries');


//app
const app = express();

//db
mongoose.connect(`mongodb+srv://shekhar:${process.env.DB_PASSWORD}@cluster0-odl3n.mongodb.net/cluster0?retryWrites=true&w=majority`, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=> console.log('DATABASE connected'))
.catch(()=> console.log("Error Connecting DATABASE"));


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


//routes middlewares
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",carousalRoutes);
app.use("/api",categoryRoutes);
app.use("/api",requestRoutes);
app.use("/api",movieRoutes);
app.use("/api",webseriesRoutes);


//port
const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
    console.log(`Server is listening at ${PORT}`);
});
