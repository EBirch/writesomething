angular.module('write.directives', []).
  directive('ckEditor', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0]);

      if (!ngModel) return;

      ck.on('pasteState', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(ck.getData());
        });
      });

      ngModel.$render = function(value) {
        ck.setData(ngModel.$viewValue);
      };
    }
  };
}).
directive('drag', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element[0].addEventListener('dragstart', scope.handleDragStart, false);
      // element[0].addEventListener('dragend', scope.handleDragEnd, false);
    }
  }
}).
directive('drop', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element[0].addEventListener('drop', scope.handleDrop, false);
      element[0].addEventListener('dragover', scope.handleDragOver, false);
    }
  }
});
