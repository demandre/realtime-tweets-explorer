// Libs
var Backbone = require('backbone');
// Model
var Tweet = require('../models/tweet.js');

// Collection
var Tweets = Backbone.Collection.extend({
  'model': Tweet,
  'addTweet': function addTweet (tweet) {
    this.add(new Tweet(tweet));
  }
});

var tweets = new Tweets();

response.forEach(function tweetLoop (item) {
  tweets.addTweet(item);
});

module.exports = tweets;
