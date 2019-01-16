// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
// Template
var tpl = require('./index.tpl');

// CSS
require('./index.scss');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '.tweet-explorer',
  'template': akTemplate(tpl),
  'render': function render () {
    console.log(this.template());
    this.$el.append(this.template());
    return this;
  }
});
