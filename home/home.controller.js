(function () {
    'use strict';
    angular
            .module('app')
            .controller('HomeController', HomeController);
    HomeController.$inject = ['$rootScope', '$scope', '$http'];
    function HomeController($rootScope, $scope, $http) {      
        $rootScope.title = "shenlong-webutl";
        $scope.initMap = initMap;
        $scope.map = {};
        $scope.loadParkingInBoudingMap = loadParkingInBoudingMap;
        $scope.getParkingInBoundingMap = getParkingInBoundingMap;
        $scope.processData = processData;
        initController();
        function initController() {
           
        }
        function initMap(map){
            $scope.map = map;
            google.maps.event.addListener($scope.map, 'idle', function(){
                loadParkingInBoudingMap();                          
            });
        }
        function loadParkingInBoudingMap(){
           var zoom = $scope.map.getZoom();
           if (zoom >= 18){
               var parkings = getParkingInBoundingMap();
           }
        }
        function getParkingInBoundingMap(){
            var bounds = $scope.map.getBounds();
            var sw = bounds.getSouthWest();	
            var ne = bounds.getNorthEast();	
            var locStr = ne.lat() + "|" + ne.lng() + "|" + sw.lat() + "|" + sw.lng();
            var chk = PimConfig.getCHK(locStr);
            let url = "https://api.parkme.com/lots?pub_id=x09e4f%24&chk="+chk+"&limit=250&offset=0&rate_request=&paddedViewBounds=2.5&box="+ locStr + "&entry_time=2018-01-11T09%3A00&duration=60&locale=&callback=processData&_1515636906918=";
            $http.get(url).success(function (res) {
				eval(res);				
			})
            .error(function () {
            });
        }
        function processData(data){
            
        }
    }

})();