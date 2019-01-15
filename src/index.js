// Dependencies
var Backbone = require('backbone');

// Collections
var todoCollection = require('./collections/todo.js');

// Controllers
var TodoController = require('./controllers/todo');

// Router
var Router = Backbone.Router.extend({
  'routes': {
    '*actions': 'tasksList'
  }
});

var router = new Router();

router.on('route:tasksList', function defautRoute () {
  var todoController = new TodoController({
    'collection': todoCollection
  });

  todoController.render();
});

Backbone.history.start({
  'pushState': true
});
