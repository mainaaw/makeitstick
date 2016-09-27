var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_message', 'direct_mention'], function (bot, message) {
  controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hi, <@'+ message.user + '>! I hope you\'re doing well today.');
        } else {
            bot.reply(message, 'Hi, <@'+ message.user + '>!  What do you want to do?')
        }
    });
})

controller.hears(['capture','brainstorming', 'brainstorm','Brainstorm'], ['direct_message', 'direct_mention'], function (bot, message) {
var askType = function(err, convo) {
      convo.ask('How many ideas are you working with?', function(response, convo) {
        var ideasNum = parseInt(response.text, 10);
        
        if (ideasNum < 6) {
        showFewIdeasHoneyComb(response, convo);
        convo.next();
      } else if (ideasNum > 5 && ideasNum < 13) {
        
        showMediumNumIdeasHoneyComb(response, convo);
        convo.next();
        }
         else {
          showHighNumIdeasHoneyComb(response,convo);
          convo.next();
         }
      });
    };

var showFewIdeasHoneyComb = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Honeycomb Brainstorm',
    text: 'Here is the best chart to capture '+ response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.6.jpg?alt=media&token=939cca69-b3e2-4407-b7ed-d18dc2019379',
    unfurl_links: true,
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
  };

  var showMediumNumIdeasHoneyComb = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Honeycomb Brainstorm',
    text: 'Here is the best chart to capture ' + response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.20.jpg?alt=media&token=01aef010-7815-4f21-93f7-9b7452181b35',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

  var showHighNumIdeasHoneyComb = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Honeycomb Brainstorm',
    text: 'Here is the best chart to capture ' + response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.20.jpg?alt=media&token=01aef010-7815-4f21-93f7-9b7452181b35',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

 bot.startConversation(message, askType);

})


controller.hears(['Organize','organize', 'Mindmap','mindmap'], ['direct_message', 'direct_mention'], function (bot, message) {
var askType = function(err, convo) {
      convo.ask('How many big ideas are you working with?', function(response, convo) {
        var ideasNum = parseInt(response.text, 10);
        
        if (ideasNum < 4) {
        showFewIdeas(response, convo);
        convo.next();
      } else if (ideasNum > 3 && ideasNum < 6) {
        
        showMediumNumIdeas(response, convo);
        convo.next();
        }
         else {
          showHighNumIdeas(response,convo);
          convo.next();
         }
      });
    };

var showFewIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Concept Map',
    text: 'Here is the best chart to capture '+ response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.3.jpg?alt=media&token=1d8da986-bb09-4e2c-a7d9-8340ab0df91b',
    unfurl_links: true,
    unfurl_media:true,
    color: '#EF84B6'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
  };

  var showMediumNumIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Concept Map',
    text: 'Here is the best chart to capture ' + response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.4.jpg?alt=media&token=783c4970-247b-4f71-b94a-734214ff8cb9',
    unfurl_media: true,
    color: '#EF84B6'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

  var showHighNumIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Honeycomb Brainstorm',
    title: 'Concept Map',
    text: 'Here is the best chart to capture ' + response.text + ' brainstorming ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.6.jpg?alt=media&token=b03de50f-02a9-410a-a53d-bf53d7d3d359',
    unfurl_media: true,
    color: '#EF84B6'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

 bot.startConversation(message, askType);

  })



controller.hears(['thanks','thx','thank you'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'No problem <@' + message.user + '>!')
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
