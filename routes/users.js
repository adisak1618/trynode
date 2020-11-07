var express = require('express');
const { Op } = require("sequelize");
var router = express.Router();
const models  = require('../models/index.js');
const { authentication } = require('../helper')

/* GET users listing. */
router.get('/', authentication(), async (req, res, next) => {
  const users = await models.users.findAll({
    where: {
      [Op.or]: [
        {
          firstname: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          lastname: {
            [Op.like]: `%${req.body.search}%`
          }
        }
      ]
    }
  })
  res.json(users)
});

module.exports = router;
