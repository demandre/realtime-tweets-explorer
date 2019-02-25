// Libs
var Backbone = require('backbone');
// Model
var Tweet = require('../models/tweet.js');

// Collection
var Tweets = Backbone.Collection.extend({
  'model': Tweet,
  'addTweet': function addTweet (tweet) {
    if (this.length > 20) {
      this.remove(this.at(0));
    }
    this.add(new Tweet(tweet));
  }
});

var tweets = new Tweets();

module.exports = tweets;
