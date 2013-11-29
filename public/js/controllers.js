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
  $scope.username='ethan';
}).
controller('mainCtrl', function($scope, $log, $http, $location, $rootScope, $timeout, editDoc){
  $scope.edit=function(doc){
    editDoc.setDocId(doc.id);
    editDoc.setDocPath(doc.path);
    $location.path('/edit');
  };
  $scope.mkdir=function(path){
    var name=prompt("Folder Name:");
    if(name){
      $http({
        method : 'PUT',
        url : '/doclist',
        data :{
          title:name,
          path:path
        }
      }).success(function(data){
        if(data.res){
          $scope.update();
        }
      });
    }
  };
  $scope.delete=function(doc){
    //TODO: delete directory case
    //TODO: replace confirm with modal
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
        $scope.data=data;
        updateDocList();
      }
    });
  };
  function updateDocList(){
    var temp=new Tree('');
    for(var obj=0;obj<$scope.data.length;++obj){
      var paths=$scope.data[obj].path.split('/');
      paths.shift();
      paths.shift();
      paths.pop();
      $scope.data[obj].paths=paths;
    }
    $scope.data.sort(function(a,b){
      return(a.paths.length<b.paths.length)?(-1):((a.paths.length>b.paths.length)?(1):(0));
    });
    for(var thing=0;thing<$scope.data.length;++thing){
      $scope.buildTree(temp, $scope.data[thing]);
    }
    $scope.docs=temp;
    if(!$scope.$$phase){
      $scope.$apply();
    }
    $timeout(function(){
      for(doc in $scope.data){
        var tempEle=document.getElementById($scope.data[doc].type+$scope.data[doc].id);
        angular.element(tempEle).data($scope.data[doc]);
      }
    });
  };
  function Tree(doc,child){
    this.doc = doc;
    this.children = child || [];
    this.add = function (parentDoc){
      var fileTemp=[];
      var dirTemp=[];
      this.children.push(new Tree(parentDoc));
      for(obj in this.children){
        if(this.children[obj].doc.type==='file'){
          fileTemp.push(this.children[obj]);
        }
        else{
          dirTemp.push(this.children[obj]);
        }
      }
      fileTemp.sort(function(a,b){
        return (a.doc.date<b.doc.date)?(-1):((a.doc.date>b.doc.date)?(1):(0));
      });
      dirTemp.sort(function(a,b){
        return (a.doc.title<b.doc.title)?(-1):((a.doc.title>b.doc.title)?(1):(0));
      });
      this.children=fileTemp.concat(dirTemp);
    }
  };

  $scope.buildTree= function(tree, doc){
    if(doc.paths.length==0){
      tree.add(doc);
      return;
    }
    for(var childCount=0;childCount<tree.children.length;++childCount){
      if(tree.children[childCount].doc.type==='dir'&&tree.children[childCount].doc.title===doc.paths[0]){
        doc.paths.shift();
        $scope.buildTree(tree.children[childCount], doc);
      }
    }
  };

  $scope.updatePath=function(obj){
    $http({
      method : 'PUT',
      url : '/path',
      data : {
        id:obj.id,
        path:obj.path
      }
    }).success(function(data){

    });
  };

  $scope.handleDragStart = function(e){
    var tempData=angular.element(e.target).data();
    e.dataTransfer.setData('application/json', JSON.stringify({title:tempData.title, path:tempData.path, type:tempData.type, id:tempData.id}));;
  };
    
  $scope.handleDragEnd = function(e){
    console.log('drag done');
    this.style.opacity = '1.0';
  };

  $scope.handleDrop = function(e){
    e.preventDefault();
    e.stopPropagation();
    var srcData=JSON.parse(e.dataTransfer.getData('application/json'));
    var destTemp=angular.element(e.target).data();
    var destData={path:destTemp.path, type:destTemp.type, id:destTemp.id};
    if(typeof(destData.path)==='undefined'){
      console.log('undefined dest path');
      return;
    }
    if((srcData.id===destData.id)||(destData.type==='file')){
      return;
    }
    //TODO: same dir name case
    var newPath;
    for(obj in $scope.data){
      if($scope.data[obj].id===srcData.id){
        $scope.data[obj].path=destData.path+"/"+$scope.data[obj].title;
        newPath=$scope.data[obj].path;
        $scope.updatePath($scope.data[obj]);
        if(srcData.type==='file'){
          updateDocList();
          return;
        }
      }
    }
    if(srcData.type==='dir'){
      for(obj in $scope.data){
        if($scope.data[obj].path.indexOf(srcData.path)==0){
          $scope.data[obj].path=newPath+$scope.data[obj].path.substr(srcData.path.length);
          $scope.updatePath($scope.data[obj]);
        }
      }
    }
    updateDocList();
  };
  $scope.handleDragOver=function(e){
    e.preventDefault();
    e.dataTransfer.dropEffect='move';
    return false;
  };

  $timeout(function(){
    var tempEle=document.getElementById('listContainer');
    angular.element(tempEle).data({path:'/'+$scope.username, id:0});
  });
  $scope.data=[];
  $scope.docs=[{title:""}];
  $scope.update();
}).
controller('editCtrl', function($scope, $log, $http, $location, $rootScope, $timeout, editDoc){

  $scope.save=function(){
    date=new Date();
    $http({
      method : 'PUT',
      url : '/doc',
      data : {
        title:$scope.title,
        doc:$scope.doc,
        id:$scope.id,
        path:$scope.path,
        date:date.toString()
      }
    }).success(function(data){
      if(data.res){
        $scope.id=data.id;
      }
    });
  }

  $scope.strip=function(html){
    var tmp=document.createElement("div");
    tmp.innerHTML=html;
    if (tmp.textContent==='' && typeof(tmp.innerText)==='undefined') {
      return '0';
    }
    return tmp.textContent||tmp.innerText;
  }

  $scope.countWords=function(){
    $scope.count=strip($scope.doc.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace("&nbsp;", " ")).split(/\s+/).length;
  };

  $scope.id=editDoc.getDocId();
  editDoc.setDocId('');
  $scope.path=editDoc.getDocPath();
  editDoc.setDocPath('/');
  $scope.count=0;
  $http({
    method : 'POST',
    url : '/doc',
    data : {
      id:$scope.id
    }
  }).success(function(data){
    if(data.res){
      $scope.doc=data.doc;
      $scope.title=data.title;
      $scope.countWords();
    }
  });

}).
controller('registerCtrl', function($scope, $log, $http, $location, $rootScope){
  $scope.data={};
  $scope.submit=function(){
    if($scope.data.password!==$scope.data.passwordConfirm){
      $scope.$parent.errors=[{msg:"Passwords do not match", type:"error"}];
      return;
    }
    $http({
      method : 'POST',
      url : '/register',
      data : {
        username:$scope.data.username,
        password:$scope.data.password,
        email:$scope.data.email
      }
    }).success(function(data){
      if(data.res){
        $location.path('/login');
      }
      else{
        $scope.$parent.errors=[data.err];
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
