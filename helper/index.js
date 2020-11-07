const bcrypt = require('bcrypt');
const jwt = require('express-jwt');

exports.hashPassword = async (password) => {

  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })
  return hashedPassword
}

exports.checkPassword = async (password, hash) => {
  const checkedPassword = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, data) => {
      if (err) reject(err)
      resolve(data)
    });
  })
  return checkedPassword
}

exports.authentication = (config = { admin: false }) => {
  const auth = [
    jwt({
      secret: 'happycat',
      algorithms: ['HS256'],
      credentialsRequired: true,
      getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
    })
  ];

  if (config.admin === true) {
    auth.push((req, res, next) => {
      if (req.user !== 'admin') {
        return(res.status(401).json({
          error: 'needadminpermission',
          message: 'need admin permission'
        }));
      } else {
        next();
      }
    });
  }

  auth.push((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { 
      return(res.status(401).json({
        error: 'unauthorize',
        message: 'unauthorize'
      }));
    }
  });

  return auth;
}