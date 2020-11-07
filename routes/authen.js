const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const models  = require('../models/index.js');
const { hashPassword, checkPassword } = require('../helper')

/* GET home page. */
router.post('/signup', async (req, res, next) => {
  
  const userdata = {
    ...req.body,
    password: await hashPassword(req.body.password)
  }
  console.log('models', models.users)
  const users = await models.users.findAll({
    where: {
      email: req.body.email
    }
  })
  if (users.length > 0 ) {
    res.json({
      error: 'useralreadyexist'
    })
  } else {
    const newuser = await models.users.create(userdata)
    res.json(newuser)
  }
});

router.post('/login', async (req, res) => {
  const user = await models.users.findOne({
    where: {
      email: req.body.email
    }
  })
  const checkpwd = await checkPassword(req.body.password, user.password)
  if(checkpwd) {
    // password is correct
    const { email, firstname, lastname } = user
    const token = jwt.sign({
      exp: 1000*60*24,
      data: {email, firstname, lastname},
    }, 'happycat', {
      algorithm: 'HS256'
    });
    res.json({firstname, lastname, email, token})
  } else {
    // password is incorrect
    res.json({
      error: 'passwordisnotcorrect'
    })
  }
})

module.exports = router;
