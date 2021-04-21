var neo4j = require('neo4j-driver')
var driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'megh@neo4j')
  )
  var session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
  })
  exports.session = session