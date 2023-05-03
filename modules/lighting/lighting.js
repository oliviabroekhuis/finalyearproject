//DEVELOPED FOR PROJECT
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: ADJUSTABLE LIGHTING

"use strict";

//Labelled lighting, as displayed in a lighting function
Module.register("lighting", {

	start: function () {
		//Set up to start module and logging process
		this.sendSocketNotification("STARTED", this.config);
		Log.log("Starting module: " + this.name);
		this.config.debug && Log.log(this.config);
	},
  
    //Get Custom CSS for touchscreen module, with the getStyles function
    //Load in font-awesome.css for icons to be used  
    getStyles: function () {
	  return [this.file("lighting.css"), "font-awesome.css"];
    },

    //Create a container to store buttons in a container
    createContainerDiv: function () {
	  const containerDiv = document.createElement("div");
	  containerDiv.className = "lighting-container";

	  return containerDiv;
    },
	  

	//Toggles between a yellow icon and a white icon to indicate on/off status
  toggleOnOff: function () {
	const existingBodyClass = document.getElementById('icondisplay');
	if (existingBodyClass.className === "lighting-button") {
	  existingBodyClass.className = "lighting-button off";
	  //send a notfication to perform the request of turning light off
	  var value = "off";
	  this.sendSocketNotification("OFF_BUTTON", value);
	} else if(existingBodyClass.className === "lighting-button off"){
	  existingBodyClass.className = "lighting-button";
	  //send a notfication to perform the request of turning light on
	  var value = "on";
	  this.sendSocketNotification("ON_BUTTON", value);
	}
  },
  
	//Create a lightbulb icon button to turn light on and off
	getOnOffButton: function () {
		//Checks to see if light is already on or off
		getState();
		const onOffButton = document.createElement("button");
		onOffButton.id = 'icondisplay';
		//Retrieves correct on off class name for display
		if(this.getOnOff == "on"){
			onOffButton.className = "lighting-button";
		} else if(this.getOnOff == "off"){
			onOffButton.className = "lighting-button off";
		}
		onOffButton.innerHTML = "<i class='fa fa-lightbulb fa-3x'></i>"
			+ "<br>";
		
		//Checks if button has been clicked and called toggleOnOff
		onOffButton.addEventListener("click",
        () => this.toggleOnOff());

		return onOffButton;
	},
	
	//Create a brightness slider to dynamically change brightness
	getBrightnessSlider: function () {
		//get current brightness value if device is on
		if(this.getOnOff == "on"){
			value = this.brightnessValue;
		} else if(this.getOnOff == "off"){
			value = 100;
		}
		const name = "brightness";
		const brightnessSlider = document.createElement("div");
		brightnessSlider.className = "brightness-box";

		brightnessSlider.innerHTML = "<i class='far fa-sun'></i> <input type='range' id='range' min='10' max='100' step='1' value=" + value + "><i class='fas fa-sun'></i>";
		//Checks if element has been changed and sends a request to adjust brightness 
        brightnessSlider.addEventListener("change",
        () => this.sendSocketNotification("ADJUST_BRIGHTNESS", value));
		
		return brightnessSlider;
	},
	
	//Sends a GET request to recieve a json response containing current light power status and brightness value 
	getState: function(){
		var options = {
			url: "https://developer-api.govee.com/v1/devices/state/?device=2C:D3:A4:C1:38:6E:B8:17&model=H6141",
			method: "GET",
			headers: { 
				'Govee-API-Key': 'da3bda90-0af8-4f1a-a790-9261824eb506', 
				'Content-Type': 'application/json',
			},
		};
		request(options, function(error, response, body){	
			this.brightnessValue = response.data.properties.brightness;
			this.getOnOff = response.data.properties.powerState;
		});

	  },

	//Function for what is shown in GUI
	getDom: function () {
		

		const container = this.createContainerDiv();
		//Append buttons to container
		const button = this.getOnOffButton();
		container.appendChild(button);
		const brightness = this.getBrightnessSlider();
		container.appendChild(brightness);


		return container;
	},
	//This JS file recieves no notfications
	socketNotificationReceived: function (notification, payload) {
		
	},

	notificationReceived: function (notification, payload, sender) {

	}
});
