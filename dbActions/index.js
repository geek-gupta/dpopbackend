const dbActions = require('./dbActions');

function addLoginData(req, res) {
  dbActions.addLoginData(req.query, function(result) {
    res.send(result);
  })
}

function attemptLogin(req, res) {
  dbActions.attemptLogin(req.query,function(result) {
    res.send(result);
  })
}

function addProject(req, res) {
  var data = req.body;
  dbActions.addProject(data,function( result) {
    res.send(result);
  })
}

function getAllCategories(req, res) {
  dbActions.getAllCategories(function (result) {
    res.send(result);
  })
}

function getallprojects(req, res) {
  var projectType = req.query.projectType;
  dbActions.getallprojects(projectType, function(result){
    res.send(result);
  });
}

function getRecentNotesList(req, res) {
  dbActions.getRecentNotesList(function(result){
    res.send(result);
  })
}

function getNotes(req, res) {
  dbActions.getNotes(req.query.category, function(result){
    res.send(result);
  });
}

function getNotesBaseCategories(req, res) {
  dbActions.getNotesBaseCategories(function(result){
    res.send(result);
  });
}

module.exports =  {
  addLoginData,
  attemptLogin,
  addProject,
  getallprojects,
  getAllCategories,
  getRecentNotesList,
  getNotes,
  getNotesBaseCategories
};
