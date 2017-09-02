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
const s3publicUrl = Promise.promisifyAll(require('s3-public-url'))

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
    res.status(422).json({
      error: e.message
    })
  }
})

app.get('/api/images', utils.jwtCheck, utils.findUserByAuthToken, async (req, res) => {
  try {
    const images = await req.user.getImages()
    const imagesJson = images.map(function (image) {
      return {
        url: image.url
      }
    })

    const imageCount = await models.Image.count({
      where: {
        'user_id': req.user.id
      }
    })

    res.json({
      images: imagesJson,
      count: imageCount
    })
  } catch (e) {
    res.status(422).json({
      error: e.message
    })
  }
})

app.post('/api/images', async (req, res) => {
  try {
    const form = new multiparty.Form()
    const [formParams, files] = await form.parseAsync(req)
    if (!formParams.access_token) {
      res.status(422).json({
        error: 'access token is required'
      })
      return
    }
    const accessToken = formParams.access_token[0]
    const user = await utils.findUserByAccessToken(accessToken, res)
    const path = files.file[0].path
    // TODO: check if the user has all the S3 details set up
    const s3 = new AWS.S3({
      accessKeyId: user.s3_details.aws_access_key,
      secretAccessKey: user.s3_details.aws_secret_key
    })
    Promise.promisifyAll(Object.getPrototypeOf(s3))
    const Bucket = user.s3_details.bucket_name
    const id = uuid.v4()
    const params = { Bucket, Key: id, Body: fs.createReadStream(path) }
    const policy = utils.getPublicReadPolicy(Bucket)

    await s3.createBucketAsync({ Bucket, ACL: 'public-read' })
    await s3.putBucketPolicyAsync({ Bucket, Policy: JSON.stringify(policy) })

    await s3.putObjectAsync(params)
    const { locationConstraint } = await s3.getBucketLocationAsync({ Bucket })
    const url = await s3publicUrl.getHttps(Bucket, id, locationConstraint)

    console.log('Successfully uploaded data to ' + Bucket + '/' + id)

    const image = await models.Image.create({
      url
    })
    await user.addImage(image)

    await fs.unlinkAsync(path)

    res.json({
      url
    })
  } catch (e) {
    console.error(e)
    res.status(422).json({
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

app.use(function (req, res, next) {
  res.status(404)

  if (req.accepts('json')) {
    res.send({ error: 'not found' })
    return
  }

  res.type('txt').send('not found')
})

const server = app.listen(9000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})

module.exports = server
