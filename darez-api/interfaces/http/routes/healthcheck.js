const { Router } = require('express');

module.exports = Router()
  .get('/', async (req, res) => res.status(200).send());
