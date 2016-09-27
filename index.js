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

controller.hears(['compare','contrast', 'difference','opposed','list'], ['direct_message', 'direct_mention'], function (bot, message) {
 
 var askTypeOfComparison = function(err, convo) {
      convo.ask('Is the relationship a hierarchy or of equal parts?', function(response, convo) {
        if (response.text == 'hierarchy' || response.text == 'Hierarchy') {
        convo.say('Great.');
        askSimplicity(response, convo);
        convo.next();
      } else {
        convo.say('Great.');
        askNatureOfEqualParts(response, convo);
        convo.next();
      }
      });
    };

    var askNatureOfEqualParts = function(response, convo) {
      convo.ask('What is the nature of the individual parts? (Separate, Overlapping or Network)', function(response, convo) {
        if (response.text == 'separate' || response.text == 'Separate') {
        convo.say('Understood.')
        pickNatureOfSeparate(response, convo);
        convo.next();
      } else if (response.text == 'Overlapping' || response.text == 'overlapping') {
        convo.say('Understood.');
        displayOverlappingChart(response,convo);
        convo.next();
      } else {
      convo.say('Understood');
      displayNetworkedChart(response,convo);
      convo.next();
      }
      });
    }; 

    var displayOverlappingChart = function(response, convo) {
      convo.say('Here is a chart with overlapping components.');
    };

    var displayNetworkedChart = function(response, convo) {
      convo.say('Here is a chart with a network of components.');
    };


    var pickNatureOfSeparate = function(response, convo) {

      convo.ask('Does it contain a central idea or not? (yes or no)',[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say('Great! Here is a chart to best portray info with a central idea.');
          convo.next();
 
        }
      },
      {
        pattern: bot.utterances.no,
        callback: function(response,convo) {
          convo.say('Great! Here is a chart to best portray info composed of several independent ideas.');
          convo.next();
        }
      }, 
      {
        default: true,
        callback: function(response,convo) {
          convo.repeat();
          convo.next();
        }
      }
      ]);
    };


    var askSimplicity = function(response, convo) {
      convo.ask('What is the complexity of this hierarchy? (Simple or Complex)', function(response, convo) {
        if (response.text == 'simple' || response.text == 'Simple') {
        convo.say('Understood.')
        displaySimpleHierarchy(response, convo);
        convo.next();
      } else {
        convo.say('Understood.')
        displayComplexHierarchy(response, convo);
        convo.next();
      }
      });
    };
    var displaySimpleHierarchy = function(response, convo) {   
      convo.say('Here is your simple hierarchy chart comparison.')
    };

    var displayComplexHierarchy = function(response, convo) {   
      convo.say('Here is your complex hierarchy chart comparison..')
    };

    bot.startConversation(message, askTypeOfComparison);

});

controller.hears(['market share','segment', 'market','share', 'each'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Marimekko or 100% Stacked Bar Graph',
    text: 'You will require a 100% Stacked bar graph or a Marimekko graph to better convey this information.',
    image_url: 'https://drive.google.com/file/d/0B236v3C6xybvSmQyX1d6aG9FaWs/view?usp=sharing',
    unfurl_media:true,
    color: '#EF84B6'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})



controller.hears(['track','change', 'changed','rate','grow','growth','process'], ['direct_message', 'direct_mention'], function (bot, message) {
var askType = function(err, convo) {
      convo.ask('Would you like to show this in a cylical or non-cyclical manner?', function(response, convo) {
        
        if (response.text == 'cyclical') {
        askSteps(response, convo);
        convo.next();
      } else {
        
        showNonCyclical(response, convo);
        convo.next();
        }
      });
    };
    var askSteps = function(response, convo) {
      convo.ask('How many steps are there in this process?(max. 5)', function(response, convo) {
        convo.say('Understood.')
        displayCorrectChart(response, convo);
        convo.next();
      });
    };

var showNonCyclical = function(response, convo) {showNonCyclical
    var attachments = [{
    fallback: 'Sample Non-Cyclical Process Chart',
    title: 'NonCyclical Process Chart',
    text: 'Here is the best chart to convey this information.',
    image_url: 'https://thumb1.shutterstock.com/display_pic_with_logo/1083515/124682863/stock-vector-colorful-process-chart-module-vector-illustration-124682863.jpg',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

  };

  var endConvo = function(response,convo) {
         convo.stop();
  };

  var displayCorrectChart = function(response, convo) {
    var chartNum = parseInt(response.text, 10);
    if(chartNum == 1) {
      convo.say('You picked 1.');

    } else if(chartNum == 2) {
      convo.say('You picked 2.');

    } else if(chartNum == 3) {
      convo.say('You picked 3.');

    } else if(chartNum == 4) {

      convo.say('You picked 4.');

    } else if(chartNum == 5) {
      convo.say('You picked 5.');
    }

  };

 bot.startConversation(message, askType);

})

controller.hears(['thanks','thx','thank you'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'No problem <@' + message.user + '>!')
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
