curl -X PUT http://localhost:5984/users/
curl -X PUT http://localhost:5984/docs/
curl -X PUT http://localhost:5984/docs/_design/docs -d @docsView.json
