/**
 * @auther Alireza Mirian (mirian@hasintech.com)
 * @since 1.0 (08/27/2016)
 */


(function(angular) {
    "use strict";

    angular.module("ame.lightbox")

        .factory("ameLightbox", ameLightboxFactory);

    var defaults = {
        initialIndex: 0,
        keyboard: true,
        targetEvent: undefined
    };

    function ameLightboxFactory($mdDialog) {
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