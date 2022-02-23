const express = require("express");
const router = express.Router();

router.get('/shelters', (req, res) => {
  res.send('Display all shelters')
})

router.post('/shelters', (req, res) => {
  res.send('Creating shelter')
})

router.get('/shelters/:id', (req, res) => {
  res.send('Show one shelter')
})

router.get('/shelters/:id/edit', (req, res) => {
  res.send('Update one shelter')
})

module.exports = router;