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
	// console.log(req.body.body);
	User.get(req.body.username, function(err, user) {
		if(err){
			bcrypt.genSalt(function(err, salt) {
		    bcrypt.hash(req.body.password, salt, function(err, hash) {
				  User.save(req.body.username, {
			      password: hash, 
			      email: req.body.email,
			      salt: salt
				  }, function (err, res) {
				      if(err){
				      	console.log(err);
				      }
				      else{
				      	console.log('User created');
				      }
		  		});
				});
	  	});
		}
		else{
			console.log('User already exists');
			res.json({reg:false});
		}
	}
)};

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.locals.pretty = true;
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
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
		console.log('tryauth');
		User.get(username, function(err, user){
			// if (err) { console.log('err:');console.log(err);return done(err); }
			console.log(user);
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
					console.log('yay login');
					return done(null, user);
				}
			});
		})
}));

passport.serializeUser(function(user, done) {
  // please read the Passport documentation on how to implement this. We're now
  // just serializing the entire 'user' object. It would be more sane to serialize
  // just the unique user-id, so you can retrieve the user object from the database
  // in .deserializeUser().
  done(null, user._id);
});

passport.deserializeUser(function(user, done) {
  // Again, read the documentation.
  User.get(user, function(err, user){
  	console.log('deserialize');
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
	console.log("enter catchall");
	// console.log(req);
	if(req.user){
		next();
	}
	else{
		console.log('no');return res.render('index', {auth:false});
	}
  // passport.authenticate('local', function(err, user, info) {
  //   if (err) { return next(err); }
  //   if (!user) { console.log('no');return res.render('index'); }
  //   req.logIn(user, function(err) {
  //     if (err) { return next(err); }
  //     console.log('welp');
  //     return;
  //   });
  // })(req, res, next);
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
	req.logout();
	res.render('index', {auth:false});
});
app.get('/partials/:name', routes.partials);

app.post('/api/user', api.user);
app.post('/register', register);
app.post('/login', function(req, res, next) {
	console.log('trylogin');
  passport.authenticate('local', function(err, user, info) {
  	if(req.user){
  		req.logout();
  	}
    if (err) { return next(err); }
    if (!user) { return res.json({res:false}); }
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
  		console.log(doc.auth+" : "+req.user._id);
  		if(doc.auth!=req.user._id){
  			res.json({res:false});
  		}
  		else{
  			res.json({res:true, title:doc.title, doc:doc.doc});
  		}
  	});
  }
});

app.put('/doc', function(req, res){
	if(req.body.id===''){
		Docs.save({auth:req.user._id, title:req.body.title, doc:req.body.doc}, function(err, res){
			//TODO?
		});
  }
	else{
  	Docs.get(req.body.id, function(err, doc){
  		if(doc.auth!=req.user._id){
  			console.log("bad user update");
  			res.json({res:false});
  		}
  		else{
  			Docs.merge(req.body.id, {title:req.body.title, doc:req.body.doc}, function(err, res){
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

