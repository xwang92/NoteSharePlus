'use strict';

//A service to store constants that are used throughout the app
angular.module('core').factory('AppSettings', 
    function() {
        return {
            //Define UI actions
            'ACTION_ADD_SECTION': 'addSection',
        }
});
