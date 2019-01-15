// Dependencies
var Backbone = require('backbone');

// Models
var Task = require('../models/task.js');

// Collection
var Todo = Backbone.Collection.extend({
  'model': Task,
  'addTask': function addTask (item) {
    this.add({
      'name': item.name,
      'checked': item.checked || false
    });
  }
});

// Api response
var response = [{
  'name': 'task1',
  'checked': false
}, {
  'name': 'task2',
  'checked': false
}, {
  'name': 'task3',
  'checked': false
}];

var tasks = [];

response.forEach(function taskLoop (task) {
  tasks.push(new Task(task));
});

module.exports = new Todo(tasks);
