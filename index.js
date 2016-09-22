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

controller.hears(['compare','contrast', 'difference','opposed'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Bubble or Scatter',
    text: 'You will require a Bar Mekko, Bubble or Scatter graph to better convey this information.',
    color: '#F5B279'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })


  var askNumber = function(err, convo) {
      convo.ask('How many companies would you like? (max. 5)', function(response, convo) {
        convo.say('Great.');
        askRegion(response, convo);
        convo.next();
      });
    };
    var askRegion = function(response, convo) {
      convo.ask('What region would you like the result comparison for? (Domestic or Global)', function(response, convo) {
        convo.say('Understood.')
        displayChart(response, convo);
        convo.next();
      });
    };

    var displayChart = function(response, convo) {
       
      convo.say('I will have your chart ready momentarily.')
      convo.next();
    }
    bot.startConversation(message, askNumber);

});

controller.hears(['market share','segment', 'market','share', 'each'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Marimekko or 100% Stacked Bar Graph',
    text: 'You will require a 100% Stacked bar graph or a Marimekko graph to better convey this information.',
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
        convo.say('Great.');
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

var showNonCyclical = function(response, convo) {
      convo.ask('Here is a non-cyclical chart that would be appropriate for displaying this information.', function(response, convo) {
        convo.say('Understood.');
        endConvo(response, convo);
        convo.next();
      });
     
    };

  var endConvo = function(response,convo) {
         convo.stop();
  };


  var displayCorrectChart = function(response, convo) {
    var chartNum = parseInt(response.text, 10);
    convo.say('You picked ' + chartNum);

    // if(chartNum = 1) {
    //   convo.say('You picked 1.');

    // } else if(chartNum = 2) {
    //   convo.say('You picked 2.');

    // } else if(chartNum = 3) {
    //   convo.say('You picked 3.');

    // } else if(chartNum = 4) {

    //   convo.say('You picked 4.');

    // } else if(chartNum = 5) {
    //   convo.say('You picked 5.');
    // }

  };

 bot.startConversation(message, askType);





  //   var attachments = [{
  //   title: 'Bar Chart or Line Chart',
  //   text: 'You will require either a bar chart or a line chart to better convey this information.',
  //   color: '#FF0000'
  // }]

  // bot.reply(message, {
  //   attachments: attachments
  // }, function (err, resp) {0
  //   console.log(err, resp)
  // })

})





controller.hears(['comic book'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    text: 'Comic Book Attachment Test! :tada:',
    attachments: [
        {
            title: 'The Further Adventures of Slackbot',
            author_name: 'Stanford S. Strickland',
            author_icon: 'https://api.slack.com/img/api/homepage_custom_integrations-2x.png',
            image_url: 'http://i.imgur.com/OJkaVOI.jpg?1'
        },
        {
            fields: [
                {
                    title: 'Volume',
                    value: '1',
                    short: true
                },
                {
                    title: 'Issue',
                    value: '3',
                    short: true
                }
            ]
        },
        {
            title: 'Sypnopsis',
            text: 'After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy...'
        },
        {
            fallback: 'Would you recommend it to customers?',
            title: 'Would you recommend it to customers?',
            callback_id: 'comic_1234_xyz',
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: [
                {
                    name: 'recommend',
                    text: 'Recommend',
                    type: 'button',
                    value: 'recommend'
                },
                {
                    name: 'no',
                    text: 'No',
                    type: 'button',
                    value: 'bad'
                }
            ]
        }
    ]
}]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})


controller.hears(['thanks','thx','thank you'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'No problem <@' + message.user + '>!')
})

// controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
//   bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
// })
