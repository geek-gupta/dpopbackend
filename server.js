const express = require('express');
const fs = require('fs');

var app = express();


app.get('/', (req, res) => {
  // res.send("Hii from Gaurav Kumar");
  res.json({
    "name": "Gaurav Kumar",
    "age": 21
  });
});

app.get('/getallprojects', (req, res) => {
  tempData = [] ;
  data = fs.readFileSync('data_files/projects.json');
  data = JSON.parse(data);
  if (req.query.projectType === "All") {
    res.json(data)
  } else {
    for (var i = 0; i < data.length; i++) {
      if (data[i].projectType === req.query.projectType) {
        tempData.push(data[i]);
      }
    }
    res.json(tempData);
  }
  console.log(tempData);

});

app.listen("9000", (error) => {
  if (error) throw err;
  console.log("Server started at: 9000");
});
