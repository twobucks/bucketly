const request = require('supertest-as-promised')
const expect = require('chai').expect
const models = require('../server/models')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('API', function () {
  let app = require('../server/app')
  let server

  beforeEach(function (done) {
    server = app.listen(3000)

    models.User.sync({ force: true }).then(() => {
      done()
    })
  })

  afterEach(function () {
    server.close()
  })

  describe('POST /api/images', function () {
    it('requires access token as a parameter', () => {
      return request(app)
             .post('/api/images')
             .attach('file', 'test/cat.jpg')
             .expect('Content-Type', /application\/json/)
             .expect(422)
             .then(res => expect(JSON.parse(res.text).error).to.contain('access token is required'))
    }).timeout(0)

    it('returns 404 for invalid access tokens', () => {
      return request(app)
             .post('/api/images')
             .field('access_token', '123')
             .attach('file', 'test/cat.jpg')
             .expect('Content-Type', /application\/json/)
             .expect(404)
             .then(res => expect(JSON.parse(res.text).error).to.contain('user not found'))
    }).timeout(0)

    it('returns 422 when S3 details are not set up', async () => {
      await models.User.create({
        access_token: '123'
      })
      return request(app)
             .post('/api/images')
             .field('access_token', '123')
             .attach('file', 'test/cat.jpg')
             .expect('Content-Type', /application\/json/)
             .expect(422)
             .then(res => expect(JSON.parse(res.text).error).to.contain('S3 configuration is not set up yet'))
    }).timeout(0)

    it('calls S3 correctly when S3 details are set', async () => {
      await models.User.create({
        access_token: '123',
        s3_details: {
          bucket_name: 'bucket',
          aws_access_key: 'access',
          aws_secret_key: 'secret'
        }
      })

      const url = 'https://google.com'

      class UploaderMock {
        upload () {
        }
      }
      const uploadMock = sinon.mock(UploaderMock.prototype)
      uploadMock.expects('upload').once().returns(url)

      const app = proxyquire('../server/app', {
        './uploader': UploaderMock
      })

      return request(app)
             .post('/api/images')
             .field('access_token', '123')
             .attach('file', 'test/cat.jpg')
             .expect('Content-Type', /application\/json/)
             .expect(200)
             .then(res => expect(JSON.parse(res.text).url).to.contain(url))
             .then(app.close)
    }).timeout(0)
  })

  it('responds to POST on /api/test', () => {
    return request(app)
      .post('/api/test')
      .expect('Content-Type', /application\/json/)
      .expect(401)
      .then(res => expect(JSON.parse(res.text).error).to.contain('invalid token'))
  }).timeout(0)
})
