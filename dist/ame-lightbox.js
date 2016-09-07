/*
 * ame-lightbox 0.0.8
 * Lightbox component on top of angular material
 * https://github.com/alirezamirian/angular-material-lightbox
*/



(function(angular){
    "use strict";

    angular.module("ame.lightbox", [
        'material.core',
        'material.components.dialog',
        'material.components.button',
        'material.components.radioButton',
        'material.components.progressCircular',
        'material.components.swipe',
        'material.components.icon'
    ])

})(angular);


(function(angular){

    angular.module("ame.lightbox")
        .directive('ameOnLoad', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('load', function() {
                        //call the function that was passed
                        scope.$apply(attrs.ameOnLoad);
                    });
                }
            };
        });
})(angular);



(function(angular) {
    "use strict";

    ameLightboxFactory.$inject = ["$mdDialog", "$timeout"];
    var defaults = {
        buttonClass: "",
        initialIndex: 0,
        keyboard: true,
        showDots: true,
        backdropOpacity: null, // $mdDialog default
        targetEvent: undefined
    };

    angular.module("ame.lightbox")
        .constant("ameLightboxDefaults", defaults)
        .factory("ameLightbox", ameLightboxFactory);

    function ameLightboxFactory($mdDialog, $timeout) {
        return {
            show: show
        };


        function show(items, options) {
            items   = items || [];
            options = angular.extend({}, defaults, options);

            $mdDialog.show({
                templateUrl: "ame/lightbox/dialog-lightbox.html",
                controller: "AmeLightboxController",
                controllerAs: "ctrl",
                targetEvent: options.targetEvent,
                clickOutsideToClose: true,
                onShowing: function(){
                    $timeout(function(){
                        if(angular.isNumber(options.backdropOpacity)){
                            document.getElementsByClassName("md-dialog-backdrop")[0].style.opacity = options.backdropOpacity;
                        }
                    });
                },
                locals: {
                    items: items.map(_normalizeItem),
                    options: options
                },
                bindToController: true
            })
        }

        function _normalizeItem(item) {
            return angular.isString(item) ? {src: item} : item
        }
    }

})(angular);



(function(angular) {
    "use strict";

    AmeLightboxController.$inject = ["items", "options", "$log", "$mdDialog", "$scope", "$document", "$timeout", "$mdMedia"];
    angular.module("ame.lightbox")

        .controller("AmeLightboxController", AmeLightboxController);

    function AmeLightboxController(items, options, $log, $mdDialog, $scope, $document, $timeout, $mdMedia) {
        var self = this;
        if (!items.length > 0) {
            $log.warn("mde.lightbox: ", "calling lightbox without any image!");
            $mdDialog.cancel();
            return;
        }
        self.loading      = true;
        self.options      = options;
        self.imageLoaded  = imageLoaded;
        self.currentIndex = Math.max(Math.min(options.initialIndex || 0, items.length - 1), 0);
        self.prev         = prev;
        self.next         = next;
        self.imageWidth   = null;
        self.imageHeight  = null;
        if (options.keyboard) {
            _listenToKeyboardEvents();
        }

        $scope.$on("$destroy", _cleanup);

        function next() {
            self.currentIndex = (self.currentIndex + 1) % items.length;

        }

        function prev() {
            var index         = self.currentIndex - 1;
            self.currentIndex = (index >= 0 ? index : index + items.length) % items.length;
        }

        $scope.$watch(function() {
            return self.currentIndex;
        }, function(currentIndex) {
            if (angular.isDefined(currentIndex)) {
                self.loading = true;
            }
        })

        function imageLoaded() {
            self.loading  = false;
            self.resizing = true;
            resize().then(function() {
                self.resizing = false;
            });
        }

        function resize() {
            var imgContainer   = document.getElementById("ame_lightbox_image");
            var img            = imgContainer.getElementsByTagName("img")[0];
            var containingArea = getContainingArea();

            var height = img.naturalHeight;
            var width  = img.naturalWidth;
            if (img.naturalWidth / containingArea.width > img.naturalHeight / containingArea.height) {
                // width may be bottleneck
                if (img.naturalWidth > containingArea.width) {
                    width = containingArea.width;
                }
                height = img.naturalHeight * (width / img.naturalWidth);
            }
            else {
                // height may be bottleneck

                if (img.naturalHeight > containingArea.height) {
                    height = containingArea.height;
                }
                width = img.naturalWidth * (height / img.naturalHeight);
            }
            imgContainer.style.height = height + "px";
            imgContainer.style.width  = width + "px";
            return $timeout(200);

        }

        function getContainingArea() {
            var body = document.documentElement || document.body;

            var factor       = .8,
                buttonSize   = $mdMedia("gt-xs") ? 80 : 0,
                dotsHeight   = 60;
            var windowWidth  = window.innerWidth || body.clientWidth;
            var windowHeight = window.innerHeight || body.clientHeight;
            var area         = {
                width: (windowWidth) * factor,
                height: (windowHeight) * factor
            };
            if (area.width > windowWidth - (2 * buttonSize)) {
                area.width = windowWidth - (2 * buttonSize);
            }
            if (area.height > windowHeight - (dotsHeight)) {
                area.height = windowHeight - (dotsHeight);
            }
            return area;
        }


        function _listenToKeyboardEvents() {
            $document.bind("keydown", _keypressHandler);
        }

        function _stopListeningToKeyboardEvents() {
            $document.unbind("keydown", _keypressHandler);
        }

        function _keypressHandler(event) {
            var fn = null;
            switch (event.keyCode) {
                case 37: //"ArrowLeft":
                case 40: //"ArrowDown":
                    fn = document.dir == "rtl" ? next : prev;
                    break;
                case 39: //"ArrowRight":
                case 38: //"ArrowUp":
                    fn = document.dir == "rtl" ? prev : next;
                    break;
            }
            if (fn) {
                event.stopPropagation();
                event.preventDefault();
                $scope.$apply(fn);
            }
        }

        function _cleanup() {
            _stopListeningToKeyboardEvents();
        }
    }

})(angular);
(function(module) {
try {
  module = angular.module('ame.lightbox');
} catch (e) {
  module = angular.module('ame.lightbox', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('ame/lightbox/dialog-lightbox.html',
    '<md-dialog class="ame-lightbox" aria-label="Images" ng-class="{\'_loading\': ctrl.loading}">\n' +
    '    <md-dialog-content>\n' +
    '        <md-progress-circular ng-if="ctrl.loading"></md-progress-circular>\n' +
    '        <div id="ame_lightbox_image" md-swipe-left="ctrl.prev()" md-swipe-right="ctrl.next()">\n' +
    '            <img ame-on-load="ctrl.imageLoaded()"\n' +
    '                 ng-show="!ctrl.loading && !ctrl.resizing" ng-src="{{ctrl.items[ctrl.currentIndex].src}}"/>\n' +
    '        </div>\n' +
    '        <div layout="row" class="_dots" ng-show="ctrl.options.showDots">\n' +
    '            <md-radio-group ng-model="ctrl.currentIndex">\n' +
    '                <md-radio-button ng-repeat="item in ctrl.items" ng-value=":: $index"\n' +
    '                                 aria-label="Image {{:: $index}}"></md-radio-button>\n' +
    '            </md-radio-group>\n' +
    '        </div>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <md-button ng-class="ctrl.options.buttonClass" aria-label="Next" hide-xs\n' +
    '               class="md-icon-button _next" ng-click="ctrl.next()">\n' +
    '        <md-icon md-svg-icon="ame/lightbox/icons/ic_chevron_left_black_24px.svg"/>\n' +
    '    </md-button>\n' +
    '    <md-button ng-class="ctrl.options.buttonClass" aria-label="Prev" hide-xs\n' +
    '               class="md-icon-button _prev" ng-click="ctrl.prev()">\n' +
    '        <md-icon md-svg-icon="ame/lightbox/icons/ic_chevron_left_black_24px.svg"/>\n' +
    '    </md-button>\n' +
    '</md-dialog>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('ame.lightbox');
} catch (e) {
  module = angular.module('ame.lightbox', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('ame/lightbox/icons/ic_chevron_left_black_24px.svg',
    '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>\n' +
    '    <path d="M0 0h24v24H0z" fill="none"/>\n' +
    '</svg>');
}]);
})();
