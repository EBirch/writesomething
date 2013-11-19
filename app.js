var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  path = require('path'),
  cradle = require('cradle'),
  passport = require('passport'),
  bcrypt = require('bcrypt');

var app = module.exports = express(),
	localStrategy=require('passport-local').Strategy,
	conn = new(cradle.Connection)();

var User=conn.database('users'),
		Docs=conn.database('docs');

var register=function(req, res){
	User.get(req.body.username, function(err, user){
		if(err){
			bcrypt.genSalt(function(err, salt){
		    bcrypt.hash(req.body.password, salt, function(err, hash){
				  User.save(req.body.username, {
			      password: hash, 
			      salt: salt
				  }, function (err, userRes) {
				      if(err){
				      	console.log(err);
				      }
				      else{
				      	console.log('User created');
								res.json({res:true});
				      }
		  		});
				});
	  	});
		}
		else{
			console.log('User already exists');
			res.json({res:false, err:{msg:"Username already in use", type:"error"}});
		}
	}
)};

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.locals.pretty = true;
	app.set('view engine', 'jade');
	app.use(express.bodyParser({limit:10000000}));
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.session({ secret: 'secret',expires : new Date(Date.now() + 3600000)}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

passport.use(new localStrategy(
	function(username, password, done){
		User.get(username, function(err, user){
			// if (err) { console.log('err:');console.log(err);return done(err); }
			// console.log(user);
			if(err){
				console.log('bad username');
				return done(null, false, { message: 'Incorrect username.' });
			}
			bcrypt.hash(password, user.salt, function(err, hash){
				if(user.password!==hash){
					console.log('bad password');
					return done(null, false, { message: 'Incorrect password.' });
				}
				else{
					console.log('login success');
					return done(null, user);
				}
			});
		})
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(user, done) {
  User.get(user, function(err, user){
  	// console.log('deserialize');
  	done(null, user);
  });
});

app.get('/', function(req, res){
	res.render('index', {auth:(typeof req.user!='undefined')});
});
app.get('/partials/login', function(req, res){
	res.render('partials/login');
});
app.get('/partials/register', function(req, res){
	res.render('partials/register');
});
app.get('*', function(req, res, next) {
	if(req.user){
		next();
	}
	else{
		console.log('not authorized');return res.render('index', {auth:false});
	}
});

app.get('/doclist', function(req, res){
	Docs.view('docs/author', {key:req.user._id}, function(err, doc){
		var temp=[];
		for(obj in doc){
			temp.push(doc[obj].value);
		}
		res.json(temp);
  });
});

app.get('/logout', function(req, res){
	console.log('logging out');
	req.session.destroy(function (err) {
		res.render('index', {auth:false});
  });
});
app.get('/partials/:name', routes.partials);
app.get('/template/modal/:name', function (req, res){
  var name=req.params.name;
  res.render('template/modal/'+name);
});

app.post('/api/user', api.user);
app.post('/register', register);
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
  	if(req.user){
  		req.logout();
  	}
    if (err) { return next(err); }
    if (!user) { return res.json({res:false, err:{msg:"Login Failed", type:"error"}}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({res:true});
    });
  })(req, res, next);
});

app.post('/doc', function(req, res, next){
  if(req.body.id===''){
  	res.json({res:false});
  }
  else{
  	Docs.get(req.body.id, function(err, doc){
  		if(doc.auth!=req.user._id){
  			res.json({res:false});
  		}
  		else{
  			res.json({res:true, title:doc.title, doc:doc.doc});
  		}
  	});
  }
});

app.post('/delete', function(req, res){
	Docs.get(req.body.id, function(err, doc){
		if(doc.auth!=req.user._id){
			res.json({res:false});
		}
		else{
			Docs.remove(doc._id, doc._rev, function(err, docRes){
				if(err)console.log(err);
				console.log('thing deleted');
				res.json({res:true});
			});
		}
	})
});

app.put('/doc', function(req, res){
	if(req.body.id===''){
		console.log('new doc');
		var path=(req.body.path!='/')?(req.body.path):('/'+req.user._id);
		Docs.save({auth:req.user._id, title:req.body.title, doc:req.body.doc, path:path, type:"file"}, function(err, docRes){
			res.json({res:docRes.ok, id:docRes.id});
		});
  }
	else{
  	Docs.get(req.body.id, function(err, doc){
  		if(doc.auth!=req.user._id){
  			console.log("bad user update");
  			res.json({res:false});
  		}
  		else{
  			console.log('merge doc');
  			Docs.merge(req.body.id, {title:req.body.title, doc:req.body.doc}, function(err, docRes){
  				//TODO?
  			});
  		}
  	});
  }
});

app.get('*', function(req, res){
	res.render('index', {auth:(typeof req.user!='undefined')});
});

app.listen(80);

console.log('Listening on port 80');

