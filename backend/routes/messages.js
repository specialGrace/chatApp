import express from 'express';
import Message from "../models/Message.js"

const router = express.Router();

router.post('/', async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).send('Message sent');
});

router.get('/:channelId', async (req, res) => {
  const messages = await Message.find({ channelId: req.params.channelId });
  res.status(200).json(messages);
});

module.exports = router;
