const JSON = require('circular-json');
let myDb = "";

function init(client) {
  myDb = client.db('dpopApp');
}

function addLoginData(data, done) {
  console.log(data);
  let login = myDb.collection('login');
  var myquery = {
    name: "login"
  };
  var newvalues = {
    $push: {
      loginData: data
    }
  };
  login.updateOne(myquery, newvalues,
    function(err, result) {
      if (err) throw err;
      console.log(result.ops);
      done(result);
    });
}

function attemptLogin(data, done) {
  let login = myDb.collection('login');
  console.log(data);
  login.aggregate([{
        $match: {
          loginData: {
            $elemMatch: {
              "userName": data.userName
            }
          }
        }
      },
      {
        $unwind: "$loginData"
      },
      {
        $match: {
          "loginData.userName": data.userName
        }
      },
      {
        $group: {
          _id: "$_id",
          loginData: {
            $addToSet: "$loginData"
          }
        }
      }
    ])
    .toArray(function(err, result) {
      console.log(result);
      if(result.length > 0 && result[0].loginData[0].isStudent === data.isStudent){
        done({"isLoginSuccess": true});
      }else{
        done({"isLoginSuccess": false});
      }
    });

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
  if(projectType === "All") {
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
  addLoginData,
  attemptLogin,
  addProject,
  init,
  getallprojects
};
