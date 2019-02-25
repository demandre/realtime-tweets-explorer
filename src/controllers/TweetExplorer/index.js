// Libs
var Backbone = require('backbone');
var akTemplate = require('ak-template');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3080');
// Template
var tpl = require('./index.tpl');
// Components
var TweetList = require('./components/TweetList');
var TweetMap = require('./components/TweetMap');

// Controller - view
module.exports = Backbone.View.extend({
  'el': '#app',
  'template': akTemplate(tpl),
  'initialize': function initialize () {
    socket.emit('search', 'javascript');
    socket.on('tweet', function onTweet (tweet) {
      console.log(tweet);
      this.collection.addTweet(tweet);
    }.bind(this));
  },
  'render': function render () {
    this.$el.html(this.template());
    var tweetList = new TweetList({'collection': this.collection});
    var tweetMap = new TweetMap({'collection': this.collection});

    tweetList.render();
    tweetMap.render();
    return this;
  }
});
