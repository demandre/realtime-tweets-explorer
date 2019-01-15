var template = require('ak-template');
var Backbone = require('Backbone');

var listTpl = require('./list.tpl');

module.exports = Backbone.View.extend({
  'el': '.list-tasks',
  'template': template(listTpl),
  'initialize': function initialize () {
    this.listenTo(this.collection, 'add', this.render);
  },
  'render': function render () {
    this.$el.html(this.template(this.collection.toJSON()));

    return this;
  }
});
