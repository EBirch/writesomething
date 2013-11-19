angular.module('write.controllers', []).
controller('rootCtrl', function($scope, $log, $http, $location, $timeout){
  $scope.closeError=function(){
    $scope.errors=[];
  };
  $scope.logout=function(){
    $scope.loggedIn=false;
    $http({
      method : 'GET',
      url : '/logout'
    });
  };
  // $scope.$watch(function(){return $scope.errors;}, function(newVal, oldVal){
  //   if(typeof(newVal)!=='undefined'&&newVal.length>0){
  //     $timeout($scope.closeError, 3000);
  //   }
  // });
  $scope.$watch(function(){return $location.path();}, function(newValue, oldValue){
    $scope.errors=[];
    if($scope.loggedIn&&newValue==='/login'){
      $location.path('/main');
    }
    else if (!$scope.loggedIn&&newValue!='/login'&&newValue!='/register'){  
      $location.path('/login');  
    }
  });
}).
controller('mainCtrl', function($scope, $log, $http, $location, $rootScope, editDoc){
  $scope.edit=function(doc){
    editDoc.setDocId(doc.id);
    editDoc.setDocPath(doc.path);
    $location.path('/edit');
  };
  $scope.delete=function(doc){
    //TODO: delete directory case
    var test=confirm("Delete "+doc.title+"?\nThis cannot be undone.");
    if(test){
      $http({
        method : 'POST',
        url : '/delete',
        data : {
          id: doc.id
        }
      }).success(function(data){
        $scope.update();
      });
    }
  };
  $scope.update=function(){
    $http({
      method : 'GET',
      url : '/doclist'
    }).success(function(data){
      if(data.length==0){
        $scope.docs=[];
      }
      else{
        var temp=new Tree('');
        for(var obj=0;obj<data.length;++obj){
          var paths=data[obj].path.split('/');
          paths.shift();
          paths.shift();
          paths.pop();
          data[obj].paths=paths;
        }
        data.sort(function(a,b){
          return(a.paths.length<b.paths.length)?(-1):((a.paths.length>b.paths.length)?(1):(0));
        });
        for(var thing=0;thing<data.length;++thing){
          buildTree(temp, data[thing]);
        }
        $scope.docs=temp;
      }
    });
  };
  function Tree(doc,child){
    this.doc = doc;
    this.children = child || [];
    this.add = function (parentDoc){
      this.children.push(new Tree(parentDoc));
    }
  };
  function buildTree(tree, doc){
    if(doc.paths.length==0){
      tree.add(doc);
      return;
    }
    for(var childCount=0;childCount<tree.children.length;++childCount){
      if(tree.children[childCount].doc.type==='dir'&&tree.children[childCount].doc.title===doc.paths[0]){
        doc.paths.shift();
        buildTree(tree.children[childCount], doc);
      }
    }
  };

  $scope.docs=[{title:""}];
  $scope.update();
}).
controller('editCtrl', function($scope, $log, $http, $location, $rootScope, editDoc){
  $scope.id=editDoc.getDocId();
  editDoc.setDocId('');
  $scope.path=editDoc.getDocPath();
  editDoc.setDocPath('/');
  $http({
    method : 'POST',
    url : '/doc',
    data : {id:$scope.id}
  }).success(function(data){
    if(data.res){
      $scope.doc=data.doc;
      $scope.title=data.title;
    }
  });

  $scope.save=function(){
    $http({
      method : 'PUT',
      url : '/doc',
      data : {
        title:$scope.title,
        doc:$scope.doc,
        id:$scope.id,
        path:$scope.path
      }
    }).success(function(data){
      if(data.res){
        $scope.id=data.id;
      }
    });
  }
}).
controller('registerCtrl', function($scope, $log, $http, $location, $rootScope){
  $scope.test={};
  $scope.submit=function(){
    $http({
      method : 'POST',
      url : '/register',
      data : {
        username:$scope.test.username,
        password:$scope.test.password,
        email:$scope.test.email
      }
    }).success(function(data){
      if(data.res){
        $location.path('/login');
      }
      else{
        $scope.$parent.errors=[data.err];
        console.log($scope.$parent.errors);
      }
    });
  };
}).
controller('loginCtrl', function($scope, $log, $http, $location){
  $scope.test={};
  $scope.logout=function(){
    $scope.$parent.loggedIn=false;
  };
  $scope.submit=function(){
    $http({
        method : 'POST',
        url : '/login',
        data : {
          username:$scope.test.username,
          password:$scope.test.password
        }
    }).success(function(data){
      if(data.res){
        $scope.$parent.loggedIn=true;
        $location.path("/main");
      }
      if(!data.res){
        $scope.$parent.loggedIn=false;
        $location.path("/login");
        $scope.$parent.errors=[data.err];
      }
    });
  };
});
