'use strict';

var justwrite=false;

angular.module('write.controllers', ['ui.bootstrap.modal']).
controller('rootCtrl', function($scope, $log, $http, $location, $rootScope){
  $scope.logout=function(){
    $rootScope.loggedIn=false;
  };
  $rootScope.loggedIn=$scope.loggedIn;
  $scope.$watch(function(){return $location.path();}, function(newValue, oldValue){  
    if (!$rootScope.loggedIn&&newValue!='/login'&&newValue!='/register'){  
      $location.path('/login');  
    }
  });
}).
controller('mainCtrl', function($scope, $log, $http, $location, $rootScope, $modal, editDoc){
  $scope.edit=function(id){
    editDoc.setDocId(id);
    $location.path('/edit');
  };
  $scope.delete=function(doc){
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
      $scope.docs=data;
      if(Object.keys($scope.docs).length==0){
        $scope.data=[];
      }
    });
  };

  $scope.docs=[{title:""}];
  $scope.update();
}).
controller('editCtrl', function($scope, $log, $http, $location, $rootScope, editDoc){
  $scope.id=editDoc.getDocId();
  editDoc.setDocId('');
  $http({
    method : 'POST',
    url : '/doc',
    data : {id:$scope.id}
  }).success(function(data){
    if(data.res){
      $scope.doc=data.doc;
      $scope.title=data.title;
      // $scope.$apply();
    }
  });

  $scope.save=function(){
    $http({
      method : 'PUT',
      url : '/doc',
      data : {
        title:$scope.title,
        doc:$scope.doc,
        id:$scope.id
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
    });
  };
}).
controller('loginCtrl', function($scope, $log, $http, $rootScope, $location){
  $scope.test={};
  $scope.logout=function(){
    $rootScope.loggedIn=false;
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
        $rootScope.loggedIn=true;
        $location.path("/main");
      }
      if(!data.res){
        $rootScope.loggedIn=false;
        $location.path("/login");
      }
    });
  };
  // $scope.markSettings={
  //   nameSpace:       "html", // Useful to prevent multi-instances CSS conflict
  //   onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
  //   onCtrlEnter:     {keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
  //   onTab:           {keepDefault:false, openWith:'     '},
  //   markupSet:  [
  //       {name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
  //       {name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
  //       {name:'Heading 3', key:'3', openWith:'<h3(!( class="[![Class]!]")!)>', closeWith:'</h3>', placeHolder:'Your title here...' },
  //       {name:'Heading 4', key:'4', openWith:'<h4(!( class="[![Class]!]")!)>', closeWith:'</h4>', placeHolder:'Your title here...' },
  //       {name:'Heading 5', key:'5', openWith:'<h5(!( class="[![Class]!]")!)>', closeWith:'</h5>', placeHolder:'Your title here...' },
  //       {name:'Heading 6', key:'6', openWith:'<h6(!( class="[![Class]!]")!)>', closeWith:'</h6>', placeHolder:'Your title here...' },
  //       {name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>'  },
  //       {separator:'---------------' },
  //       {name:'Bold', key:'B', openWith:'<strong>', closeWith:'</strong>' },
  //       {name:'Italic', key:'I', openWith:'<em>', closeWith:'</em>'  },
  //       {name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
  //       {separator:'---------------' },
  //       {name:'Ul', openWith:'<ul>\n', closeWith:'</ul>\n' },
  //       {name:'Ol', openWith:'<ol>\n', closeWith:'</ol>\n' },
  //       {name:'Li', openWith:'<li>', closeWith:'</li>' },
  //       {separator:'---------------' },
  //       {name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
  //       {name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
  //       {separator:'---------------' },
  //       {name:'Clean', replaceWith:function(h) { return h.selection.replace(/<(.*?)>/g, ""); } },
  //       {name:'Preview', call:'preview', className:'preview' }
  //   ]
  // };
  // $scope.test=User.get();
});
