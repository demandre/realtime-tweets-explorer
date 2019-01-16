// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
// Template
var tpl = require('./index.tpl');
// Components
var TweetList = require('./components/TweetList');
var TweetMap = require('./components/TweetMap');

// CSS
require('./index.scss');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '#app',
  'template': akTemplate(tpl),
  'render': function render () {
    this.$el.html(this.template());
    var tweetList = new TweetList({'collection': this.collection});
    var tweetMap = new TweetMap({'collection': this.collection});

    tweetList.render();
    tweetMap.render();
    return this;
  }
});
