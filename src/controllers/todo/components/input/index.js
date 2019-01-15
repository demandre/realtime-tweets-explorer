var template = require('ak-template');
var Backbone = require('Backbone');

var Input = require('./index.tpl');

module.exports = Backbone.View.extend({
  'el': '.add-task',
  'template': template(Input),
  'events': {
    'click .addInputTask input[type=submit]': 'addTask'
  },
  'render': function render () {
    this.$el.html(this.template());

    return this;
  },
  'addTask': function addTask (e) {
    e.preventDefault();

    var input = document.querySelector('.addInputTask input[type=text]');
    var item = {
      'name': input.value,
      'checked': false
    };

    this.collection.addTask(item);

    input.value = '';

    return this;
  }
});
