var template = require('ak-template');
var Backbone = require('Backbone');

var Todo = require('./index.tpl');
var List = require('./components/list');
var Input = require('./components/input');

module.exports = Backbone.View.extend({
  'el': '#app',
  'template': template(Todo),
  'render': function render () {
    this.$el.html(this.template());

    var input = new Input({
      'collection': this.collection
    });

    input.render();

    var list = new List({
      'collection': this.collection
    });

    list.render();

    return this;
  }
});
