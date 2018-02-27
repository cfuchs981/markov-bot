# markov-bot

A bot that generates random responses based on building Markov chains out of the existing messages in a discord channel. 
Responses are fairly good representations of a message's chat history, but markov chains and probabilities can only do so much 
so he struggles sometimes. <br/>

#Usage 

First, you will need to go to the discord developer portal and create an account along with a project. Once you have a project, your unique bot 
ID should be placed into the config.json file in place of the stand-in text. <br/>
To add your bot to a channel, return to your developer account and find your CLIENT_ID value. Then go to this URL: 
https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot, replacing the text "CLIENTID" with your value. You should then see 
your bot appear in your server.<br/> 

Finally, download this repository. To run locally, navigate to the directory where you downloaded this repo and run 'node app.js.' The bot
will then come online. Usage is 'markov' to make him generate a response. 
