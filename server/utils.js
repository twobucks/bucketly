const models = require('./models')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

function whereQueryFromUserInfo (userinfo) {
  const sub = userinfo.sub

  switch (true) {
    case /email/.test(sub):
      return {
        email: userinfo.name
      }
    case /github/.test(sub):
      return {
        github_id: sub.split('|')[1]
      }
    case /twitter/.test(sub):
      return {
        twitter_id: sub.split('|')[1]
      }
  }
}

function getJWTToken (req) {
  var parts = req.headers.authorization.split(' ')
  if (parts.length === 2) {
    var scheme = parts[0]
    var credentials = parts[1]
    if (/^Bearer$/i.test(scheme)) {
      return credentials
    }
  }
  return false
}

async function findUserByAuthToken (req, res, next) {
  const token = getJWTToken(req)
  const user = await models.User.findOne({
    where: {
      auth_token: token
    }
  })

  req.user = user
  next()
}

async function findUserByAccessToken (token, res) {
  const user = await models.User.findOne({
    where: {
      access_token: token
    }
  })

  if (!user) {
    res.status(404).json({
      error: 'user not found'
    })
    return
  }

  return user
}

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://twobucks.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://localhost:3000',
  issuer: 'https://twobucks.auth0.com/',
  algorithms: ['RS256']
})

module.exports = {
  findUserByAuthToken,
  findUserByAccessToken,
  whereQueryFromUserInfo,
  getJWTToken,
  jwtCheck
}
