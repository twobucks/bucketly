// test/server.test.js
const exec = require('mz/child_process').exec
const request = require('supertest-as-promised')
const expect = require('chai').expect

const app = require('../server')

describe('builds application', function () {
  it('builds to "build" directory', function () {
    // Disable mocha time-out because this takes a lot of time
    this.timeout(0)

    // Run process
    return exec('cd client && npm run build')
  })
})

describe('express serving', function () {
  it('responds to / with the index.html', function () {
    return request(app)
    .get('/')
    .expect('Content-Type', /html/)
    .expect(200)
    .then(res => expect(res.text).to.contain('<div id="root"></div>'))
  })

  it('responds to favicon.icon request', function () {
    return request(app)
    .get('/favicon.ico')
    .expect('Content-Type', 'image/png')
    .expect(200)
  })

  it('responds to any route with the index.html', function () {
    return request(app)
    .get('/foo/bar')
    .expect('Content-Type', /html/)
    .expect(200)
    .then(res => expect(res.text).to.contain('<div id="root"></div>'))
  })

  it('responds to POST on /', () => {
    return request(app)
    .post('/')
    .attach('file', 'test/cat.jpg')
    .expect('Content-Type', /application\/json/)
    .expect(500)
    .then(res => expect(JSON.parse(res.text).error).to.contain('bucket name is not available'))
  }).timeout(0)

  it('responds to POST on /api/test', () => {
    return request(app)
    .post('/api/test')
    .expect('Content-Type', /application\/json/)
    .expect(401)
    .then(res => expect(JSON.parse(res.text).error).to.contain('invalid token'))
  }).timeout(0)
})
