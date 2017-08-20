const expect = require('chai').expect
const utils = require('../server/utils')

describe('utils.buildWhereQueryFromUserInfo', function(){
  it('returns email for email token', function () {
    expect(utils.whereQueryFromUserInfo({
      sub: "email|12345", name: "hrvoje@twobucks.co"
    })).to.eql({email: "hrvoje@twobucks.co"})
  })

  it('returns github id for github', function () {
    expect(utils.whereQueryFromUserInfo({
      sub: "github|12345", name: "hrvoje@twobucks.co"
    })).to.eql({github_id: "12345"})
  })

  it('returns twitter id for twitter', function () {
    expect(utils.whereQueryFromUserInfo({
      sub: "twitter|12345", name: "hrvoje@twobucks.co"
    })).to.eql({twitter_id: "12345"})
  })
})
