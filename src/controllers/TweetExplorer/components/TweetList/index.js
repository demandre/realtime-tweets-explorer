// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
// Template
var tpl = require('./index.tpl');

akTemplate.globals.moment = require('moment');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '.tweet-explorer',
  'template': akTemplate(tpl),
  'render': function render () {
    Backbone.$('.tweet-list').remove();
    this.$el.prepend(this.template(this.collection));
    return this;
  }
});
