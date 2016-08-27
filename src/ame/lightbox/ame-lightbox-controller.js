/**
 * @auther Alireza Mirian (mirian@hasintech.com)
 * @since 1.0 (08/27/2016)
 */


(function(angular){
    "use strict";

    angular.module("ame.lightbox")

        .controller("AmeLightboxController", AmeLightboxController);

    function AmeLightboxController(items, options, $log, $mdDialog, $scope, $document, $timeout, $mdMedia){
        var self = this;
        if( ! items.length > 0){
            $log.warn("mde.lightbox: ", "calling lightbox without any image!");
            $mdDialog.cancel();
            return;
        }
        self.loading = true;
        self.options = options;
        self.imageLoaded = imageLoaded;
        self.currentIndex = Math.max(Math.min(options.initialIndex || 0,items.length-1), 0);
        self.prev = prev;
        self.next = next;
        self.imageWidth = null;
        self.imageHeight = null;
        if(options.keyboard){
            _listenToKeyboardEvents();
        }

        $scope.$on("$destroy", _cleanup);

        function next(){
            self.currentIndex = (self.currentIndex + 1) % items.length;

        }
        function prev(){
            var index = self.currentIndex - 1;
            self.currentIndex = (index >= 0 ? index : index+items.length) % items.length;
        }
        $scope.$watch(function(){
            return self.currentIndex;
        }, function(currentIndex){
            if(angular.isDefined(currentIndex)){
                self.loading = true;
            }
        })

        function imageLoaded(){
            self.loading = false;
            self.resizing = true;
            resize().then(function(){
                self.resizing = false;
            });
        }
        function resize()
        {
            var imgContainer    = document.getElementById("mde_lightbox_image");
            var img = imgContainer.getElementsByTagName("img")[0];
            var containingArea = getContainingArea();

            var height = img.naturalHeight;
            var width = img.naturalWidth;
            if( img.naturalWidth/containingArea.width > img.naturalHeight/containingArea.height ){
                // width may be bottleneck
                if(img.naturalWidth > containingArea.width){
                    width = containingArea.width;
                }
                height = img.naturalHeight * (width/img.naturalWidth);
            }
            else{
                // height may be bottleneck

                if(img.naturalHeight > containingArea.height){
                    height = containingArea.height;
                }
                width = img.naturalWidth * (height/img.naturalHeight);
            }
            imgContainer.style.height = height + "px";
            imgContainer.style.width = width + "px";
            return $timeout(200);

        }

        function getContainingArea()
        {
            var body = document.documentElement || document.body;

            var factor      = .8,
                buttonSize = $mdMedia("gt-xs") ? 80 : 0,
                dotsHeight = 60;
            var windowWidth = window.innerWidth  || body.clientWidth;
            var windowHeight      = window.innerHeight || body.clientHeight;
            var area = {
                width: (windowWidth) * factor,
                height: (windowHeight) * factor
            };
            if(area.width > windowWidth - (2 * buttonSize)){
                area.width = windowWidth - (2 * buttonSize);
            }
            if(area.height > windowHeight - (dotsHeight)){
                area.height = windowHeight - (dotsHeight);
            }
            return area;
        }


        function _listenToKeyboardEvents(){
            $document.bind("keydown", _keypressHandler);
        }
        function _stopListeningToKeyboardEvents(){
            $document.unbind("keydown", _keypressHandler);
        }
        function _keypressHandler(event){
            if(event){
                switch(event.code){
                    case "ArrowLeft":
                    case "ArrowDown":
                        $scope.$apply(prev);
                        break;
                    case "ArrowRight":
                    case "ArrowUp":
                        $scope.$apply(next);
                        break;
                }
            }
        }
        function _cleanup(){
            _stopListeningToKeyboardEvents();
        }
    }

})(angular);