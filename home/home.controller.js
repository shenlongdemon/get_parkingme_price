(function () {
    'use strict';
    angular
            .module('app')
            .controller('HomeController', HomeController);
    HomeController.$inject = ['$rootScope', '$scope', '$http'];
    function HomeController($rootScope, $scope, $http) {      
        $rootScope.title = "shenlong-webutl";        
        $scope.map = {};
        $scope.parkingMarkers = [];
        $scope.loadParkingInBoudingMap = loadParkingInBoudingMap;
        $scope.getParkingInBoundingMap = getParkingInBoundingMap;
        $scope.processData = processData;
        $scope.initMap = initMap;
        $scope.clearCurrentParkingMarkers = clearCurrentParkingMarkers;
        initController();
        function initController() {
           
        }
        function initMap(map){
            $scope.map = map;
            $scope.map.setCenter(new google.maps.LatLng(47.613701, -122.350535));
            
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
            clearCurrentParkingMarkers();
            $.each(data.result, function(i, e){

                var prices = '';
                $.each(e.rateCard, function(cri, cre){
                    prices += '<p>'+cre+'</p>'
                });
               

                var contentString = 
                    '<div id="content">'+
                        '<div id="siteNotice">'+'</div>'+
                        '<h1 id="firstHeading" class="firstHeading">Price</h1>'+
                        '<div id="bodyContent">'+ 
                            prices + 
                        '</div>'+
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });  

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(e.point.coordinates[1],e.point.coordinates[0]),
                    map: $scope.map,
                    title: e.name + " - " + e.operator
                  });
                  marker.addListener('click', function() {
                    infowindow.open($scope.map, marker);
                  });
                  $scope.parkingMarkers.push(marker);
            });
        }
        function clearCurrentParkingMarkers(){
            $.each($scope.parkingMarkers, function(i, e){
                e.setMap(null);                
            });
            $scope.parkingMarkers = [];
        }
    }

})();