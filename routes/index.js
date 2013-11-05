exports.index=function(req, res){
	console.log("get index");
  res.render('index');
};

exports.partials=function (req, res){
	console.log("get partial");
  var name=req.params.name;
  res.render('partials/'+name);
};
