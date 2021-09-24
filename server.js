const express = require('express');
const app = express();
const cookieParser=require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = require("./models");
db.sequelize.sync({force: true}).then(() => {
    console.log('Server Database Ready');
}); // db.sequelize.sync({alter: true} / {force: true}) 


require('./route/routers.js')(app);
const server = app.listen(3000, function(){
    console.log('Server Listing @3000');
});