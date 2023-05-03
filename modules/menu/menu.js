//DEVELOPED FOR PROJECT
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: TOUCH SCREEN FUNCTIONALITY 

"use strict";

//Labelled menu, as displayed in a menu function
Module.register("menu", {

  start: function () {
    //Set up to start module and logging process
    this.sendSocketNotification("STARTED", this.config);
		Log.log("Starting module: " + this.name);
		this.config.debug && Log.log(this.config);
  },
  
  //Get Custom CSS for touchscreen module, with the getStyles function
  //Load in font-awesome.css for icons to be used  
  getStyles: function () {
    return [this.file("menu.css"), "font-awesome.css"];
  },
  
  //Create a container to store buttons in a list
  createContainerDiv: function () {
    const containerDiv = document.createElement("div");
    containerDiv.className = "menu-container";

    return containerDiv;
  },
  
  //HIDE BUTTON---------------------------------------------------------
  //If user presses button to hide modules  
  showHideButton: function () {
    const hideButton = document.createElement("div");
    hideButton.innerHTML = "<span class='fa fa-eye-slash fa-2x'></span>";
    hideButton.className = "menu-container__hide-button"

    //When clicked the pressHide function runs 
    hideButton.addEventListener("click",
        () => this.pressHide());

    return hideButton
  },
  
  //Hide the modules through checking css class name of the button
  pressHide: function () {
    const existingBodyClass = document.body.className;
    if (existingBodyClass === "menu-hide show") {
      document.body.className = "menu-hide fade";
    } else {
      document.body.className = "menu-hide show";
    }
  },
  //--------------------------------------------------------------------
  
  //SHUTDOWN BUTTON-----------------------------------------------------
  showShutdownButton: function () {
    const shutdownButton = document.createElement("div");
    shutdownButton.innerHTML = "<span class='fa fa-power-off fa-2x'></span>";
    shutdownButton.className = "menu-container__shutdown-button"

    // Send shutdown notification when clicked
    shutdownButton.addEventListener("click",
        () => this.sendSocketNotification("SHUTDOWN", {}));

    return shutdownButton
  },
  //--------------------------------------------------------------------
  
  //REFRESH PAGE BUTTON-----------------------------------------------------
  showRefreshButton: function () {
    const refreshButton = document.createElement("div");
    refreshButton.innerHTML = "<span class='fa fa-repeat fa-2x'></span>";
    refreshButton.className = "menu-container__refresh-button";

    //When clicked send a notfication to the node helper to refresh the page
    refreshButton.addEventListener("click",
        () => this.sendNotification('QUERY', {}));

    return refreshButton
  },
  //--------------------------------------------------------------------

  //Function for what is shown in GUI
  getDom: function () {
    
    document.body.className = "menu-hide show";

    const container = this.createContainerDiv();
    //Append buttons to container

    const hideButton = this.showHideButton();
    container.appendChild(hideButton);
    
    const refreshButton = this.showRefreshButton();
    container.appendChild(refreshButton);

    const shutdownButton = this.showShutdownButton();
    container.appendChild(shutdownButton);

    return container;
  },
  
  //This JS file recieves no notfications
  notificationReceived: function (notification, payload, sender) {
  },

  socketNotificationReceived: function (notification, payload) {
  },

});
