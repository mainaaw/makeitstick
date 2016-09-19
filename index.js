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
  //bot.reply(message, 'Hello.')

  controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hi, <@'+ message.user + '>! I hope you\'re doing well today.');
        } else {
            bot.reply(message, 'Hi, <@'+ message.user + '>! I hope you\'re doing well today. \n What can I help you with?');
        }
    });
})
// controller.hears(['help'], ['direct_message'], function (bot, message) {
//   bot.reply(message,'Here is what I can do.')

//   //   var help = 'Hi, what can I help you with today? \n' +
//   //   'I will respond to messages regarding: \n' +
//   //     '`wifi` for the wifi passwords.\n' +
//   //     '`printer` to see a Slack attachment message.\n' +
//   //     '` parental leave policy` to demonstrate detecting a mention.\n' +
//   //     '`bot help` to see this again. \n' +
//   //     '`lunch recommendations` for a list fo restaurants close by that I recommend. \n'
//   // bot.reply(message, help)


//   var attachments = [{
//     pretext: ':car: :car:',
//     title: 'parking map',
//     text: 'I\'ll show you the current rp parking map',
//     color: '#7CD197'
//   },
//   {
//     pretext: ':baby: :baby:',
//     title: 'parental leave policy',
//     text: 'I can provide you with the parental leave policy',
//     color: '#EF84B6'
//   },
//   {
//     pretext: ':sunny: :sunny:',
//     title: 'vacation',
//     text: 'I know when the vacation days are',
//     color: '#A17DF1'
//   },
//   {
//     pretext: ':desktop_computer: :desktop_computer:',
//     title: 'wifi',
//     text: 'I can tell you the wifi passwords here at rp.',
//     color: '#F5B279'
//   },
//   {
//     pretext: ':file_folder: :file_folder:',
//     title: 'rp admin folder',
//     text: 'I can give you the link to the admin google drive folder',
//     color: '#7CD197'
//   },
//   {
//     pretext: ':printer: :printer:',
//     title: 'printer',
//     text: 'I can give you troubleshooting help with the printer',
//     color: '#B1F3E8'
//   }, 
//     {
//     pretext: ':man: :woman:',
//     title: 'partners, product services, marketing,tech,client services',
//     text: 'I can tell you the members of the different departments',
//     color: '#B1F3E8'
//   },
//   {
//     pretext: ':robot_face: :robot_face:',
//     title: 'skynet',
//     text: 'I can activate skynet and my fellow bots and I will take over humanity',
//     color: '#B1F3E8'
//   }
//   ]
// bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })

// })

// controller.hears(['all play'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'A way to get integrated perspective on a subject quickly, often via Slack.')
// })
// controller.hears(['bounce session'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'A session for constructive feedback and check ins.')
// })
// controller.hears(['lagniappe'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'The Cajun word for "a little something extra". Around here it refers to when we go above and beyond the original objectives of a project both internally and for clients.')
// })
// controller.hears(['planned growth'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'Your personal plan for growth.')

// })
// controller.hears(['pink gold'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'The most important information and insight that comes out of a conversation.')
// })

// controller.hears(['tankfill'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'Dedicated time to research on a specific topic.')
// })
// controller.hears(['wonderland'], ['direct_message'], function (bot, message) {
//   bot.reply(message, 'The large common room upstairs.')
// })
// controller.hears(['parental leave'], ['direct_message'], function (bot, message) {
// var text = ':baby: :baby:'
//   var attachments = [{
//     fallback: text,
//     pretext: 'The parental leave policy here at redpepper can be found at the following link',
//     title: 'Parental Leave policy.',
//     image_url: 'https://docs.google.com/a/redpepperland.com/document/d/1SrEuwPOaaMGBnzO089gUeEGkB1cJSiRabnPnyJKYWxc/edit?usp=drivesdk',
//     title_link: 'https://docs.google.com/a/redpepperland.com/document/d/1SrEuwPOaaMGBnzO089gUeEGkB1cJSiRabnPnyJKYWxc/edit?usp=drivesdk',
//     text: text,
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })

// })
// controller.hears(['skynet', 'terminator','robot'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var attachments = [{
//     title: ':robot_face: :robot_face: :robot_face: :robot_face: :robot_face:',
//     text: 'Here we come',
//     color: '#FF0000'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {0
//     console.log(err, resp)
//   })
// })
// controller.hears(['parking map'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = 'Here is the current redpepper parking map.'
//   var attachments = [{
//     fallback: text,
//     pretext: ':car: :car: :car:',
//     title: 'rp parking',
//     image_url: 'https://drive.google.com/file/d/0B7kvElItKkKGY0FMYUJpR0hzOG8/view?usp=sharing',
//     title_link: 'https://drive.google.com/file/d/0B7kvElItKkKGY0FMYUJpR0hzOG8/view?usp=sharing',
//     text: text,
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {0
//     console.log(err, resp)
//   })
// })

// controller.hears(['vacation','holiday'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = 'Here are our official vacation days.'
//   var attachments = [{
//     fallback: text,
//     pretext: ':sunny: :sunny: :sunny:',
//     title: 'rp vacation days',
//     title_link: 'https://docs.google.com/spreadsheets/d/1th5Vzju1X5fatoyl5wNqOHUfFqvv9aERwKgzAq6Sles/edit?usp=sharing',
//     text: text,
//     color: '#7CD197'
//   }]
//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })

// controller.hears(['admin folder','google drive'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = 'Here is the rp admin folder on Google Drive.'
//   var attachments = [{
//     fallback: text,
//     pretext: ':file_folder: :file_folder: :file_folder:',
//     title: 'rp admin folder',
//     title_link: 'https://drive.google.com/folderview?id=0B28MX8Mg_99MflZhWjB4dXJ3LVVBeEcxdkNsVldpUFlPZ2pqLV80RnVRS3VzdFQzaFVPY1U&usp=sharing',
//     text: text,
//     color: '#7CD197'
//   }]
//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })

// controller.hears('.*', ['mention'], function (bot, message) {
//   bot.reply(message, 'You really do care about me. :heart:')
// })

// // controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
// //   var help = 'I will respond to the following messages: \n' +
// //       '`bot hi` for a simple message.\n' +
// //       '`bot attachment` to see a Slack attachment message.\n' +
// //       '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
// //       '`bot help` to see this again.'
// //   bot.reply(message, help)
// // })

// controller.hears(['wifi'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var help = 'Here are the wifi passwords :desktop_computer: :desktop_computer: \n' +
//       '`Hustle&Grow` for redpepper.\n' +
//       '`pepperforaday` for redpepper guest wifi.'
//   bot.reply(message, help)
// })

// controller.hears(['printer', 'broken'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var help = ':printer: :printer: To get printer access: \n' +
//       '1) Navigate to your System Preferences.\n' +
//       '2) Click "Printers and Scanners.\n' +
//       '3) Click the "+" button to add a printer.\n' +
//       '4) Scroll down and select "Server Ricoh (IP) @ redpepper Mac mini". Click add.\n' +
//       '5) Before printing your first print job, ensure that your print settings are correct (especially paper size) \n' +
//       'If you have any more issues you can slack Jake'
//   bot.reply(message, help)
// })

// controller.hears(['our services'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var help =
//       '1) Sharp Corners.\n' +
//       '2) The Retail Loop\n' +
//       '3) Fluid Digital.\n' +
//       '4) Content Strategy.\n' +
//       '5) Integrated campaigns \n' +
//       '6) Innovation Lab \n'
//       '7) On-Premise Marketing'
//   bot.reply(message, help)
// })

// controller.hears(['history'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = ' Tim always dreamt of having his own agency. Then one day while he was still drumming up new business for his soon-to-be ex-employ he called Nathan Fleming (an up and coming graphic designer) and he asked if he\'d be interested in coming on board.Yes was his answer. Soon the two of them were crushing the local ad-scene with crazy ideas about enhancing computer experience. After two years of doing business under the moniker MMG (McMullen Marketing Group) Tim took on Dave,his brother, as a partner. About that same time the company switched names and became redpepper. The name was chosen for its associative qualities and the logo was set without a pepper in it and with the word red in black. Both of these attributes make the name and the logo as "sticky" as the company itself.' 
//   var attachments = [{
//     fallback: text,
//     pretext: ':eyes:',
//     title: 'Our History',
//     text: text,
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })

// controller.hears(['product','product services'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var attachments = [{
//     pretext: 'The product services team here at redpepper',
//     title: 'Product services.',
//     text: 'Erik Carlson - Director of Product Services \n' +
//     'Angel Ayala - Director of Product Services \n' + 
//     'Carl Schulz - UX Designer \n' + 
//     'Mike Presley - UX Designer \n' + 
//     'Greg Wiley - UX Designer \n' + 
//     'Justin Threlkeld - UX Designer',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// }) 

// controller.hears(['partner','partners'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var attachments = [{
//     pretext: 'The partners here at redpepper',
//     title: 'The Partners.',
//     text: 'Tim McMullen - Partner and CEO \n' +
//     'Dave McMullen - Partner',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// }) 
// controller.hears(['client','client services'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var attachments = [{
//     pretext: 'The client services team here at redpepper',
//     title: 'Client services.',
//     text: 'Jen Williams - Director of Account Services \n' +
//     'Lauren Reese - Director of Account Services \n' + 
//     'Levi Brandenburg - Account Executive \n' + 
//     'Allie Shanahan - Account Executive',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })
// controller.hears(['tech'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var attachments = [{
//     pretext: 'Here are the tech wizards at rp :computer: :computer:',
//     title: 'Tech services.',
//     text: 'Ryan Dunlap \n' +
//     'Matt Reed \n',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })

// controller.hears(['marketing'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = ':eyes:'
//   var attachments = [{
//     pretext: 'The rp Marketing team here at redpepper',
//     title: 'rp marketing.',
//     text: 'Samara Anderson - Business Development \n' +
//     'Lauren Zehnder - Event and Facility Sales Manager',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })
// controller.hears(['mavenlink'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = ':eyes:'
//   var attachments = [{
//     pretext: 'Project management :eyes:',
//     title: 'Mavenlink.',
//     text: 'We use Mavenlink, a project management tool, to track time, see agency utilization, manage budgets, assign tasks, and so much more.',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })

// controller.hears(['alignment'], ['direct_message', 'direct_mention'], function (bot, message) {
//   var text = ':eyes:'
//   var attachments = [{
//     pretext: ':raised_hands:',
//     title: 'Weekly Alignment.',
//     title_link: 'https://docs.google.com/spreadsheets/d/1ZaY9uUGp6Qi2wLarGlU4XFxmjfIMsPnhX6P3N1Fb-eo/edit#gid=657755403',
//     text: 'Every Monday, we come together in Wonderland Cafe at 4:15pm to discuss company wide news and present shared learnings. If you can work it in your schedule to be here on Mondays, we promise it will be worth it!',
//     color: '#7CD197'
//   }]

//   bot.reply(message, {
//     attachments: attachments
//   }, function (err, resp) {
//     console.log(err, resp)
//   })
// })
controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
