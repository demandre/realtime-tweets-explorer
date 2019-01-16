// Libs
var Backbone = require('backbone');
// Model
var Tweet = require('../models/tweet.js');
// Api response
var response = [{
  'created_at': 'Tue Jan 15 10:22:02 +0000 2019',
  'id_str': '1085119914376077314',
  'text': 'We are hiring in the STATION F team! If you LOVE startups, with capital letters, and are looking for an internship,… https://t.co/1bqWJI5uDi',
  'user': {
    'name': 'STATION F',
    'username': 'johndoe3',
    'profile_image_url': 'http://pbs.twimg.com/profile_images/937640813395431425/HfQbWe_1_normal.jpg'
  },
  'coordinates': null,
  'retweet_count': 2,
  'favorite_count': 12
}, {
  'created_at': 'Tue Jan 15 09:48:46 +0000 2019',
  'id_str': '1085111542725644288',
  'text': 'Réparer l\'ascenseur social, s\'engager à tous les étages, soutenir l\'égalité des chances ! Bravo @BNPParibas… https://t.co/QHg9s2jb0R',
  'user': {
    'name': 'La France s\'engage',
    'username': 'johndoe1',
    'profile_image_url': 'http://pbs.twimg.com/profile_images/879939336212537345/9s_xtRrJ_normal.jpg'
  },
  'coordinates': null,
  'retweet_count': 4,
  'favorite_count': 8
}];
// Collection
var Tweets = Backbone.Collection.extend({
  'model': Tweet,
  'addTweet': function addTweet (tweet) {
    this.add(tweet);
  }
});

var tweets = new Tweets();

response.forEach(function tweetLoop (item) {
  tweets.addTweet(new Tweet(item));
});

module.exports = tweets;
