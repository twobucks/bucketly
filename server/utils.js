function whereQueryFromUserInfo (userinfo) {
  const sub = userinfo.sub

  switch (true) {
    case /email/.test(sub):
      return {
        email: userinfo.name
      }
    case /github/.test(sub):
      return {
        github_id: sub.split('|')[1]
      }
    case /twitter/.test(sub):
      return {
        twitter_id: sub.split('|')[1]
      }
  }
}

function getJWTToken (req) {
  var parts = req.headers.authorization.split(' ')
  if (parts.length === 2) {
    var scheme = parts[0]
    var credentials = parts[1]
    if (/^Bearer$/i.test(scheme)) {
      return credentials
    }
  }
  return false
}

module.exports = {
  whereQueryFromUserInfo,
  getJWTToken
}
