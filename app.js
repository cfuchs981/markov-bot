// load discord js library 
const Discord = require("discord.js");

// the bot itself 
const client = new Discord.Client();

// load config file containing our unique bot token 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix. Type prefix to trigger bot  

client.on("ready", () => {
  //just message the console so we know bot is alive 
  console.log(`Markov-bot is running`); 
});

client.on("message", async message => {
  
  // ignore fellow bots and itself, don't want to trigger a loop accidentally 
  if(message.author.bot) return;
  
  // ignore a message that does not start with our prefix, our prefix being 'markov'
  if(message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

  //generat order of our markov table
  var order = getRandomInt(1, 10); 
  //generate random length for our return message 
  var length = getRandomInt(1, 25); 

  //function scrapes last 100 messages, builds markov table on it, and returns a response 
  scrape_user_messages(client, message, length, order); 

});

//helper function 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//scrape all messages 
function scrape_user_messages(client, message, length, order) {
  //this is meant to target a certain user, doesn't work, bot will scrape all logs 
   var user = message.author.username; 
   var all_messages = ""; 
   message.channel.fetchMessages({limit: 100}).then(messages => {

    //filter, store messages and turn it into a long string to give to markov 
    var user_messages = messages.filter(msg => user);
    var message_fix = Array.from(user_messages.values()); 
    for(i = 0; i < message_fix.length; i++) {
      all_messages += message_fix[i].content + " "; 
    }

    //build markov response and send to channel 
    var markov = new Markov(all_messages.toString(), length, order).generate(); 
    message.channel.send(markov); 
  });
}

// -------- START OF MARKOV BLOCK ------------- 
// Modified from https://gist.github.com/kevincennis/5440878
// @string input {example text}
// @integer len {optional # of words to output}
// @integer stateSize {optional chain order}
function Markov( input, len, stateSize ){
  this.cache = Object.create(null)
  this.words = input.split(/\s/)
  this.startwords = [this.words[0]]
  this.stateSize = stateSize || 2
  this.outputSize = len || 100
  this.analyzed = false
}

// return a random element from an array
Markov.prototype.choose = function( arr ){
  return arr[~~( Math.random() * arr.length )]
}

// get the next set of words as a string
Markov.prototype.getNextSet = function( i ){
  return this.words.slice(i, i + this.stateSize).join(' ')
}

// create a markov lookup
Markov.prototype.analyze = function( input ){
  var len = this.words.length, next
  this.words.forEach(function( word, i ){
    next = this.getNextSet(++i)
    ;(this.cache[word] = this.cache[word] || []).push(next)
    ;/[A-Z]/.test(word[0]) && this.startwords.push(word)
  }.bind(this))
  return this.analyzed = true && this
}

// generate new text from a markov lookup
Markov.prototype.generate = function(){
  var seed, arr, choice, curr, i = 1
  !this.analyzed && this.analyze()
  arr = [seed = this.choose(this.startwords)]
  for ( ; i < this.outputSize; i += this.stateSize ){
    arr.push(choice = this.choose(curr || this.cache[seed]))
    curr = this.cache[choice.split(' ').pop()]
  }
  return arr.join(' ') + '.'
}
// ------- MARKOV PROTOTYPE END --------------


//send the bot off to login
client.login(config.token);
           