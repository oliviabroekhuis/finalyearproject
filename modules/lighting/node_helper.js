//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: TOUCH SCREEN FUNCTIONALITY 

"use strict";

//pull in the node helper and request library
const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
  //Node helper start
  start: function () {
    this.running = false;
    console.log("Lighting Node helper started...");
  },
  //PUT request method to change device state values
  controlLED: function (name, value) {
    var options = {
		url: "https://developer-api.govee.com/v1/devices/control",
		method: "PUT",
		json: { 
			"device": '2C:D3:A4:C1:38:6E:B8:17',		    
			"model": 'H6141',
			"cmd": {
				"name": name,
				"value": value
			}
		},
	};
	//Set headers as defaults 
	let req = request.defaults({
		headers:{
			'Govee-API-Key': 'da3bda90-0af8-4f1a-a790-9261824eb506', 
			'Content-Type': 'application/json',
		}
	
	});
	//Display response code accordingly
	req(options, function(error, response, body){
		console.log(body);	
	});
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, value) {
    //If started then confirm communication has started
    if (notification === 'STARTED') {
      if (!this.running) {
        this.running = true;
        Log.log("Reached menu nodehelper");
      }
    }
    //If on button clicked then turn device on
    if (notification === 'ON_BUTTON') {
      const name = "turn";
      this.controlLED(name, value)
    }
    //If off button clicked then turn device off
    if (notification === "OFF_BUTTON") {
      const name = "turn";
      this.controlLED(name, value);
    }
    //If on brightness slider changed then adjust brightness
    if (notification === "ADJUST_BRIGHTNESS") {
	const name = "brightness";
      this.controlLED(name, value);
    }

  },
});
