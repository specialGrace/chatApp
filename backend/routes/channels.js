import express from 'express';
import Channel from "../models/Channel.js"

const router = express.Router();

router.post('/', async (req, res) => {
  const channel = new Channel(req.body);
  await channel.save();
  res.status(201).send('Channel created');
});

router.get('/', async (req, res) => {
  const channels = await Channel.find({});
  res.status(200).json(channels);
});

module.exports = router;
