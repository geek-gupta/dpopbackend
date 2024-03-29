 const JSON = require('circular-json');
const fs = require('fs');
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
      if (result.length > 0 && result[0].loginData[0].isStudent === data.isStudent && result[0].loginData[0].password === data.password) {
        done({
          "isLoginSuccess": true
        });
      } else {
        done({
          "isLoginSuccess": false
        });
      }
    });

}

function addProject(data, done) {
  console.log(data);
  let project = myDb.collection('project');
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

function getAllCategories(done) {
  let project = myDb.collection('project');
  project.find({
    "name": "project"
  }, {
    "categoryList": 1
  }).toArray(function(err, result) {
    var dataToSend = {
      "categories": result[0].categoryList
    };
    done(dataToSend);
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

function getRecentNotesList(done) {
  let notes = myDb.collection('notes');
  notes.find({
    "name": "notes"
  }, {
    "recentNotesList": 1
  }).toArray(function(err, result) {
    var dataToSend = {
      "recentNotesList": result[0].recentNotesList
    };
    console.log(dataToSend);
    done(dataToSend);
  });

}

function getNotes(category, done) {

  let notes = myDb.collection('notes');
  notes.aggregate([{
        $match: {
          notesNameList: {
            $elemMatch: {
              "category": category
            }
          }
        }
      },
      {
        $unwind: "$notesNameList"
      },
      {
        $match: {
          "notesNameList.category": category
        }
      },
      {
        $group: {
          _id: "$_id",
          notesNameList: {
            $addToSet: "$notesNameList"
          }
        }
      }
    ])
    .toArray(function(err, result) {
      if(result.length < 1){
        getNotes("Android", done);
      }
      else {
        done(result[0].notesNameList);
      }
    });
}


function getNotesBaseCategories(done) {

  let notes = myDb.collection('notes');
  notes.find({
    "name": "notes"
  }, {
    "baseCategories": 1
  }).toArray(function(err, result) {
    var dataToSend = {
      "BaseCategories": result[0].baseCategories
    };
    console.log(dataToSend);
    done(dataToSend);
  });
}

function getPDF(pdfName, done) {
  console.log("I got hit in getPDF");
  var data = fs.readFileSync(`data_files/eglu.pdf`);
   done(data);
}

function addQuery(queryData, done) {
  let query = myDb.collection('query');
  let queryCount = 0;
  query.find({
    "name": "query"
  }, {
    "queries": 1
  }).toArray(function(err, result) {
      queryCount = result[0].queries.length
      queryCOUNT = queryCount + 1 ;
      queryData.queryId = queryCOUNT.toString();
      queryCount = queryCount + 1;

      var myquery = {
        name: "query"
      };
      var newvalues = {
        $push: {
          queries: queryData
        }
      };
      query.updateOne(myquery, newvalues,
        function(err, result) {
          if (err) throw err;
          done(result[0]);
        });
  });


}

function getQueries(done) {
  let query = myDb.collection('query');
  query.find({
    "name": "query"
  }, {
    "queries": 1
  }).toArray(function(err, result) {
    done(result[0].queries);
  });
}

  function getAnswerByQueryId(queryId, done) {
  let query = myDb.collection('query');
  query.aggregate([{
        $match: {
          queries: {
            $elemMatch: {
              "queryId": queryId
            }
          }
        }
      },
      {
        $unwind: "$queries"
      },
      {
        $match: {
          "queries.queryId": queryId
        }
      },
      {
        $group: {
          _id: "$_id",
          queries: {
            $addToSet: "$queries"
          }
        }
      }
    ])
    .toArray(function(err, result) {
      done(result[0].queries[0].answers)
    });
}

function addAnswerToQuery(data, done) {
  let query = myDb.collection('query');
  // query.update(
  //     { "name": "query", "queries.queryId": data.queryId},
  //     { "$push":
  //         {"queries.$.answers":
  //             {
  //                 "answeredBy": data.answeredBy,
  //                 "answer": data.answer
  //             }
  //         }
  //     }
  // )
  query.updateOne({ "name": "query", "queries.queryId": data.queryId}, { "$push":
      {"queries.$.answers":
          {
              "answeredBy": data.answeredBy,
              "answer": data.answer
          }
      }
  },
    function(err, result) {
      if (err) throw err;
      done(result);
    });
}

module.exports = {
  addLoginData,
  attemptLogin,
  addProject,
  init,
  getallprojects,
  getAllCategories,
  getNotesBaseCategories,
  getNotes,
  getRecentNotesList,
  getPDF,
  addQuery,
  getQueries,
  getAnswerByQueryId,
  addAnswerToQuery
};
