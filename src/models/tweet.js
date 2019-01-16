var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  'defaults': {
    'created_at': 'Mon Jan 22 22:22:22 +0000 2019',
    'id_str': '1',
    'text': 'dummy content',
    'user': {
      'name': 'John Doe',
      'username': 'johndoe',
      'profile_image_url': 'https://i.guim.co.uk/img/media/acb1627786c251362c4bc87c1f53fa39b49d8d3d/274_0_821_1026/master/821.jpg?width=300&quality=85&auto=format&fit=max&s=4db76b58cf107407415cf9d80c7b6c15'
    },
    'reply_count': 0,
    'retweet_count': 0,
    'favorite_count': 0,
    'coordinates': false
  }
});
