const app = require('./app')

const server = app.listen(9000, function () {
  const port = server.address().port

  console.log('Server listening at http://127.0.0.1:%s', port)
})

module.exports = server
