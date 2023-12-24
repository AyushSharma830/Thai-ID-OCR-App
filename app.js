require("dotenv").config();
const express = require("express"); //importing express
const app = express();  //creating server
app.set('view engine', 'ejs');  //setting up ejs as view engine for templating
const path = require('path');   //so as to join views directory 
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public'));  //we wiil keep css and js styling files of ejs templates(present in views) in public.
app.set(express.static(path.join(__dirname, 'public')));    //so as to join public directory 
// app.use(express.urlencoded({ extension: true }));   //telling express to expect form input during post request
// const { v4: uuid } = require("uuid");   //using uuid to generate random unique id's
// const methodOverride = require('method-override');  //using this package tto trick express in beliving that incoming PATCH req. is post
// //as form from ejs can only post req.
// app.use(methodOverride('_method'));
const cloudinary = require('cloudinary').v2     //storing THAI ID images on cloudinary
const fileUpload = require('express-fileupload')    //using for taking the file input and uploading onto cloudinary

cloudinary.config({     //setting up my cloudinary account
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(fileUpload({    //setting up express-fileupload
    useTempFiles: true
}));

//After Creating Server Listening for requests on port 8080
app.listen(8080, () => {
    console.log("Listening on Port 8080");
})

//setting up home page
app.get('/', (req, res) => {
    res.render('home');  //home.ejs file is rendered which is present in views dir.
})

//creating new ocr record
app.get('/ocr/new', (req, res) => {
    res.render('ocr/new');      //new.ejs file is rendered which is present in views/ocr dir. which will take input image
})

//receiving data from ocr/new endpoint and storing it on cloudinary
app.post('/ocr', (req, res) => {
    const files = req.files.image;
    cloudinary.uploader.upload(files.tempFilePath, (error, result) => {
        console.log(result);
    });
    res.send('Done');
})