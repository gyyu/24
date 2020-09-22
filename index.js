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
    For example, if I give you {2, 3, 5, 13}, you can give me '!13 * 2 - (5-3)'. I will only accept responses that first start with '!' so I know where to look for your reply.")
  } else if (message.content === `${config.prefix}24`) {
    message.channel.send(getNums())
  } else if (message.content === `${config.prefix}hint`) {
    const numSols = findNumSols()
    if (numSols == 1) {
      message.channel.send(`There is ${findNumSols()} possible solution.`)
    } else {
      message.channel.send(`There are ${findNumSols()} possible solutions.`)
    }
  } else if (message.content === `${config.prefix}giveup`) {
    const sols = findSols()
    message.channel.send(`Here are some possible solutions: ${sols.join(', ')}`)
  } else if (message.content.charAt(0) === `${config.prefix}`) {
    // Take the rest of the string and see if it's a valid math expression.
    if (verifyAndCalculateSol(message.content.substring(1))) {
      message.channel.send("That's correct!")
    } else {
      message.channel.send("That's not right -- try again.")
    }
  }
});

client.login(config.token)

// The current numbers being played for 24.
let currNums = []

function isPossible() {
  return findNumSols(currNums) > 0
}

function findSols() {
  const operationPerms = makeOperationPermutations()
  const possibleSolutions = operationPerms.map(
    (operations) => [currNums[0], operations[0], currNums[1], operations[1], currNums[2], operations[2], currNums[3]]
  )
  const possibleSolutionsStrings = possibleSolutions.map((sol) => sol.join(' '))

  return possibleSolutionsStrings.filter((solString) => calculateSol(solString))
}

function findNumSols() {
  return findSols().length
}

function makeOperationPermutations() {
  const possibleOperations = ['+', '*', '/', '-']
  let operationPerms = []
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      for (k = 0; k < 4; k++) {
        operationPerms.push([possibleOperations[i], possibleOperations[j], possibleOperations[k]])
      }
    }
  }

  return operationPerms
}

function verifyAndCalculateSol(solution) {
  if (solution.includes(currNums[0]) && solution.includes(currNums[1]) && solution.includes(currNums[2]) && solution.includes(currNums[3])) {
    return calculateSol(solution)
  } 
}

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

function generatePossibleCombo() {
  currNums = [`${Math.floor(Math.random() * config.maxNumber + 1)}`, `${Math.floor(Math.random() * config.maxNumber + 1)}`, `${Math.floor(Math.random() * config.maxNumber + 1)}`, `${Math.floor(Math.random() * config.maxNumber + 1)}`]
}

function getNums() {
  generatePossibleCombo()
  while (!isPossible(currNums)) {
    generatePossibleCombo()
  }
  return `Make 24 out of: {${currNums.join(', ')}}`
}
