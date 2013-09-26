var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  path = require('path');

var app = module.exports = express();

app.set('views', __dirname + '/views');
app.locals.pretty = true;
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('*', routes.index);

app.listen(8888);

console.log('Listening on port 8888');
