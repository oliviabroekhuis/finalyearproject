//DEVELOPED FOR PROJECT
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: REAL TIME TRAIN UPDATES FUNCTIONALITY 

"use strict";

//Labelled trains, as displayed in a trains function
Module.register("trains", {
    start: function () {
        //Set up to start module and logging process
        this.sendSocketNotification("STARTED", this.config);
            Log.log("Starting module: " + this.name);
            this.config.debug && Log.log(this.config);
            
        //Define request Url with app id and api key
        this.request = 'https://transportapi.com/v3/uk/train/station/' + this.origin + '/live.json?app_id=20acedc4&app_key=e3d14641f6da75ccecf6a0d18205c4f3&calling_at=' + this.dest;
        //updates every 4 minutes
        setInterval(() => {this.sendSocketNotification("REAL_TIME_REQUEST", {'url': this.request});, 240000);
    },
      
    //Get Custom CSS for touchscreen module, with the getStyles function
    //Load in font-awesome.css for icons to be used  
    getStyles: function() {
        return ["trains.css", "font-awesome.css"];
    },

    //Load in the moment.js script
    getScripts: function() {
        return ["moment.js"];
    },

    //Define header for module.
    getHeader: function() {
        return this.data.header;
    },
 
    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        table = getData();
        return table;
        return wrapper;
    },
    
    getData: function(data){
        var table = document.createElement("table");

        //CHECK DEPARTURE DATA IS PRESENT
        if (!this.data.departures) {
            //ERROR MESSAGE
            Log.error("Unable to get real-time data");
        } else {
            if (this.allTimes.data.length == 3) {
                for (var i = 0; i < 3; i++) {
                    var row = document.createElement("tr");

                    //GET ALL DATA RETURNED FROM API REQUEST
                    var trainData = data.departures.all[i];
                    var platform_= trainData.platform[i];
                    var dest_= trainData.destination_name[i];
                    var originalTime_ = trainData.aimed_departure_time[i];
                    var expectedTime_= trainData.expected_departure_time[i];
                    var state_= trainData.status[i];
                        

                    //ORDER THE COLUMNS
                    var plat = document.createElement("td");
                    var dest = document.createElement("td");
                    var ogTime = document.createElement("td");
                    var newTime = document.createElement("td");
                    var currentState = document.createElement("td");

                    //GET CLASS NAMES
                    platform.className = "num-platform";
                    dest.className = "departure";
                    ogTime.className = "departure";
                    newTime.className = "time";
                    switch(state_) == "On Time") {
                        case "On Time":
                            currentState.className = "status-code ontime";
                        case "Early":
                            currentState.className = "status-code early";
                        case "Cancelled":
                            currentState.className = "status-code cancelled";
                        default:
                            currentState.className = "status-code";
                    }
                    
                    //GET VALUES
                    dest.innerHTML = "Calling at: " + dest_;
                    platform.innerHTML = platform_;
                    ogTime.innerHTML = originalTime_;
                    currentState.innerHTML = state_;
                    if(expectedTime_!= null) { 
                        newTime.innerHTML = "(" + expectedTime_ + ")";
                    } else {
                        newTime.innerHTML = " ";
                    }
                    
                    
                    //APPEND ROWS
                    row.appendChild(platform);
                    row.appendChild(dest);
                    row.appendChild(ogTime);
                    row.appendChild(newTime);
                    row.appendChild(currentState);
                    //ADD TO TABLE
                    table.appendChild(row);

                }
                
       
        } else {
            //ERROR MESSAGE IF NOT
            Log.log("No data found");
        }
        
    },
    

    //If notfications across modules received.
	notificationReceived: function (notification, payload) {
		if (notification === "MAPS_RESULT") {
			this.origin = payload.train_from;
			this.dest = payload.train_to;
		}
	},
	
	//If notfications within module received.
    socketNotificationReceived: function(notification, payload) {

        if (notification === 'REAL_TIME') {
            this.processTrains(payload.data);
        }
    }

});
