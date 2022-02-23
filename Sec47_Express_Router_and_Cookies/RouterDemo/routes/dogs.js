const { Router } = require('express');
const express = require('express');
const router = express.Router()


router.get('/', (req, res) => {
  res.send('All dogs')
})

router.post('/', (req, res) => {
  res.send('Creating dog')
})

router.get('/:id', (req, res) => {
  res.send('Show one dog')
})

router.get('/:id/edit', (req, res) => {
  res.send('Update one dog')
})

module.exports = router;