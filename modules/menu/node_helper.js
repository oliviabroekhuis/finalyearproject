//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: TOUCH SCREEN FUNCTIONALITY 

"use strict";

//pull in the node helper library
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  //Node helper start
  start: function () {
    this.running = false;
    console.log("Menu Node helper started...");
  },
  
  socketNotificationReceived: function (notification, payload) {
    //If started then confirm communication has started
    if (notification === 'STARTED') {
      if (!this.running) {
        this.running = true;
        Log.log("Reached menu nodehelper");
      }
    }
    //Notification to shut down device has been recieved on click
    if (notification === "SHUTDOWN") {
      console.log("Shuting down the raspberry pi device")
      //Send command line process to shut down the whole device
      require('child_process').exec('shutdown -h now', console.log)
    }
  
    //~ //Rerun Raspberry Pi command npm start
    //~ //Notification to refresh the GUI page has been recieved on click
    if (notification === "REFRESH") {
      this.sendNotification('REFRESH');
    }
    
  },
});
