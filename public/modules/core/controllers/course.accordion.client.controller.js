'use strict';

angular.module('core').controller('CourseAccordionController', ['$scope',
	function($scope) {
		$scope.courses = [
            {
                'code': 'PTER101',
            },
            {
                'code': 'ELI102',
            },
            {
                'code': 'HAN103',
            },
        ];
        $scope.$on('add-course', function(event, args){
            $scope.courses.push(args);
        });
	}
]);