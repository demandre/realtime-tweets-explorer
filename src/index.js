// Libs
var Backbone = require('backbone');
// Collections
var tweetCollection = require('./collections/tweet.js');
// Controllers
var TweetExplorerController = require('./controllers/TweetExplorer');

// assets
require('./assets/index.scss');
// Router
var Router = Backbone.Router.extend({
  'routes': {
    '*action': 'default'
  }
});
var router = new Router();

router.on('route:default', function defaultView () {
  var tweetExplorerController = new TweetExplorerController({'collection': tweetCollection});

  tweetExplorerController.render();
});

Backbone.history.start({'pushState': true});
