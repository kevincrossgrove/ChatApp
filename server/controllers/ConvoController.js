const Conversation = require("../models/Conversation");

class ConvoController {
  static createConversation = async (req, res) => {
    try {
      const sender = req.user._id;
      const receiver = req.body.receiver;
      const message = req.body.message;

      const newConvo = new Conversation({
        users: [sender, receiver],
        messages: [{ user: sender, message: message, createdAt: new Date() }],
        visible: true,
      });
      const savedConvo = await newConvo.save();

      res.status(200).send(savedConvo);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  };
}

module.exports(ConvoController);
