const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const emojiFavicon = require('emoji-favicon')
const uuid = require('uuid')
const AWS = require('aws-sdk')

const Promise = require('bluebird')
const multiparty = Promise.promisifyAll(require('multiparty'), {multiArgs: true})
const fs = Promise.promisifyAll(require('fs'))

const app = express()
app.use(bodyParser.json())
app.use(compression())
app.use(emojiFavicon('sparkles'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

app.get('/404', function (req, res) {
  res.sendFile(path.join(__dirname, '../public', '404.html'))
})

app.post('/', async (req, res, next) => {
  try {
    const form = new multiparty.Form()
    const id = uuid.v4()
    const [_, files] = await form.parseAsync(req);
    const path = files.file[0].path
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    })
    Promise.promisifyAll(Object.getPrototypeOf(s3))
    const Bucket = "Bucketly"
    const params = { Bucket, Key: id, Body: fs.createReadStream(path)};

    await s3.createBucketAsync({ Bucket })
    await s3.putObjectAsync(params)

    console.log("Successfully uploaded data to " + Bucket + "/" + id);

    await fs.unlinkAsync(path)

    res.json({
      uuid: id
    })
  } catch (e) {
    console.log(e.message)
  }
})

app.set('views', path.join(__dirname, 'views'))
app.set('x-powered-by', false)
app.use('/public', express.static(path.join(__dirname, '../public')))

const server = app.listen(3000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})
