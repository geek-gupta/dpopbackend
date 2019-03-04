const dbActions = require('./dbActions');



function addProject(req, res) {
  var data = req.body;
  dbActions.addProject(data,function( result) {
    res.send(result);
  })
}

function getallprojects(req, res) {
  var projectType = req.query.projectType;
  dbActions.getallprojects(projectType, function(result){
    res.send(result);
  });
}


module.exports =  {
  addProject,
  getallprojects
};
