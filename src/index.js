// Libs
var Backbone = require('backbone');
// Collections
var tweetCollection = require('./collections/tweet.js');
// Controllers
var TweetExplorerController = require('./controllers/TweetExplorer');
// assets
require('./assets/index.scss');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3080');
// Router
var Router = Backbone.Router.extend({
  'routes': {
    '*action': 'default'
  }
});
var router = new Router();

router.on('route:default', function defaultView () {
  var tweetExplorerController = new TweetExplorerController({'collection': tweetCollection, 'socket': socket});

  tweetExplorerController.render();
});

Backbone.history.start({'pushState': true});
