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
        }).startRTM(function(err, bot, payload) {
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

controller.on('bot_channel_join', function(bot, message) {
    bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_message', 'direct_mention'], function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hi, <@' + message.user + '>! I hope you\'re doing well today.');
        } else {
            bot.reply(message, 'Hi, <@' + message.user + '>! What can I help you show today?')
        }
    });
})

//Section B1 - B2.6

//Section B1
//insert example into initial response
//https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FB1.Example.png?alt=media&token=0cabda0c-233e-46e9-826e-4ca26e6a1fdb
//Ask whether this is right
//if yes = ask for number of ideas and display the blank template
//if no = "try describing it a different way" or route to expert

controller.hears(['ideas', 'brainstorming', 'brainstorm', 'Brainstorm'], ['direct_message', 'direct_mention'], function(bot, message) {

    var askType = function(err, convo) {
        convo.ask('It sounds like you want to organize ideas from a brainstorm, like this one. Is this correct?', function(response, convo) {
            var answer = response.text;
            convo.next();
            if (answer == 'yes' || 'Yes' || 'YES') {
                convo.ask('About how many ideas are you working with?',
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
                    }
                );

            } else if (answer == 'no' || 'No' || 'NO') {
                convo.ask('Hmm... Could you try describing it a different way?')
                convo.next();
            } else {
                convo.say('Let me connect you to an expert');
                convo.next();
            }

        });
    };

    var showFewIdeasHoneyComb = function(response, convo) {
        var attachments = [{
            fallback: 'Honeycomb Brainstorm',
            title: 'Honeycomb Brainstorm',
            text: 'Here is a chart that might work for ' + response.text + ' or other brainstorming ideas. What do you think?',
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
            text: 'Here is a chart that might work for ' + response.text + ' and other brainstorming ideas. What do you think?',
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
            text: 'Here is a chart that might work for ' + response.text + ' and other brainstorming ideas. What do you think?',
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

    bot.startConversation(message, askType);

})

//Section B2

controller.hears(['Concept', 'concept', 'Mindmap', 'mindmap'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('It soundes like you want to organize ideas or concepts. How many ideas are you working with?', function(response, convo) {
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
        });
    };

    var showFewIdeas = function(response, convo) {
        var attachments = [{
            fallback: 'Concept Map',
            title: 'Concept Map',
            text: 'Here is a chart that might work for your ' + response.text + ' concepts. What do you think?',
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
            text: 'Here is a chart that might work for your ' + response.text + ' concepts. What do you think?',
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
            text: 'Here is a chart that might work for your ' + response.text + ' concepts. What do you think?',
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

    bot.startConversation(message, askType);

})

//Section C1 - C3

//Comparison C1
//insert example into initial response
//https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/Examples%2FC1.Example.png?alt=media&token=efcc1bea-8035-4a5e-a242-5e5958c90a03
//Ask whether this is right
//if yes = display the blank template
//if no = "try describing it a different way" or route to expert

controller.hears(['compare', 'comparison', 'Comparison', 'compare', 'criteria', 'Criteria', '2x2', 'two things', 'multiple variables'], ['direct_message', 'direct_mention'], function(bot, message) {
    var attachments = [{
        fallback: '2x2 Comparison',
        title: '2x2 Comparison',
        text: 'It sounds like you\'re going for a 2x2. Here is a chart that might work well to capture comparison of multiple criteria. What do you think?',
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
});

//Comparison C3
controller.hears(['before', 'after', 'change of state', 'change', 'problem', 'solution', 'before and after'], ['direct_message', 'direct_mention'], function(bot, message) {
    var attachments = [{
        fallback: 'Before + After',
        title: 'Before + After',
        text: 'Here is a chart that might work well for you to explain a before and after situation like yours. What do you think?',
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
});

//Comparison C2
controller.hears(['decision', 'Decision', 'alternative', 'Alternative', 'alternatives', 'Alternatives', 'choice', 'choices', 'options', 'Options', 'pros and cons'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('Are you making a decision between 2 or 3 alternatives?', function(response, convo) {
            var ideasNum = parseInt(response.text, 10);

            if (ideasNum == 2) {
                showTwoOptions(response, convo);
                convo.next();
            } else if (ideasNum == 3) {
                showThreeOptions(response, convo);
                convo.next();
            } else {
                convo.say('Let me connect you to an expert');
                convo.next();
            }
        });
    };

    var showTwoOptions = function(response, convo) {
        var attachments = [{
            fallback: 'Decision Making',
            title: 'Decision Making',
            text: 'Here is a chart that might work to frame this ' + response.text + ' decision. What do you think?',
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
            text: 'Here is a chart that might work to frame this ' + response.text + ' decision. What do you think?',
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

    bot.startConversation(message, askType);
});

// List L1.3 ~ L1.5
controller.hears(['interview', 'quote', 'theme', 'Interview', 'Quote', 'quotes', 'user quotes', 'interview quotes', 'interviews', 'interview insights', 'insights from interviews'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many themes do you have?', function(response, convo) {
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
        });
    };

    var showThreeThemes = function(response, convo) {
        var attachments = [{
            fallback: 'Interview Themes',
            title: 'Interview Themes',
            text: 'Here is a chart that might work to capture this ' + response.text + ' and other interview scenarios. What do you think?',
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
            text: 'Here is a chart that might work to capture this ' + response.text + ' and other interview scenarios. What do you think?',
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
            text: 'Here is a chart that might work to capture this ' + response.text + ' and other interview scenarios. What do you think?',
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

    bot.startConversation(message, askType);

})

// List L2.2 ~ L2.4 - DELETE
/* 
controller.hears(['big idea', 'vision', 'Big idea', 'Vision'], ['direct_message', 'direct_mention'], function (bot, message) {
var askType = function(err, convo) {
      convo.ask('How many supporting ideas do you have?', function(response, convo) {
        var ideasNum = parseInt(response.text, 10);
        
        if (ideasNum > 0 && ideasNum <= 2) {
        showTwoIdeas(response, convo);
        convo.next();
      } else if (ideasNum == 3) {
        showThreeIdeas(response, convo);
        convo.next();
        } 
         else {
          showFourIdeas(response,convo);
          convo.next();
         }
      });
    };

var showTwoIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Big Ideas',
    title: 'Big Ideas',
    text: 'Here is the best chart to capture '+ response.text + ' big ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL2.2.jpg?alt=media&token=721a958d-9f3f-407b-837d-4ab6225efd79',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
  };
var showThreeIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Big Ideas',
    title: 'Big Ideas',
    text: 'Here is the best chart to capture ' + response.text + ' big ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL2.3.jpg?alt=media&token=7c3a4ade-0a7b-4f10-9a14-9f455b66421a',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

var showFourIdeas = function(response, convo) {
    var attachments = [{
    fallback: 'Big Ideas',
    title: 'Big Ideas',
    text: 'Here is the best chart to capture ' + response.text + ' big ideas.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FL2.4.jpg?alt=media&token=e2dc50a6-d07a-4ec2-a99b-b7b117c8577a',
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
*/

// List L3
controller.hears(['feature', 'benefit', 'impact', 'features', 'Benefit', 'Impact', 'product features', 'product feature', 'feature benefit', 'features and benefits'], ['direct_message', 'direct_mention'], function(bot, message) {
    var attachments = [{
        title: 'Feature Benefit Impact Map',
        text: 'Here is a feature benefit impact map that might work for ' + response.text + '. What do you think?',
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

})

// List L4.3 ~ L4.6
controller.hears(['team', 'member', 'Team', 'Member', 'board', 'advisors', 'team members', 'organization', 'panel'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many team members do you have?', function(response, convo) {
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
        });
    };

    var showThreeTeams = function(response, convo) {
        var attachments = [{
            fallback: 'Team',
            title: 'Team',
            text: 'Try this classic for ' + response.text + ' teams. What do you think?',
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
            text: 'Try this classic for ' + response.text + ' teams. What do you think?',
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
            text: 'Try this classic for ' + response.text + ' teams. What do you think?',
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

    bot.startConversation(message, askType);

})

// List L5.1 ~ L5.2
controller.hears(['user testing', 'user test', 'user test summary', 'user test results', 'user research', 'observations', 'observing users'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('Do you want a "high level" or "detailed" chart?', function(response, convo) {
            var ideasNum = response.text;

            if (ideasNum == 'high level') {
                showHighLevel(response, convo);
                convo.next();
            } else if (ideasNum == 'detailed') {
                showDetailed(response, convo);
                convo.next();
            }
        });
    };

    var showHighLevel = function(response, convo) {
        var attachments = [{
            fallback: 'User Test Summary',
            title: 'User Test Summary',
            text: 'Here is a good chart for showing high-level summaries of user testing and ' + response.text + ' What do you think?',
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
            title: 'User Test Summary',
            text: 'Here is a good chart for showing more detailed summaries of user testing and ' + response.text + ' What do you think?',
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

    bot.startConversation(message, askType);

})

// List L6
controller.hears(['product market fit', 'product market', 'product use case'], ['direct_message', 'direct_mention'], function(bot, message) {
    var attachments = [{
        title: 'Product User Impact',
        text: 'Give this product user impact chart a try to show that. What do you think?',
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

})

// Process P1.3 ~ P1.6
controller.hears(['process', 'linear', 'flow', 'series', 'action', 'Process', 'Linear', 'Flow', 'Series', 'Action', 'roadmap', 'plan'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many steps are you working with?', function(response, convo) {
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
        });
    };

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

    bot.startConversation(message, askType);

})

// Process P3.2 ~ P3.6
controller.hears(['repeating', 'cycle', 'Repeating', 'Cycle', 'cyclical process', 'loop', 'Loop'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many steps are you working with?', function(response, convo) {
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
        });
    };

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

    bot.startConversation(message, askType);

})

// Process P4 - DELETE
/*
controller.hears(['hypothesis', 'experiment', 'lean', 'methodology', 'Hypothesis', 'Experiment', 'Lean', 'Methodology'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Hypothesis Testing Result',
    text: 'Try a hypothesis testing result to better convey this information.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP4.jpg?alt=media&token=2f351250-70a2-4762-8908-800a346dc324',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})
*/

// Process P5 - DELETE
/*
controller.hears(['use case', 'case', 'Use case', 'Case'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Use Case',
    text: 'Try a use case chart to better convey this information.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FP5.jpg?alt=media&token=e8601a64-c69f-4669-aa85-325516b6f195',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})
*/

// Process P6.3 ~ P6.6
controller.hears(['milestone', 'timeline', 'progress', 'Milestone', 'Timeline', 'Progress', 'milestones', 'Milestones'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many milestones are you working with?', function(response, convo) {
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
        });
    };

    var showThreeMilestones = function(response, convo) {
        var attachments = [{
            fallback: 'Milestone Timeline',
            title: 'Milestone Timeline',
            text: 'Here a good option to capture ' + response.text + ' milestones. What do you think?',
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
            text: 'Here a good option to capture ' + response.text + ' milestones. What do you think?',
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
            text: 'Here a good option to capture ' + response.text + ' milestones. What do you think?',
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
            text: 'Here a good option to capture ' + response.text + ' milestones. What do you think?',
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

    bot.startConversation(message, askType);

})

// Structure S1 ~ S5
controller.hears(['vision', 'mission', 'values', 'culture', 'program', 'principles', 'tenants', 'big idea'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many pillars are you working with?', function(response, convo) {
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
        });
    };

    var showThreePillars = function(response, convo) {
        var attachments = [{
            fallback: 'Pillars',
            title: 'Pillars',
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. What do you think? Does it work for what you are trying to show?',
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
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. What do you think? Does it work for what you are trying to show?',
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
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. What do you think? Does it work for what you are trying to show?',
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
            text: 'This is a good chart for high-level ideas like ' + response.text + ' and vision and mission statements. What do you think? Does it work for what you are trying to show?',
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

    bot.startConversation(message, askType);

})

// Structure S2 - DELETE
/*
controller.hears(['meeting','agenda','schedule','Meeting', 'Agenda', 'Schedule'], ['direct_message', 'direct_mention'], function (bot, message) {
  var attachments = [{
    title: 'Agenda chart',
    text: 'Try an agenda chart to better convey this information.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS2.jpg?alt=media&token=c99df5c7-0509-44cc-999b-af3d545a20f9',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })

})
*/

// Structure S3.2 ~ S3.5
controller.hears(['define user', 'target user', 'user groups', 'target customer'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many attributes are you working with?', function(response, convo) {
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
        });
    };

    var showTwoGroups = function(response, convo) {
        var attachments = [{
            fallback: 'Groups',
            title: 'Groups',
            text: 'Here is a good chart that might work for ' + response.text + ' because it is good for showing user groups and defining target users. What do you think?',
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
            fallback: 'Groups',
            title: 'Groups',
            text: 'Here is a good chart that might work for ' + response.text + ' because it is good for showing user groups and defining target users. What do you think?',
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
            fallback: 'Groups',
            title: 'Groups',
            text: 'Here is a good chart that might work for ' + response.text + ' because it is good for showing user groups and defining target users. What do you think?',
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

    bot.startConversation(message, askType);

})

// Structure S4.1 ~ S4.5 - DELETE
/*
controller.hears(['need', 'finding','Need', 'Finding'], ['direct_message', 'direct_mention'], function (bot, message) {
var askType = function(err, convo) {
      convo.ask('Which level of need (5 - self-actualization, esteem, safety, 1 - physiological) do you require?', function(response, convo) {
        var ideasNum = parseInt(response.text, 10);
        
        if (ideasNum == 1) {
        showOneNeeds(response, convo);
        convo.next();
      } else if (ideasNum == 2) {
        showTwoNeeds(response, convo);
        convo.next();
      } else if (ideasNum == 3) {
        showThreeNeeds(response, convo);
        convo.next();
      } else if (ideasNum == 4) {
        showFourNeeds(response, convo);
        convo.next();
      } else {
        showFiveNeeds(response,convo);
        convo.next();
       }
    });
  };

  var showOneNeeds = function(response, convo) {
    var attachments = [{
    fallback: 'Needs Diagram',
    title: 'Needs Diagram',
    text: 'Here is the best chart to capture '+ response.text + ' need.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS4.1.jpg?alt=media&token=f2064cc3-e465-4fe4-8faf-4d11fcf699d3',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
  };

  var showTwoNeeds = function(response, convo) {
    var attachments = [{
    fallback: 'Needs Diagram',
    title: 'Needs Diagram',
    text: 'Here is the best chart to capture '+ response.text + ' needs.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS4.2.jpg?alt=media&token=dc6cdd87-963f-4259-83dc-213f3514c450',
    unfurl_media:true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
  })
  };

  var showThreeNeeds = function(response, convo) {
    var attachments = [{
    fallback: 'Needs Diagram',
    title: 'Needs Diagram',
    text: 'Here is the best chart to capture ' + response.text + ' needs.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS4.3.jpg?alt=media&token=08864d63-b6e6-4e65-a03f-78554be19c21',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

  var showFourNeeds = function(response, convo) {
    var attachments = [{
    fallback: 'Needs Diagram',
    title: 'Needs Diagram',
    text: 'Here is the best chart to capture ' + response.text + ' needs.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS4.4.jpg?alt=media&token=a681be0f-edb6-475c-9e47-4b78e7847186',
    unfurl_media: true,
    color: '#FF0000'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {0
    console.log(err, resp)
    })
  };

  var showFiveNeeds = function(response, convo) {
    var attachments = [{
    fallback: 'Needs Diagram',
    title: 'Needs Diagram',
    text: 'Here is the best chart to capture ' + response.text + ' needs.',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/makeitstick-f8aa8.appspot.com/o/Templates%2FS4.5.jpg?alt=media&token=4b9d10ed-fee3-4f60-ad26-3c66069e774a',
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
*/

// Structure S5.3 ~ S5.4
controller.hears(['segment', 'customer', 'Segment', 'Customer', 'segment customers', 'customer segmentation', 'segmentation'], ['direct_message', 'direct_mention'], function(bot, message) {
    var askType = function(err, convo) {
        convo.ask('How many segments do you have?', function(response, convo) {
            var ideasNum = parseInt(response.text, 10);

            if (ideasNum <= 3) {
                showThreeSegments(response, convo);
                convo.next();
            } else if (ideasNum >= 4) {
                showFourSegments(response, convo);
                convo.next();
            }
        });
    };

    var showThreeSegments = function(response, convo) {
        var attachments = [{
            fallback: 'Customer Segmentation',
            title: 'Customer Segmentation',
            text: 'What about this one to capture ' + response.text + ' because it is good for customer segmentation? What do you think?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/S5.3.png?alt=media&token=8ec168b5-e08f-4a5a-9c2e-1091345ea469',
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

    var showFourSegments = function(response, convo) {
        var attachments = [{
            fallback: 'Customer Segmentation',
            title: 'Customer Segmentation',
            text: 'What about this one to capture ' + response.text + ' because it is good for customer segmentation? What do you think?',
            image_url: 'https://firebasestorage.googleapis.com/v0/b/stickbot-2d7a3.appspot.com/o/S5.4.png?alt=media&token=100c11ad-89c3-4d98-a38c-5df402988314',
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

    bot.startConversation(message, askType);

})

controller.hears(['thanks', 'thx', 'thank you'], ['direct_message', 'direct_mention'], function(bot, message) {
    bot.reply(message, 'No problem <@' + message.user + '>!')
})

controller.hears('.*', ['direct_message', 'direct_mention'], function(bot, message) {
    bot.reply(message, 'Sorry <@' + message.user + '>, I\'m still learning and I don\'t quite understand. Want to talk to my boss? \n')
})
