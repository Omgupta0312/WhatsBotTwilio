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

async function generateReply(message) {
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
 
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the bot");
})
app.post('/webhook', async (req, res) => {
    const message = req.body.Body;
    const sender = req.body.From;
  
    // Your callback function to process the incoming message and generate a reply
    console.log(message)
    const reply = await generateReply(message);
  
    // Send the reply using the Twilio API
    client.messages.create({
      body: reply,
      from: 'whatsapp:+14155238886', // Your Twilio phone number
      to: sender,
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(err => console.error(err));
  
    res.status(200).end();
  });
  
app.listen(port || process.env.PORT, () => {
  console.log(`Server running on port ${port}`);
});
