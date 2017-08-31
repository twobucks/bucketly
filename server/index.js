const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const emojiFavicon = require('emoji-favicon')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const morgan = require('morgan')
const _ = require('lodash')
const AuthenticationClient = require('auth0').AuthenticationClient

const Promise = require('bluebird')
const multiparty = Promise.promisifyAll(require('multiparty'), {multiArgs: true})
const fs = Promise.promisifyAll(require('fs'))

const models = require('./models')
const utils = require('./utils')

const app = express()
app.use(bodyParser.json())
app.use(compression())
app.use(emojiFavicon('sparkles'))
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')))

app.post('/api/login', utils.jwtCheck, async (req, res) => {
  try {
    const auth0 = new AuthenticationClient({
      domain: 'twobucks.auth0.com'
    })
    const authToken = utils.getJWTToken(req)
    const userInfoRaw = await auth0.users.getInfo(authToken)
    const userInfo = JSON.parse(userInfoRaw)
    const where = utils.whereQueryFromUserInfo(userInfo)
    const accessToken = uuid.v4()
    const [ user ] = await models.User.findOrCreate({
      where,
      defaults: { auth_token: authToken, access_token: accessToken }
    })
    await user.update({ auth_token: authToken })
    res.json(_.pick(user, 'auth_token'))
  } catch (e) {
    console.log(e)
  }
})

app.get('/api/tokens', utils.jwtCheck, utils.findUserByAuthToken, async (req, res) => {
  if (!req.user) {
    res.status(404).json({
      error: 'User not found'
    })
    return
  }

  res.json(_.pick(req.user, 's3_details', 'access_token'))
})

app.post('/api/test', utils.jwtCheck, utils.findUserByAuthToken, async (req, res) => {
  try {
    req.user.update({
      s3_details: {
        bucket_name: req.body.bucket_name,
        aws_secret_key: req.body.aws_secret_key,
        aws_access_key: req.body.aws_access_key
      }
    })
    const bucketName = req.body.bucket_name
    const awsSecretKey = req.body.aws_secret_key
    const awsAccessKey = req.body.aws_access_key
    const s3 = new AWS.S3({
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey
    })
    Promise.promisifyAll(Object.getPrototypeOf(s3))

    const Bucket = bucketName
    const id = uuid.v4()
    const filePath = path.join(__dirname, '..', 'test', 'cat.jpg')

    const params = { Bucket, Key: id, Body: fs.createReadStream(filePath) }

    await s3.createBucketAsync({ Bucket })
    await s3.putObjectAsync(params)
    await s3.deleteObjectAsync(_.omit(params, 'Body'))

    res.json({ })
  } catch (e) {
    // TODO: better error handling
    res.status(500).json({
      error: e.message
    })
  }
})

app.post('/api/images', async (req, res) => {
  try {
    const form = new multiparty.Form()
    const id = uuid.v4()
    const [_, files] = await form.parseAsync(req) // eslint-disable-line no-unused-vars
    const path = files.file[0].path
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    })
    Promise.promisifyAll(Object.getPrototypeOf(s3))
    const Bucket = 'Bucketly'
    const params = { Bucket, Key: id, Body: fs.createReadStream(path) }

    await s3.createBucketAsync({ Bucket })
    await s3.putObjectAsync(params)

    console.log('Successfully uploaded data to ' + Bucket + '/' + id)

    await fs.unlinkAsync(path)

    res.json({
      uuid: id
    })
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

app.set('x-powered-by', false)

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'invalid token'
    })
  }
})

const server = app.listen(9000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})

module.exports = server
