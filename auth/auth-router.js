const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');
const Users = require('../database/users-model.js');

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

router.post('/register', async (req, res) => {
  const credentials = req.body;

  if (credentials.username === '' || credentials.password === '') {
    res.status(401).json({ message: 'Invalid Credentials' });
  } else {
    try {
      const hash = bcrypt.hashSync(credentials.password, 8);
      credentials.password = hash;
      const saved = await Users.add(credentials);
      const token = generateToken(saved);
      res.status(201).json({data: saved, token});
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.post('/login', async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);

      res.status(200).json({
        message: `Welcome ${user.username}!, have a token...`,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid Credentials '});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
