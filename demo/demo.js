/**
 * @auther Alireza Mirian (mirian@hasintech.com)
 * @since 1.0 (08/27/2016)
 */

(function(angular){
    "use strict";

    angular.module("demo", ['ngMaterial','ngMessages', 'ame.lightbox'])
        .controller("MainController", MainController)
        .run(function($rootScope){
            $rootScope.dir = "ltr";
        });

    function MainController(ameLightbox, ameLightboxDefaults){
        var self = this;
        resetOptions();
        self.items = [
            'http://placehold.it/350x150',
            'http://placehold.it/400x800',
            'http://placehold.it/1200x768',
            'http://placehold.it/500x100'
        ];

        self.showDemo = showDemo;
        self.resetOptions = resetOptions;

        function showDemo(targetEvent){
            ameLightbox.show(self.items, angular.extend({}, self.options, {
                targetEvent: self.options.targetEvent ? targetEvent : undefined
            }));
        }
        function resetOptions(){
            self.options = angular.copy(ameLightboxDefaults);
            self.options.targetEvent = true;
        }
    }
})(angular);