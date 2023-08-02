const express = require("express");
const router = express.Router();
require('dotenv').config();

//Schema
const User = require("../models/user");

//twilio set up
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const generateReply = async(message) => {
    if(['hi','hey','hello'].includes(message.toLowerCase())){
        return `Hi , Please provide your name , email and phone number in seperate lines -->`;
    }

    try{
        const [name,email,phone] = message.split('\n');
        console.log(name,email,phone);

        const existing1 = await User.findOne({email});
        const existing2 = await User.findOne({phone});
    
        if(existing1 || existing2){
            return `EMAIL OR PHONE ALREADY EXISTS`
        }
    
        const user = new User({name,email,phone});
        await user.save();
        return 'Thankyou!!! We got the details. Will connect Soon !!';

    }catch(err){
        console.log(err);
        return `Something failed !!! Please provide your name , email and phone number in seperate lines --`;
    }

}


router.route("/").get((req, res) => {
  res.status(200).send("Welcome to the bot");
});

router.route("/webhook").post(async (req, res) => {
  const message = req.body.Body;
  const sender = req.body.From;

  // Your callback function to process the incoming message and generate a reply
  console.log(message);
  const reply = await generateReply(message);

  // Send the reply using the Twilio API
  client.messages
    .create({
      body: reply,
      from: "whatsapp:+14155238886", // Your Twilio phone number
      to: sender,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((err) => console.error(err));

  res.status(200).end();
});

module.exports = router;
