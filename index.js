const express = require('express');
require('dotenv').config();

const app = express();
const port = 3000; // Change the port as needed

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function generateReply(message) {
    return `You said: ${message}`;
  }
 
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the bot");
})
app.post('/webhook', (req, res) => {
    const message = req.body.Body;
    const sender = req.body.From;
  
    // Your callback function to process the incoming message and generate a reply
    const reply = generateReply(message);
  
    // Send the reply using the Twilio API
    client.messages.create({
      body: reply,
      from: '+14155238886', // Your Twilio phone number
      to: sender,
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(err => console.error(err));
  
    res.status(200).end();
  });
  
app.listen(port || process.env.PORT, () => {
  console.log(`Server running on port ${port}`);
});
