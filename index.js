'use strict'

var Botkit = require('botkit')


// //----->>>>>>Single team start
// var token = process.env.SLACK_TOKEN


var controller = Botkit.slackbot({
    // reconnect to Slack RTM when connection goes bad
    retry: Infinity,
    debug: false
})

// //Assume single team mode if we have a SLACK_TOKEN
// if (token) {
//     console.log('Starting in single-team mode')
//     controller.spawn({
//             token: token
//         }).startRTM(function(err, bot, payload) {
//             if (err) {
//                 throw new Error(err)
//             }

//             console.log('Connected to Slack RTM')
//         })
//         // Otherwise assume multi-team mode - setup beep boop resourcer connection
// } else {
//     console.log('Starting in Beep Boop multi-team mode')
//     require('beepboop-botkit').start(controller, { debug: true })
//  }
//  //------->>>>>>>Single team end
//var controller = Botkit.slackbot()
// Beepboop manages the hosting infrastructure for your bot and  publishes events
// when a team adds, updates, or removes the bot, thereby enabling multitenancy
// (multiple team instances of bot in one bot process). The beepboop-botkit package
// listens for those events handles and starting/stopping the given team bot for you.
// It is the develper's responsiblity to ensure any state stored outside of the configs
// set in the project's bot.yml supports multitency (if you allow multiple teams to run your bot)
var beepboop = require('./resfile.js')
beepboop.start(controller, {
  debug: true
})


// Send the user who added the bot to their team a welcome message the first time it's connected
beepboop.on('botkit.rtm.started', function (bot, resource, meta) {
  var slackUserId = resource.SlackUserID

  if (meta.isNew && slackUserId) {
    bot.api.im.open({ user: slackUserId }, function (err, response) {
      if (err) {
        return console.log(err)
      }
      var dmChannel = response.channel.id
      bot.say({channel: dmChannel, text: 'Thanks for adding me to your team!Type `help` to get :speaking_head_in_silhouette: assistance.'})
    })
  }
})


var postToCommentbox = function(response, convo) {
    // begin of POST request to AWS-API
            var url = 'https://mbk8u331s1.execute-api.us-west-2.amazonaws.com/stickproduction/commentrelay';
            var method = 'POST';
            var testData = {
                "Records": [{
                    "Sns": {
                        "Subject": "Help Request",
                        "Message": response.text
                    }
                }]
            }
            var postData = JSON.stringify(testData);
            var async = true;

            var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
            var request = new XMLHttpRequest();

            request.onload = function() {
                var status = request.status;
                var data = request.responseText;
            }

            request.open(method, url, async);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            request.send(postData);
            // end of POST request to AWS-API

}

var promptUserComment = function(response,convo) {
            convo.ask('What do you think?', function(response,convo) {
            postToCommentbox(response,convo);
            convo.say(':+1: :+1:');
            convo.next();
            })
    }


controller.on('bot_channel_join', function(bot, message) {
    bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi','hey'], ['direct_message', 'direct_mention'], function(bot, message) {
        controller.storage.users.get(message.user, function(err, user) {
                bot.reply(message, 'Hi, <@' + message.user + '>! What can I help you show today? \n Type `help` to get :speaking_head_in_silhouette: assistance.')

        });
    })

controller.hears(['help', 'Help','HELP'], ['direct_message','direct_mention'], function(bot, message) {


var showMenu = function(response, convo) {

    var message_with_Attachments = {

    text: 'Hi, I\'m Spencer. I\'m Stick\'s design intern :wink:, and I\'m here to help you. Here\'s what I can do :muscle:',
    attachments : [{
    //pretext: ':car: :car:',
    title: ':thinking_face: Organize Ideas',
    text: 'I can show you the best ways of summarizing brainstorms :thunder_cloud_and_rain: or how to build mindmaps.',
    color: '#7CD197'
  },
  {
    title: ':scales: Compare Things',
    text: 'I can give you the best ways of presenting a comparison, show a problem and solution, or the change from :seedling: to :deciduous_tree:.',
    color: '#EF84B6'
  },
  {
    title: ':busts_in_silhouette: Listing People or Ideas',
    text: 'Lists of product features, team members, interview insights can be boring but I can show you a more :eyes: way to show them.',
    color: '#A17DF1'
  },
  {
    title: ':hourglass_flowing_sand: Showing a Process',
    text: 'I can quickly generate process maps for linear or cyclical :film_frames:, or timelines with milestones.',
    color: '#F5B279'
  },
  {
    title: ':cake:: :birthday: Show Parts of a Whole',
    text: 'If you have this broad idea you would like to break down :hammer_and_pick:, like customer segmentation, targeting users, or a mission and vision, I can help with that, too.',
    color: '#7CD197'
  }]
}
convo.say(message_with_Attachments);
};

  bot.startConversation(message, showMenu);

})

//Section B1 - B2.6
//Section B1
controller.hears(['ideas', 'brainstorming', 'brainstorm', 'Brainstorm'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to organize :bulb: from a brainstorm. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Brainstorming',
                title: 'Sample Brainstorming Diagram',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FB1.Example.png?alt=media&token=0cabda0c-233e-46e9-826e-4ca26e6a1fdb',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('About how many :bulb: ideas  are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum < 6) {
                    showFewIdeasHoneyComb(response, convo);
                    convo.next();
                } else if (ideasNum > 5 && ideasNum < 13) {
                    showMediumNumIdeasHoneyComb(response, convo);
                    convo.next();
                } else {
                    showHighNumIdeasHoneyComb(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }

    var showFewIdeasHoneyComb = function(response, convo) {
        var attachments = [{
            fallback: 'Honeycomb Brainstorm',
            title: 'Honeycomb Brainstorm',
            text: 'Here is a chart that might work for :thunder_cloud_and_rain:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.6.jpg?alt=media&token=939cca69-b3e2-4407-b7ed-d18dc2019379',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showMediumNumIdeasHoneyComb = function(response, convo) {
        var attachments = [{
            fallback: 'Honeycomb Brainstorm',
            title: 'Honeycomb Brainstorm',
            text: 'Here is a chart that might work for :thunder_cloud_and_rain:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.12.jpg?alt=media&token=5c4a8c87-0bb0-48ee-bc2a-d4907e7424ed',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showHighNumIdeasHoneyComb = function(response, convo) {
        var attachments = [{
            fallback: 'Honeycomb Brainstorm',
            title: 'Honeycomb Brainstorm',
            text: 'Here is a chart that might work.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB1.20.jpg?alt=media&token=01aef010-7815-4f21-93f7-9b7452181b35',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})

//Section B2
//https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FB2.Example.png?alt=media&token=eb4c20da-08e5-4bd6-9360-6b2d7cc76ae9


controller.hears(['Concept', 'concept', 'Mindmap', 'mindmap'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to organize :bulb: ideas or concepts.',
            attachments: [{
                fallback: 'Organizing Thoughts',
                title: 'Sample Concept Map',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FB2.Example.png?alt=media&token=eb4c20da-08e5-4bd6-9360-6b2d7cc76ae9',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('About how many :bulb: ideas are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum < 4) {
                    showFewIdeas(response, convo);
                    convo.next();
                } else if (ideasNum > 3 && ideasNum < 6) {
                    showMediumNumIdeas(response, convo);
                    convo.next();
                } else {
                    showHighNumIdeas(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showFewIdeas = function(response, convo) {
        var attachments = [{
          fallback: 'Concept Map',
          title: 'Concept Map',
          text: 'Here is a chart that might work.',
          image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.3.jpg?alt=media&token=1d8da986-bb09-4e2c-a7d9-8340ab0df91b',
          unfurl_media: true,
          color: '#EF84B6'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showMediumNumIdeas = function(response, convo) {
        var attachments = [{
            fallback: 'Concept Map',
            title: 'Concept Map',
            text: 'Here is a chart that might work.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.4.jpg?alt=media&token=783c4970-247b-4f71-b94a-734214ff8cb9',
            unfurl_media: true,
            color: '#EF84B6'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showHighNumIdeas = function(response, convo) {
        var attachments = [{
            fallback: 'Concept Map',
            title: 'Concept Map',
            text: 'Here is a chart that might work.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FB2.6.jpg?alt=media&token=b03de50f-02a9-410a-a53d-bf53d7d3d359',
            unfurl_media: true,
            color: '#EF84B6'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})



//Section C1 - C3

//Comparison C1

controller.hears(['compare', 'comparison', 'Comparison', 'compare', 'criteria', 'Criteria', '2x2', 'two things', 'multiple variables'], ['direct_message', 'direct_mention'], function(bot, message) {
    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to represent a comparison of mutiple variables. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Comparison',
                title: 'Sample Comparison Diagram',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FC1.Example.png?alt=media&token=efcc1bea-8035-4a5e-a242-5e5958c90a03',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {
        convo.ask('Would you like a diagram such as this?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                showComparison(response, convo);
                promptUserComment(response,convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }])
    }

    var showComparison = function(response, convo) {
        var attachments = [{
            fallback: '2x2 Comparison',
            title: '2x2 Comparison',
            text: 'Here is a chart that might work well for this :scales:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FC1.jpg?alt=media&token=c2795e6b-a320-45e9-b189-71b5613960fd',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    }
    bot.startConversation(message, showBlank);
});

//Comparison C3
controller.hears(['before', 'after', 'change of state', 'change', 'problem', 'solution', 'before and after'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to represent a change between two states. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Before and After',
                title: 'Before and After Diagram',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FC3.Example.png?alt=media&token=dcf62117-50ca-45a1-b77e-81ba82b85631',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {
        convo.ask('Would you like a diagram such as this?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                showComparison(response, convo);
                promptUserComment(response,convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }])
    }

    var showComparison = function(response, convo) {
        var attachments = [{
            fallback: 'Before and After',
            title: 'Before and After',
            text: 'Here is a chart that might work well here.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FC3.jpg?alt=media&token=e648194f-f021-4376-bd37-fd5bf5bfc4d3',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    }
    bot.startConversation(message, showBlank);
});

//Comparison C2

controller.hears(['decision', 'Decision', 'alternative', 'Alternative', 'alternatives', 'Alternatives', 'choice', 'choices', 'options', 'Options', 'pros and cons'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to frame a decision. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Decision',
                title: 'Sample Decision Diagram',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FC2.Example.png?alt=media&token=72e3d2ec-2427-4cf2-b487-b11d3c045f7f',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('Are you making a decision between 2 or 3 alternatives?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                 if (ideasNum == 2) {
                    showTwoOptions(response, convo);
                    convo.next();
                } else if (ideasNum == 3) {
                    showThreeOptions(response, convo);
                    convo.next();
                } else {
                    convo.say(':bellhop_bell: Let me connect you to an expert');
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showTwoOptions = function(response, convo) {
        var attachments = [{
            fallback: 'Decision Making',
            title: 'Decision Making',
            text: 'Here is a chart that might work to frame this decision :scales:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FC2.2.jpg?alt=media&token=4aa98f4a-f580-400c-8c28-289f3bf96935',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showThreeOptions = function(response, convo) {
        var attachments = [{
            fallback: 'Decision Making',
            title: 'Decision Making',
            text: 'Here is a chart that might work to frame this :scales: decision. ',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FC2.3.jpg?alt=media&token=13cec4f2-7197-4f22-a386-cb7c1843ea93',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})



// List L1.3 ~ L1.5
//List L1

controller.hears(['interview', 'quote', 'theme', 'Interview', 'Quote', 'quotes', 'user quotes', 'interview quotes', 'interviews', 'interview insights', 'insights from interviews'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to capture insights from interviews.',
            attachments: [{
                fallback: 'Interview Themes',
                title: 'Sample Interview Theme Map',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FL1.Example.png?alt=media&token=1c542b8f-0b34-4879-ae50-dd4d73042a04',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('About how many themes are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 3) {
                    showThreeThemes(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourThemes(response, convo);
                    convo.next();
                } else {
                    showFiveThemes(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showThreeThemes = function(response, convo) {
        var attachments = [{
          fallback: 'Interview Themes',
          title: 'Interview Themes',
          text: 'Here is a chart that might work to capture this.',
          image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL1.3.jpg?alt=media&token=856baf7b-05c7-4451-8a4b-f78edb31bf05',
          unfurl_media: true,
          color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourThemes = function(response, convo) {
        var attachments = [{
            fallback: 'Interview Themes',
            title: 'Interview Themes',
            text: 'Here is a chart that might work to capture this.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL1.4.jpg?alt=media&token=a15f2896-617c-4a4e-9478-fdfaed0cc730',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFiveThemes = function(response, convo) {
        var attachments = [{
            fallback: 'Interview Themes',
            title: 'Interview Themes',
            text: 'Here is a chart that might work to capture your concepts.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL1.5.jpg?alt=media&token=fe1f7c75-d9e5-46ed-86e4-b6fa7b4c4ba7',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})

// List L3

controller.hears(['feature', 'benefit', 'impact', 'features', 'Benefit', 'Impact', 'product features', 'product feature', 'feature benefit', 'features and benefits'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to represent the features and benefits for your product. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Feature Benefit Impact Map',
                title: 'Feature Benefit Impact Map',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FL3.Example.png?alt=media&token=15f8d8c5-6ec1-43db-ae93-ac89d9377b22',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {
        convo.ask('Would you like a diagram such as this?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                showComparison(response, convo);
                promptUserComment(response,convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }])
    }

    var showComparison = function(response, convo) {
        var attachments = [{
            fallback: 'Feature Benefit Impact Map',
            title: 'Feature Benefit Impact Map',
            text: 'Here is a chart that might work well for you to explain a before and after situation like yours.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL3.jpg?alt=media&token=d57a6914-0aa5-414e-a9b0-0840a5d4e5dc',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    }
    bot.startConversation(message, showBlank);
});

// List L4

controller.hears(['team', 'member', 'Team', 'Member', 'board', 'advisors', 'team members', 'organization', 'panel'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to introduce a team or company. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Team Page',
                title: 'Sample Team Page',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FL4.Example.png?alt=media&token=a2b69a6d-5572-4f87-a1a3-f2b9c22a3037',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('How many team members do you have?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 3) {
                    showThreeTeams(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourTeams(response, convo);
                    convo.next();
                } else {
                    showSixTeams(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showThreeTeams = function(response, convo) {
        var attachments = [{
            fallback: 'Team',
            title: 'Team',
            text: 'Try this classic for ' + response.text + '.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL4.3.jpg?alt=media&token=5a7aee79-a12f-48a6-bcfa-3b7cbb7d7496',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
        
    };

    var showFourTeams = function(response, convo) {
        var attachments = [{
            fallback: 'Team',
            title: 'Team',
            text: 'Try this classic for ' + response.text + '.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL4.4.jpg?alt=media&token=e7623b89-5661-402f-b78d-ae4269ee0e85',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showSixTeams = function(response, convo) {
        var attachments = [{
            fallback: 'Team',
            title: 'Team',
            text: 'Try this classic for ' + response.text + ' teams.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL4.6.jpg?alt=media&token=97a1a0ae-1e82-42d0-a29d-3ab2c92de311',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})




// List L5

controller.hears(['user testing', 'user test', 'user test summary', 'user test results', 'user research', 'observations', 'observing users'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to show results from a user test. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'User Test Summary',
                title: 'Sample User Test Summary',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FL5.Example.png?alt=media&token=7a2a1a93-d213-43ce-85a6-eb2838cbdd63',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('Do you want a "high level" or "detailed" chart?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                 if (ideasNum == 'high level') {
                    showHighLevel(response, convo);
                    convo.next();
                } else if (ideasNum == 'detailed') {
                    showDetailed(response, convo);
                    convo.next();
                } else {
                    convo.say(':bellhop_bell: Let me connect you to an expert');
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showHighLevel = function(response, convo) {
        var attachments = [{
            fallback: 'High Level User Test Summary',
            title: 'User Test Summary',
            text: 'Here is a chart that is good for showing user test summaries.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL5.1.jpg?alt=media&token=d3b45c96-8cbb-4fef-8000-0ca1f6914a0a',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showDetailed = function(response, convo) {
        var attachments = [{
            fallback: 'User Test Summary',
            title: 'Detailed User Test Summary',
            text: 'Here is a good chart for showing more detailed summaries of user testing and ' + response.text + '.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL5.2.jpg?alt=media&token=b2b58fb3-abce-489f-86e2-d0ee28e4fe05',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})

// List L6

controller.hears(['product market fit', 'product market', 'product use case'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to represent product market fit. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Product User Impact',
                title: 'Product User Impact',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FL6.Example.png?alt=media&token=a5cdb9c8-5f5a-4676-b9bd-bb22f395436a',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {
        convo.ask('Would you like a diagram such as this?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                showComparison(response, convo);
                promptUserComment(response,convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }])
    }

    var showComparison = function(response, convo) {
        var attachments = [{
            fallback: 'Product User Impact',
            title: 'Product User Impact',
            text: 'Here is a chart that might work well for you to explain the impact of your product.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL6.jpg?alt=media&token=e78f741a-059c-4965-8bf9-3933afbe5e24',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    }
    bot.startConversation(message, showBlank);
});

// Process P1

controller.hears(['process', 'linear', 'flow', 'series', 'action', 'Process', 'Linear', 'Flow', 'Series', 'Action', 'roadmap', 'plan'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to show a linear process. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Linear Process',
                title: 'Sample Linear Process Diagram',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FP1.Example.png?alt=media&token=fac7516a-cc28-414b-bd4e-99654d04a585',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('About how many steps are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 3) {
                    showThreeSteps(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourSteps(response, convo);
                    convo.next();
                } else if (ideasNum == 5) {
                    showFiveSteps(response, convo);
                    convo.next();
                } else {
                    showSixSteps(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showThreeSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Linear Process',
            title: 'Linear Process',
            text: 'What about this classic chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP1.3.jpg?alt=media&token=ce9bf061-4c38-4ce5-a89f-d32a7111a9da',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Linear Process',
            title: 'Linear Process',
            text: 'What about this classic chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP1.4.jpg?alt=media&token=513331ea-00af-44db-8c51-f94c55265249',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFiveSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Linear Process',
            title: 'Linear Process',
            text: 'What about this classic chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP1.5.jpg?alt=media&token=fbfa6ffe-8d90-4b58-be8c-cc8e54b05724',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showSixSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Linear Process',
            title: 'Linear Process',
            text: 'What about this classic chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP1.6.jpg?alt=media&token=244ca743-7bba-49a2-b43d-ca3645294269',
            unfurl_media: true,
            color: '#FF0000'
        }]
        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };


    bot.startConversation(message, showBlank);

})

// Process P3

controller.hears(['repeating', 'cycle', 'Repeating', 'Cycle', 'cyclical process', 'loop', 'Loop'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to show a cyclical process. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Cycle',
                title: 'Sample Cycle',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FP3.Example.png?alt=media&token=54c0a240-0875-4e9f-ace7-b26c298b946b',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('How many steps are in the process you want to show?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 2) {
                    showTwoSteps(response, convo);
                    convo.next();
                } else if (ideasNum == 3) {
                    showThreeSteps(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourSteps(response, convo);
                    convo.next();
                } else if (ideasNum == 5) {
                    showFiveSteps(response, convo);
                    convo.next();
                } else {
                    showSixSteps(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }

    var showTwoSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Cyclical Process',
            title: 'Cyclical Process',
            text: 'For your cyclical process, what about this chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP3.2.jpg?alt=media&token=ef04d847-72c4-4e71-a1c5-4c9753bedd43',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showThreeSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Cyclical Process',
            title: 'Cyclical Process',
            text: 'For your cyclical process, what about this chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP3.3.jpg?alt=media&token=e3d22d26-f40f-49a6-b8c2-196e81e42c4f',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Cyclical Process',
            title: 'Cyclical Process',
            text: 'For your cyclical process, what about this chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP3.4.jpg?alt=media&token=3adff828-ffff-4e54-ae26-9d4030bc813f',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFiveSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Cyclical Process',
            title: 'Cyclical Process',
            text: 'For your cyclical process, what about this chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP3.5.jpg?alt=media&token=14efcce6-c4c7-41b5-a33b-ca9691fd1e22',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showSixSteps = function(response, convo) {
        var attachments = [{
            fallback: 'Cyclical Process',
            title: 'Cyclical Process',
            text: 'For your cyclical process, what about this chart to capture ' + response.text + ' processes?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP3.6.jpg?alt=media&token=414ecce0-1bd2-410d-b83f-ff3ea2b916e7',
            unfurl_media: true,
            color: '#FF0000'
        }]


        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})



// Process P6

controller.hears(['milestone', 'timeline', 'progress', 'Milestone', 'Timeline', 'Progress', 'milestones', 'Milestones'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to show a timeline with milestones. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Milestones',
                title: 'Sample Process with Milestones',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FP6.Example.png?alt=media&token=bfe1bee9-5db1-4142-9af7-f9600411fdb1',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('How many milestones are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 3) {
                    showThreeMilestones(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourMilestones(response, convo);
                    convo.next();
                } else if (ideasNum == 5) {
                    showFiveMilestones(response, convo);
                    convo.next();
                } else {
                    showSixMilestones(response, convo);
                    convo.next();
                }
                promptUserComment(response,text);
            });
    }


    var showThreeMilestones = function(response, convo) {
        var attachments = [{
            fallback: 'Milestone Timeline',
            title: 'Milestone Timeline',
            text: 'What about this classic chart to capture ' + response.text + '?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP6.3.jpg?alt=media&token=0062c3d5-1e53-4976-8f50-d742cb5997f7',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourMilestones = function(response, convo) {
        var attachments = [{
            fallback: 'Milestone Timeline',
            title: 'Milestone Timeline',
            text: 'What about this classic chart to capture ' + response.text + '?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP6.4.jpg?alt=media&token=3fb223ce-dbdb-41e7-a6f0-9dc330e50cb6',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFiveMilestones = function(response, convo) {
        var attachments = [{
            fallback: 'Milestone Timeline',
            title: 'Milestone Timeline',
            text: 'What about this classic chart to capture ' + response.text + '?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP6.5.jpg?alt=media&token=f992f3d5-c6d2-4286-b548-cf8c85ad979e',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showSixMilestones = function(response, convo) {
        var attachments = [{
            fallback: 'Milestone Timeline',
            title: 'Milestone Timeline',
            text: 'What about this classic chart to capture ' + response.text + '?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP6.6.jpg?alt=media&token=3fdd8305-0690-421c-8fc9-951297a9dda3',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})



// Structure S1 ~ S5
// Structure S1

controller.hears(['vision', 'mission', 'values', 'culture', 'program', 'principles', 'tenants', 'big idea'], ['direct_message', 'direct_mention'], function(bot, message) {


    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It sounds like you want to show a big idea with key tenants. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'Pillars',
                title: 'Sample Pillars',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FS1.Example.png?alt=media&token=eb248c47-a5eb-4405-8852-4161b8870dca',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('How many pillars are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 3) {
                    showThreePillars(response, convo);
                    convo.next();
                } else if (ideasNum == 4) {
                    showFourPillars(response, convo);
                    convo.next();
                } else if (ideasNum == 5) {
                    showFivePillars(response, convo);
                    convo.next();
                } else {
                    showSixPillars(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showThreePillars = function(response, convo) {
        var attachments = [{
            fallback: 'Pillars',
            title: 'Pillars',
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. Does it work for what you are trying to show?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS1.3.jpg?alt=media&token=0675895e-091f-4524-b60f-713583948b14',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourPillars = function(response, convo) {
        var attachments = [{
            fallback: 'Pillars',
            title: 'Pillars',
            text: 'This is a good chart for high-level :bulb: ideas like ' + response.text + ' and vision and mission statements. Does it work for what you are trying to show?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS1.4.jpg?alt=media&token=7b188f17-fbba-44ee-b660-39bde5e39ada',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFivePillars = function(response, convo) {
        var attachments = [{
            fallback: 'Pillars',
            title: 'Pillars',
            text: 'This is a good chart for high-level :bulb: ideas like ' + response.text + ' and vision and mission statements. Does it work for what you are trying to show?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS1.5.jpg?alt=media&token=6006ff18-6386-485c-86b6-412234a13ff8',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showSixPillars = function(response, convo) {
        var attachments = [{
            fallback: 'Pillars',
            title: 'Pillars',
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. Does it work for what you are trying to show?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS1.6.jpg?alt=media&token=45285394-fb98-44ea-9110-1cf1362361d7',
            unfurl_media: true,
            color: '#FF0000'
        }]


        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})

// Structure S3

controller.hears(['define user', 'target user', 'user groups', 'target customer'], ['direct_message', 'direct_mention'], function(bot, message) {

    var showBlank = function(response, convo) {

        var initial_with_blank = {
            text: 'It :rabbit: sounds like you want to define your target user based on a set of attributes. Here is a sample diagram that you could you use.',
            attachments: [{
                fallback: 'User Groups',
                title: 'Sample User Groups',
                image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FS3.Example.png?alt=media&token=59721729-9e1f-44c5-8699-ca9bebc609be',
                unfurl_media: true,
                color: '#7CD197'
            }]
        }
        convo.say(initial_with_blank);
        askType(response, convo);
        convo.next()
    };

    var askType = function(response, convo) {

        convo.ask('Do you think something like this could work?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                numOptions(response, convo);
                convo.next();
            }
        }, {
            pattern: bot.utterances.no,
            callback: function(response, convo) {

                convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
                convo.next();
            }
        }, {
            default: true,
            callback: function(response, convo) {
                convo.say(':confused: I\'m sorry I didn\'t quite catch that');
                convo.repeat();
                convo.next();
            }
        }]);

    };

    var numOptions = function(response, convo) {
        convo.ask('About how many attributes are you working with?',
            function(response, convo) {
                var ideasNum = parseInt(response.text, 10);
                if (ideasNum > 0 && ideasNum <= 2) {
                    showTwoGroups(response, convo);
                    convo.next();
                } else if (ideasNum == 3) {
                    showThreeGroups(response, convo);
                    convo.next();
                } else {
                    showFourGroups(response, convo);
                    convo.next();
                }
                promptUserComment(response,convo);
            });
    }


    var showTwoGroups = function(response, convo) {
        var attachments = [{
            fallback: 'User Groups',
            title: 'User Groups',
            text: 'Here is a good chart that might work here for :busts_in_silhouette:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS3.2.jpg?alt=media&token=38761a80-7f32-4344-a47e-986a524e7eca',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showThreeGroups = function(response, convo) {
        var attachments = [{
            fallback: 'User Groups',
            title: 'User Groups',
            text: 'Here is a good chart that might work for :busts_in_silhouette:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS3.3.jpg?alt=media&token=91428c1a-93e4-45af-9dca-e86ba9b60cf7',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    var showFourGroups = function(response, convo) {
        var attachments = [{
            fallback: 'User Groups',
            title: 'User Groups',
            text: 'Here is a good chart that might work for :busts_in_silhouette:.',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS3.4.jpg?alt=media&token=f2d7a575-661c-4114-88bc-d15b8e9e7d50',
            unfurl_media: true,
            color: '#FF0000'
        }]

        bot.reply(message, {
            attachments: attachments
        }, function(err, resp) {
            0
            console.log(err, resp)
        })
    };

    bot.startConversation(message, showBlank);

})


// Structure S5

// controller.hears(['segment', 'customer', 'Segment', 'Customer', 'segment customers', 'customer segmentation', 'segmentation'], ['direct_message', 'direct_mention'], function(bot, message) {

//     var showBlank = function(response, convo) {

//         var initial_with_blank = {
//             text: 'It sounds like you want to segment your customers. Here is a sample diagram that you could you use.',
//             attachments: [{
//                 fallback: 'Customer Segmentation',
//                 title: 'Customer Segmentation',
//                 image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FS5.Example.png?alt=media&token=36603e21-cb48-4500-a0e7-9a081cba0793',
//                 unfurl_media: true,
//                 color: '#7CD197'
//             }]
//         }
//         convo.say(initial_with_blank);
//         askType(response, convo);
//         convo.next()
//     };

//     var askType = function(response, convo) {

//         convo.ask('Do you think something like this could work?', [{
//             pattern: bot.utterances.yes,
//             callback: function(response, convo) {
//                 numOptions(response, convo);
//                 convo.next();
//             }
//         }, {
//             pattern: bot.utterances.no,
//             callback: function(response, convo) {

//                 convo.say(':thinking_face: Hmm... Could you try describing it a different way?');
//                 convo.next();
//             }
//         }, {
//             default: true,
//             callback: function(response, convo) {
//                 convo.say(':confused: I\'m sorry I didn\'t quite catch that');
//                 convo.repeat();
//                 convo.next();
//             }
//         }]);

//     };

//     var numOptions = function(response, convo) {
//         convo.ask('How many segments do you have?',
//             function(response, convo) {
//                 var ideasNum = parseInt(response.text, 10);
//                 if (ideasNum > 0 && ideasNum <= 3) {
//                     showThreeSegments(response, convo);
//                     convo.next();
//                 } else if (ideasNum >= 4) {
//                     showFourSegments(response, convo);
//                     convo.next();
//                 }
//                 promptUserComment(response,convo);
//             });
//     };

//     var showThreeSegments = function(response, convo) {
//         var attachments = [{
//             fallback: 'Customer Segmentation',
//             title: 'Customer Segmentation',
//             text: 'What about this one to capture ' + response.text + ' because it is good for customer segmentation?',
//             image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/S5.3.png?alt=media&token=8ec168b5-e08f-4a5a-9c2e-1091345ea469',
//             unfurl_media: true,
//             color: '#FF0000'
//         }]

//         bot.reply(message, {
//             attachments: attachments
//         }, function(err, resp) {
//             0
//             console.log(err, resp)
//         })
//     };

//     var showFourSegments = function(response, convo) {
//         var attachments = [{
//             fallback: 'Customer Segmentation',
//             title: 'Customer Segmentation',
//             text: 'What about this one to capture ' + response.text + ' because it is good for customer segmentation? ',
//             image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/S5.4.png?alt=media&token=100c11ad-89c3-4d98-a38c-5df402988314',
//             unfurl_media: true,
//             color: '#FF0000'
//         }]

//         bot.reply(message, {
//             attachments: attachments
//         }, function(err, resp) {
//             0
//             console.log(err, resp)
//         })
//     };

//     bot.startConversation(message, showBlank);

// })

//Thanks

controller.hears(['thanks', 'thx', 'thank you'], ['direct_message', 'direct_mention'], function(bot, message) {
    bot.reply(message, 'No problem <@' + message.user + '>!')
})

//Conversation Initiation
controller.hears('.*', ['direct_message', 'direct_mention'], function(bot, message) {

    var notUnderstanding = function(response,convo) {
        convo.ask('Sorry <@' + message.user + '>, I\'m still learning and I don\'t quite understand. \n Would you like to leave anonymous feedback or leave your email for us to get back to you?',
        [

        {
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
            askForFeedback(response,convo);
            convo.say('Gotcha. Thanks!');
            convo.next();
            }
        },
        {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
            convo.say('Alright, thank you!');
            convo.next();
        }

        },
        {
            default:true,
            callback: function(response, convo) {
            convo.repeat();
            convo.next();
            }
        }
        ]

        )};

        var askForFeedback = function(response, convo) {
            // begin of POST request to AWS-API
            convo.ask('Great, what would you like us to know?', function(response,convo) {
            var url = 'https://ti9khi4hx5.execute-api.us-west-2.amazonaws.com/prod/relay';
            var method = 'POST';
            var testData = {
                "Records": [{
                    "Sns": {
                        "Subject": "Help Request",
                        "Message": response.text
                    }
                }]
            }
            var postData = JSON.stringify(testData);
            var async = true;

            var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
            var request = new XMLHttpRequest();

            request.onload = function() {
                var status = request.status;
                var data = request.responseText;
            }

            request.open(method, url, async);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            request.send(postData);
            // end of POST request to AWS-API
             convo.next();
            })
        };
            bot.startConversation(message, notUnderstanding);
        });
