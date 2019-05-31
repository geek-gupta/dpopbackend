const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoURL = 'mongodb://localhost:27017/';
var app = express();
const dbRoute = require('./dbActions/');
const dbActions = require('./dbActions/dbActions');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/addLoginData', dbRoute.addLoginData);

app.get('/attemptLogin', dbRoute.attemptLogin);

app.post('/addProject', dbRoute.addProject);

app.get('/getAllCategories', dbRoute.getAllCategories);

app.get('/getallprojects', dbRoute.getallprojects);

app.get('/getNotesBaseCategories', dbRoute.getNotesBaseCategories);

app.get('/getRecentNotesList', dbRoute.getRecentNotesList);

app.get('/getNotes', dbRoute.getNotes);

app.get('/getPDF', dbRoute.getPDF);

app.post('/addQuery', dbRoute.addQuery);

app.get('/getQueries', dbRoute.getQueries);




app.get('/', (req, res) => {
  // res.send("Hii from Gaurav Kumar");
  res.json({
    "name": "Gaurav Kumar",
    "age": 21
  });
});

MongoClient.connect(mongoURL, function(err, client) {
  if (err) throw err;
  dbActions.init(client);
  app.listen(9000, function() {
    console.log("Server Started at 9000");
  })
})
