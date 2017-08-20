const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const emojiFavicon = require('emoji-favicon')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const morgan = require('morgan')
const _ = require('lodash')
const jwt = require('express-jwt')
const AuthenticationClient = require('auth0').AuthenticationClient
const jwks = require('jwks-rsa')

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


const auth0 = new AuthenticationClient({
  domain: 'twobucks.auth0.com'
})

app.post('/api/login', jwtCheck, async (req, res) => {
  try {
    const token = utils.getJWTToken(req)
    const userInfoRaw = await auth0.users.getInfo(token)
    const userInfo = JSON.parse(userInfoRaw)
    const where = utils.whereQueryFromUserInfo(userInfo)
    const [ user, created ] = await models.User.findOrCreate({
      where,
      defaults: { access_token: token }
    })
    await user.update({ access_token: token })
    res.json(_.pick(user, 'access_token'))
  } catch(e) {
    console.log(e)
  }
})

app.get('/api/tokens', jwtCheck, async (req, res) => {
  const token = utils.getJWTToken(req)
  const user = await models.User.findOne({
    where: {
      access_token: token
    }
  })

  if (!user) {
    res.status(404).json({
      error: "User not found"
    })
    return
  }

  res.json(_.pick(user, "s3_details"))
})

app.post('/api/test', async (req, res) => {
  try {
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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

app.post('/', async (req, res) => {
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

app.set('x-powered-by', false)

const server = app.listen(9000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})

module.exports = server
