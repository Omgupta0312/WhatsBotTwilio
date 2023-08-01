const express = require('express');
const User = require('./models/user.js');

require('dotenv').config();


const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI)
.then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})


const app = express();
const port = 3000; // Change the port as needed

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function generateReply(message) {
    console.log(message)
    return `You said to me: ${message}`;

  }
 
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the bot");
})
app.post('/webhook', (req, res) => {
    const message = req.body.Body;
    const sender = req.body.From;
  
    // Your callback function to process the incoming message and generate a reply
    console.log(message)
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
