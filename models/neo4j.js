var neo4j = require('neo4j-driver')
var driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neoflix')
  )
  var session = driver.session({
    database: 'neoflix',
    defaultAccessMode: neo4j.session.WRITE
  })
  exports.session = session
