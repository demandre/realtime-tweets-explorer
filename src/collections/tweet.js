// Libs
var Backbone = require('backbone');
// Model
var Tweet = require('../models/tweet.js');

// Collection
var Tweets = Backbone.Collection.extend({
  'model': Tweet,
  /**
   * Adds a tweet to the collection.
   * @param {object} tweet - The tweet data to use.
   */
  'addTweet': function addTweet (tweet) {
    if (this.length > 20) {
      this.remove(this.at(0));
    }
    this.add(new Tweet(new Tweet().formatter(tweet)));
  }
});

var tweets = new Tweets();

module.exports = tweets;
