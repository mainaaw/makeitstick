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
    text: 'Here is the best chart to capture brainstorming ideas.',
    image_url: 'https://lh4.googleusercontent.com/2sQ2Kx19wYnwLA47KXVX_adcF4Zil8X0y8JZ4VTxVQQDCucAc2LkSPEwh1FLOKE4wakcWqf0Q-InP_A=w1157-h816',
    unfurl_media: true,
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
    text: 'Here is the best chart to capture brainstorming ideas.',
    image_url: 'https://lh4.googleusercontent.com/nCD-bnDRkllysrSFk1TKDJ3pL61Ylq92Y9rI_K0qHQrrMtBQAv6zHBK_673hiDvdQ9atV9OROkJr7js=w1157-h816',
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
    text: 'Here is the best chart to capture brainstorming ideas.',
    image_url: 'https://lh5.googleusercontent.com/SUoZvZtOrYt65mNAJORs-WxEEznE1J03bVb1cNW42lmGqH19RqmR-HehzWlVSkJ-Y9vDtzYEZQIrnSQ=w1157-h816',
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

controller.hears(['thanks','thx','thank you'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'No problem <@' + message.user + '>!')
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
