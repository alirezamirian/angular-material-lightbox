/**
 * @auther Alireza Mirian (mirian@hasintech.com)
 * @since 1.0 (08/27/2016)
 */

(function(angular){
    "use strict";

    angular.module("demo", ['ngMaterial', 'ame.lightbox'])
        .controller("MainController", MainController)
        .run(function($rootScope){
            $rootScope.dir = "ltr";
        });

    function MainController(ameLightbox, $rootScope){
        var self = this;

        self.showDemo = showDemo;
        self.changeDir = changeDir;


        function changeDir(){
            $rootScope.dir = $rootScope.dir == "rtl" ? "ltr" : "rtl";
        }
        function showDemo(targetEvent){
            ameLightbox.show([
                    'https://cdn.myket.ir/images/xlarge/image/myket/screenshot/com.google.android.street_4.png',
                    'https://cdn.myket.ir/images/xlarge/image/myket/screenshot/com.thisgameiscreatedalonebyme.Unpaid_Thief_6_62309618-0dc4-4c59-9680-23b11740c663.png',
                    'https://s.cafebazaar.ir/1/upload/screenshot/com.glimgames.motori24.jpg',
                    'https://cdn.myket.ir/images/xlarge/image/myket/screenshot/com.sevensen.royesh_cdbe9f13-ed44-4f7e-a2e8-76308f901ff7.png'
                ], {
                targetEvent: targetEvent,
                initialIndex: 1,
                buttonClass: "md-raised"
            })
        }
    }
})(angular);