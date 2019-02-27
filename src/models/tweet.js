var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  'constructor': function constructor () {
    Backbone.Model.apply(this, arguments);
  },
  'defaults': {
    'created_at': null,
    'id_str': null,
    'text': null,
    'user': {
      'name': null,
      'screen_name': null,
      'profile_image_url': 'https://i.guim.co.uk/img/media/acb1627786c251362c4bc87c1f53fa39b49d8d3d/274_0_821_1026/master/821.jpg?width=300&quality=85&auto=format&fit=max&s=4db76b58cf107407415cf9d80c7b6c15'
    },
    'reply_count': 0,
    'retweet_count': 0,
    'favorite_count': 0,
    'coordinates': null
  },
  /**
   * Formats tweet given.
   * @param {object} tweet - The non-formatted tweet.
   * @return {object} formattedTweet - The formatted tweet.
   */
  'formatter': function formatter (tweet) {
    var formattedTweet = {
      'created_at': tweet.created_at,
      'id_str': tweet.id_str,
      'text': tweet.text,
      'user': {
        'name': tweet.user.name,
        'screen_name': tweet.user.screen_name,
        'profile_image_url': tweet.user.profile_image_url
      },
      'reply_count': tweet.reply_count,
      'retweet_count': tweet.retweet_count,
      'favorite_count': tweet.favorite_count,
      'coordinates': tweet.geo ? tweet.geo.coordinates : null
    };

    return formattedTweet;
  }
});
