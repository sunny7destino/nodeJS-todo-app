var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to database
mongoose.connect('mongodb://test:test@ds123259.mlab.com:23259/nodejs-todo');

//Create a Schema
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);


//var data = [{item : 'get milk'}, {item : 'walk dog'}, {item : 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  app.get('/todo', function(req, res){
    //Get data from mongoDB and pass it to view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo', {todos : data});
    });
  });

  app.post('/todo', urlencodedParser, function(req, res){
    //Get data from view and add it to mongoDB
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res){
    //Delete the requested item from mongoDB
    Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });

};
