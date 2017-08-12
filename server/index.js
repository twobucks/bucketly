const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const emojiFavicon = require('emoji-favicon')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const morgan = require('morgan')

const Promise = require('bluebird')
const multiparty = Promise.promisifyAll(require('multiparty'), {multiArgs: true})
const fs = Promise.promisifyAll(require('fs'))

const app = express()
app.use(bodyParser.json())
app.use(compression())
app.use(emojiFavicon('sparkles'))
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

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
    console.log(e.message)
  }
})

app.set('x-powered-by', false)

const server = app.listen(9000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})
