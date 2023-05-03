//DEVELOPED FOR PROJECT
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: DISPLAY COMMUTE TIMING

"use strict";

//Labelled google_maps, as displayed in a google_maps function
Module.register('commute_timings', {
    defaults: {
        directionsRequest:{origin:this.origin, destination: this.dest},
    },
    
    start: function () {
        //Set up to start module and logging process
        this.sendSocketNotification("STARTED", this.config);
		Log.log("Starting module: " + this.name);
		this.config.debug && Log.log(this.config);
    },
    
    //Load in the maps_styles script
    getScripts: function() {
        return ['map_styles.js'];
    },
    
     //Get Custom CSS with getStyles function
    //Load in font-awesome.css for icons to be used  
    getStyles: function () {
		return ["font-awesome.css", "font-awesome5.css"];
	  },
    
    // Override dom generator.
    getDom: function () {
        var main = document.createElement("div");
        main.style.width = '300px';
        var self = this;
        //REQUEST MAPS
        var requestMap = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDatAkIXChCPIkW3_H4aFZ-2AgZQDkl20c&language=en&travelMode=" + travelMode;

        if(recievedScript(requestMap) == true){
            var mapStyles = document.createElement("script");
            mapStyles.src = mapsSrc;
            mapStyles.type = "text/javascript";
            document.body.appendChild(mapStyles);
        }else{
            if(!google && google.maps && google.maps.Map){
                Log.log("Maps could not be loaded ");
            }
        }
        
        //GET RESULTS TO DISPLAY
        container = createContainer();
        routeOptions = createRouteOptions();
        map = createMap();
        
        //APPEND TO THE CONTAINER 
        main.appendChild(map);
        main.appendChild(container);
        main.appendChild(routeOptions);
        return main;
    },
    
    //CREATE HTML ATTRIBUTES--------------------------------------------
    createContainer: function() {
        var container = document.createElement("div");
        container.style.width="100%";
        return container;
    },
    
    createRouteOptions: function() {
        var routeOptions = document.createElement("table");
        routeOptions.setAttribute("id", "info");
        return routeOptions;
    },
    
    createMap: function() {
        var map = document.createElement("div");
        map.setAttribute("id", "map");
        map.style.height = '300px';
        map.style.width="100%";
        map.style.display = "hidden";
        return map;
    },
    //------------------------------------------------------------------
    
    //GET USE OF MAP FUNCTION
    getMap: function() {
        var displayMap = new google.maps.Map(wrapper, {styles:google_maps_styles, zoomControl:true});
        var useDirections = new google.maps.DirectionsRenderer({
            suppressMarkers : true,
            polylineOptions:{
                strokeColor:'#fff',
                strokeWeight:7
            }
        });
        
        useDirections.setMap(displayMap);

        transport = ['DRIVING', 'BICYCLING', 'WALKING'];
        for (var i = 0; i < transport.length; i++) {
            travelMode = transport[i];
            getDirectionRequest(travelMode);
        }
    },
    
    //GET THE DIRECTIONS
    getDirectionRequest: function(travelMode){
        var self = this;
        try{
            //ASSIGN A NEW REQUEST BASED OFF USER CONFIGURED DATA
            var request = Object.assign({},this.config.directionsRequest);
            request.travelMode=travelMode;
            //OVERRIDE THE CONFIG DIRECTIONS IF CALENDAR CAN RECIEVE DATA
            if(self.state.getNewDest){
                request.destination = self.state.getNewDest;
            } else {
                request.destination = self.config.directionsRequest;
            }
            
            //DRIVIG PARAMETERS
            if(request.travelMode=="DRIVING" && !self.state.getNewDest){
                var request.drivingOptions.departureTime = new Date(Date.now()+60*1000);
            } else if(request.travelMode=="DRIVING" && self.state.getNewDest){
                var request.drivingOptions.departureTime = self.state.getNewTime;
                
            } 
            
            //NEW REQUEST
            var getDirections = new google.maps.DirectionsService;
            getDirections.route(request,
                function(response, status) {
                    if (status === 200) {
                        directions.setDirections(response);
                        directions.setRouteIndex(0);

                        getResultsTable(response,0, request.travelMode);
                        
                    } else {
                        Log.log("Unable to get directions");
                    }
                }
            );
        }catch(err){
            Log.log("Unable to get directions because" +err.message);
        }
    },
    
    //CHECK MAPS SCRIPT HAS BEEN RECIEVED
    recievedScript: function(requestMap){
        for(s of document.scripts){
            if(s.requestMap == requestMap){
                return true;
            } else {
                Log.log("Maps script has not been receieved"
            }
        }
        return false;
    },
    
    
    //CREATE ROUTE SUMMARY TABLE
    getResultsTable: function(response,travelMode){
        var table = infoTable;
        var traffic = response.routes[index].legs[0];
        var row = document.createElement("tr");
        row.classList.add('row');
        
        
        //GET ICONS FOR TRAVEL MODE-------------------------------------
        var icon = document.createElement("button");
        icon.style.fontSize = '23px';
        icon.className="transit-mode-icon";
        if(travelMode == "DRIVING"){
            icon.innerHTML = "<i class='fa fa-car' id='car'></i>";
            icon.classList.add('car');
            duration.classList.add('status-good');
        } else if(travelMode == "BICYCLING"){
            icon.innerHTML = "<i class='fa fa-bicycle' id='bike'></i>";
            icon.classList.add('bike');
        } else if(travelMode == "WALKING"){
            icon.innerHTML = "<i class='fa fa-walking' id='walk'></i>";
            icon.classList.add('walk');
        }
        
        icon.addEventListener("click", function(){
            
            if(icon.id = "car"){
                travelMode = 'DRIVING';
            } else if(icon.id = "bike"){
                travelMode = 'BICYCLING';
            } else if (icon.id = "walk"){
                travelMode = 'WALKING';
            }
            
        });
        //---------------------------------------------------------------
        
        //GET BEST ROUTE------------------------------------------------
        var bestRoute = document.createElement("span");
        bestRoute.style.fontSize = '18px';
        bestRoute.innerHTML = "via " + response.routes[index].summary;
        row.appendChild(bestRoute);
        //---------------------------------------------------------------

        //GET DISTANCE---------------------------------------------------
        var distance = document.createElement("span");
        distance.style.fontSize = '18px';
        distance.innerHTML = leg.distance.text;
        //---------------------------------------------------------------
        
        
        //GET TRAFFICTIME------------------------------------------------
        var trafficTime = document.createElement("span");
        trafficTime.style.fontSize = '28px';
        if(traffic.duration_in_traffic){
            trafficTime.innerHTML = traffic.duration_in_traffic.text;
        } else {
            trafficTime.innerHTML = traffic.duration.text;
        }
        row.appendChild(trafficTime);
        //--------------------------------------------------------------
        
        table.appendChild(row);
        return table;
    },

    //If notfications across modules received.
	notificationReceived: function (notification, payload) {
    
        //RECIEVE USER DETAILS FROM FACE RECO MOD
		if (notification === "MAPS_RESULT") {
			this.origin = payload.gm_origin;
			this.dest = payload.gm_dest;
		}
        
        //UNDEFINED IF NO CALENDAR EVENT
        var calDest = undefined;

        // HAS CALENDAR EVENTS BEEN RECIEVED
        if (notification === "CALENDAR_EVENTS") {
            //GET LOCATION
            var calendar = payload[0];
            //UPDATE LOCATION
            if(calendar.location){
                calDest = calendar.location;
                calTime = calendar.time;
                this.state.getNewTime = calDest;
                this.state.getNewTime = calTime;

                this.getDirectionRequest();
            }
        }
    },
    
    //If notfications within module received.
    socketNotificationReceived: function(notification, payload) {

    },

});
