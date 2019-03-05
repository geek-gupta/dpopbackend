let myDb = "";

function init(client) {
  myDb = client.db('dpopApp');
}

// function addProject(data, done) {
//   console.log(data);
//   let project = myDb.collection('project');
//   project.insertOne(data, function(err, result) {
//     if (err) throw err;
//     console.log(result.ops);
//     done(result);
//   })
// }

function addProject(data, done) {
  console.log(data);
  let project = myDb.collection('gaurav');
  var myquery = {
    name: "project"
  };
  var newvalues = { $push: { projectList:  data  } };
  project.updateOne(myquery, newvalues,
    function(err, result) {
      if (err) throw err;
      console.log(result.ops);
      done(result);
    });
}

function getallprojects(projectType, done) {

  let project = myDb.collection('project');
  project.remove({
    "name": "Gaurav Kumar"
  }, function(err, result) {
    console.log("Deleted");
  });
  if (projectType === "All") {
    project.find({}).toArray(function(err, result) {
      done(result);
    });
  } else {
    project.find({
      "projectType": projectType
    }).toArray(function(err, result) {
      done(result);
    });
  }

}


module.exports = {
  addProject,
  init,
  getallprojects
};
