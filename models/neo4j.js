var neo4j = require('neo4j-driver')
var driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'dbislab')
  )
  var session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
  })
  session
    .run('CREATE (a:Person {name: $name}) RETURN a.name as name', {
      name: 'Alison'
    })
    .then(result => {
      result.records.forEach(record => {
        console.log(record.get('name'))
      })
    })
    .catch(error => {
      console.log(error)
    })
    .then(() => session.close())