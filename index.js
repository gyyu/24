const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const math = require('mathjs')

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(message.content);

  if (message.content === `${config.prefix}help`) {
  	// Give an info message.
  	message.channel.send("I'm a bot to play 24! Here's the rules: add, multiply, subtract, or divide all four numbers in order to make 24. I'll give you four numbers randomly ranging from 1 to 13. \
    For example, if I give you {2, 3, 5, 13}, you can give me '!13 * 2 - (5-3)'. I will only accept responses that first start with '!' so I know where to look for your reply.");
  } else if (message.content === `${config.prefix}24`) {
    // Code here to actually generate the four random numbers.
    message.channel.send(getNums())
  } else if (message.content.charAt(0) === `${config.prefix}`) {
    // Take the rest of the string and see if it's a valid math expression.
    if (calculateSol(message.content.substring(1))) {
      message.channel.send("That's correct!")
    } else {
      message.channel.send("Try again.")
    }
  }
});

client.login(config.token);

function calculateSol(solution) {
  let sol
  try {
    sol = math.evaluate(solution)
  } catch (e) {
    console.log(e)
    return
  }
  return sol === 24
}

function getNums() {
  console.log(Math.floor(Math.random() * 13) + 1)
  return `Make 24 out of: {${Math.floor(Math.random() * config.maxNumber + 1)}, ${Math.floor(Math.random() * config.maxNumber + 1)}, ${Math.floor(Math.random() * config.maxNumber + 1)}, ${Math.floor(Math.random() * config.maxNumber + 1)}}`
}
