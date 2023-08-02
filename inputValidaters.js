const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

const isValidMobileNumber = (input) => {
  // Remove any non-digit characters
  const cleanedInput = input.replace(/\D/g, "");

  // Check if the cleaned input is 10 digits long
  if (cleanedInput.length !== 10) {
    return false;
  }

  // Check if the first digit is in the range of 6 to 9 (Indian mobile numbers)
  const firstDigit = parseInt(cleanedInput[0]);
  if (firstDigit < 6 || firstDigit > 9) {
    return false;
  }
  // All checks passed, the number is valid
  return true;
};

const generateReply = async (message) => {
  if (["hi", "hey", "hello"].includes(message.toLowerCase())) {
    return `Hi , Please provide your name , email and phone number in seperate lines :)`;
  }

  try {
    const [name, email, phone] = message.split("\n");
    console.log(name, email, phone);

    const validDetails = isValidEmail(email) && isValidMobileNumber(phone);
    if (!validDetails) {
      return `EMAIL OR PHONE NUMBER FORMAT IS WRONG!! ${"\n"} Please Provide your name , email and phone number in correct format and also in seperate lines :)`;
    }

    const existing1 = await User.findOne({ email });
    const existing2 = await User.findOne({ phone });

    if (existing1 || existing2) {
      return `EMAIL OR PHONE ALREADY EXISTS`;
    }

    const user = new User({ name, email, phone });
    await user.save();
    return "Thankyou!!! We got the details. Will connect Soon !!";
  } catch (err) {
    console.log(err);
    return `Something failed !!! Please provide your name , email and phone number in seperate lines --`;
  }
};

module.exports = {
  isValidEmail,
  isValidMobileNumber,
  generateReply,
};
