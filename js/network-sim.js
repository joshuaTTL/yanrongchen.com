"use strict";
var datastorm = datastorm || {};
datastorm.network = datastorm.network || {};

datastorm.network.sim = (function(){
  var my = {};

  var timer;
  var users = [], links = [];

  var config = {
    addUserProbability: 0.1,
    addFriendProbability: 1,
    maxUsers: 120
  };


  /*-----
  HELPERS
  -----*/
  function shouldDo(probability) {
    // Decide, based on the given probability, whether event should occur
    return Math.random() < probability;
  }

  function randomColor() {
    var color = d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    color = color.toString();
    console.log(color);
    return color;
  }

  /*----
  EVENTS
  ----*/
  function addUser() {
    if(!shouldDo(config.addUserProbability))
      return;

    if(users.length > config.maxUsers)
      return;

    var newUser = {
      id: users.length,
      chatty: 0.01 + 0.02 * Math.random(), // how often user messages
      friendly: 0.8 + 0.2 * Math.random(), // how likely user is to friend another user
      interesting: Math.random(), // how interesting the user's messages are
      subject: Math.floor(Math.random() * 10), // the user's interest area,
      friends: [],
      x: 0.5 * config.width + 10 * Math.random(), //TODO
      y: 0.5 * config.height + 10 * Math.random()//TODO
    };

    // console.log(newUser);
    users.push(newUser);
    datastorm.network.vis.networkUpdate();
  }


  function addFriend() {
    if(!shouldDo(config.addFriendProbability))
      return;

    _.each(users, function(thisUser) {
      _.each(users, function(otherUser) {
        if(thisUser === otherUser)
          return;

        var probability = otherUser.chatty * thisUser.friendly * otherUser.interesting;
        // console.log(thisUser.friends.length)
        // console.log(otherUser.friends.length)
        // console.log(users.length)

        if(thisUser.subject !== otherUser.subject)
          probability *= 0.002;

        if(!shouldDo(probability))
          return;

        var alreadyFriends = _.find(thisUser.friends, function(friend) {
          return friend.id === otherUser.id;
        });
        if(alreadyFriends)
          return;

        // I don't think we have to do this reverse check...
        // alreadyFriends = _.find(otherUser.friends, function(friend) {
        //   return friend.id === thisUser.id;
        // });
        // if(alreadyFriends)
        //   return;

        var strength = thisUser.subject === otherUser.subject ? 0.05 : 0.03;

        links.push({
          source: thisUser.id,
          target: otherUser.id,
          strength: strength
        });

        thisUser.friends.push(otherUser);
        otherUser.friends.push(thisUser);

        datastorm.network.vis.networkUpdate();
      });
    });
  }


  function update() {
    addUser();
    addFriend();
  }

  my.init = function(conf) {
    _.assign(config, conf);
  };

  my.start = function() {
    timer = setInterval(update, 50);
  }

  my.stop = function() {
    clearInterval(timer);
  }

  my.getUsers = function() {
    return users;
  }

  my.getLinks = function() {
    return links;
  }

  return my;
}());