var cradle = require('cradle');
var c=  new(cradle.Connection);
var db=c.database('test');

var user=exports.user=function(req, res){
	db.exists(function(err, exists){
    if(err){
      console.log('error', err);
    }else if(exists){
      console.log('the force is with you.');
    }else{
      console.log('database does not exists.');
      db.create();
    }
  });
	console.log(req.body.doc);
	db.save(req.body.title , {doc:req.body.doc} , function (err, res) {
		if(err){
			console.log(err);
			return;
		}
	});
};
