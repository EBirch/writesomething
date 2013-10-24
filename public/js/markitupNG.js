  angular.module('markitupNG', []).
  directive('markitup', function () {
    return{
      restrict: 'A',
      link: function(scope, elm, attrs) {
        // elm.markItUp(settings);
        // if (!attrs.id) {
        //   attrs.$set('id', 'markItUp'+numIds++);
        // }
        // elm.markItUp();
        angular.element(elm).markItUp(scope.markSettings);
      }
    };
  });
