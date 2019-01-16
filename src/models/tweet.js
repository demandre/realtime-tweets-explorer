var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  'default': {
    'createAt': '',
    'id': '',
    'text': '',
    'user': {
      'name': '',
      'avatar': ''
    },
    'replyCount': 0,
    'retweetCount': 0,
    'favoriteCount': 0,
    'coordonates': false
  }
});
