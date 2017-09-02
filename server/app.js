const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const emojiFavicon = require('emoji-favicon')
const uuid = require('uuid')
const morgan = require('morgan')
const _ = require('lodash')
const AuthenticationClient = require('auth0').AuthenticationClient
const Uploader = require('./uploader')

const Promise = require('bluebird')
const multiparty = Promise.promisifyAll(require('multiparty'), {multiArgs: true})
const fs = Promise.promisifyAll(require('fs'))

const models = require('./models')
const utils = require('./utils')

const app = express()
app.use(bodyParser.json())
app.use(compression())
app.use(emojiFavicon('sparkles'))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))
}

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
    res.status(401).json({
      error: 'user not found'
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
    const id = uuid.v4()
    const filePath = path.join(__dirname, '..', 'test', 'cat.jpg')

    const uploader = new Uploader({
      accessKey: awsAccessKey,
      secretKey: awsSecretKey,
      bucketName
    })

    await uploader.upload({
      path: filePath,
      key: id
    })

    await uploader.delete({
      key: id
    })

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
    if (!user) {
      return
    }
    const path = files.file[0].path
    if (_.isEmpty(user.s3_details)) {
      res.status(422).json({
        error: 'S3 configuration is not set up yet'
      })
      return
    }

    const uploader = new Uploader({
      accessKey: user.s3_details.aws_access_key,
      secretKey: user.s3_details.aws_secret_key,
      bucketName: user.s3_details.bucket_name
    })

    const url = await uploader.upload({
      path,
      key: uuid.v4()
    })
    await fs.unlinkAsync(path)

    const image = await models.Image.create({
      url
    })
    await user.addImage(image)

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

module.exports = app
