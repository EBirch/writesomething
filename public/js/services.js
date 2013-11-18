angular.module('write.services', []).
  service('editDoc', function(){
    var id='';
    var path='/';
    return {
      getDocId: function(){
        return id;
      },
      setDocId: function(value){
        id=value;
      },
      getDocPath: function(){
        return path;
      },
      setDocPath: function(value){
        path=value;
      }
    };
  });
