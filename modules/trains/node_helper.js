//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: REAL-TIME TRAIN UPDATES FUNCTIONALITY 

"use strict";

//pull in the node helper library
const NodeHelper = require('node_helper');
//pull in the requests library
const request = require('request');
module.exports = NodeHelper.create({
  //Node helper start
  start: function () {
    this.running = false;
    console.log("Trains Node helper started...");
  },
  
  getRealTimeTrains: function(request) {
      //GET request sent to transport API with user data embedded
      request({url:request, method: 'GET'}, 
        function(error, response, body) {
          //If request is successful
          if(response.statusCode == 200) {
            //Get response
            trains = JSON.parse(body);
            //Only show max 3 results
            trainData = trains.slice(0, 3);
            this.sendSocketNotification('REAL_TIME', {'data': trainData, 'url': request});
          } else {
            //Collect error
            Log.log(error);
          }
        }
      );
  	},

   //If notfications within module received.
  socketNotificationReceived: function(notification, payload) {
    //If started then confirm communication has started
    if (notification === 'STARTED') {
      if (!this.running) {
        this.running = true;
        Log.log("Reached menu nodehelper");
      }
    }
    //If request then fetch real time train updates
    if (notification === 'REAL_TIME_REQUEST'){
      this.getRealTimeTrains(payload.request);
    }
  }

});
