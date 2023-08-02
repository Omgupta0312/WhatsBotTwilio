const express = require("express");
const router = express.Router();
const { generateReply } = require("../inputValidaters");
require("dotenv").config();

//Schema
const User = require("../models/user");

//twilio set up
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

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
