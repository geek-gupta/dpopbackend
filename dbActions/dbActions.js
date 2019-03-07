const JSON = require('circular-json');
let myDb = "";

function init(client) {
  myDb = client.db('dpopApp');
}


function addProject(data, done) {
  console.log(data);
  let project = myDb.collection('gaurav');
  var myquery = {
    name: "project"
  };
  var newvalues = {
    $push: {
      projectList: data
    }
  };
  project.updateOne(myquery, newvalues,
    function(err, result) {
      if (err) throw err;
      console.log(result.ops);
      done(result);
    });
}


function getallprojects(projectType, done) {
  let project = myDb.collection('project');

  if (projectType === "All") {
    project.find({
      "name": "project"
    }, {
      "projectList": 1
    }).toArray(function(err, result) {
      console.log(result);
      done(result[0].projectList);
    });
  } else {
    project.aggregate([{
          $match: {
            projectList: {
              $elemMatch: {
                "projectType": projectType
              }
            }
          }
        },
        {
          $unwind: "$projectList"
        },
        {
          $match: {
            "projectList.projectType": projectType
          }
        },
        {
          $group: {
            _id: "$_id",
            projectList: {
              $addToSet: "$projectList"
            }
          }
        }
      ])
      .toArray(function(err, result) {
        console.log(result[0].projectList);
        done(result[0].projectList)
      });
  }



}


module.exports = {
  addProject,
  init,
  getallprojects
};
