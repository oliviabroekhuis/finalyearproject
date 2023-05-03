//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: GMAIL FUNCTIONALITY

"use strict";

//pull in the xml to javascript library
const xml2js = require("xml2js");
//pull in the node helper library
const NodeHelper = require("node_helper");
//pull in the request library
const request = require("request");

module.exports = NodeHelper.create({
  //Node helper start
  start: function () {
    this.running = false;
    console.log("Gmail Node helper started...");
  },
  
  //Retrieve email data 
  getEmailData: function () {
    var self = this;
    
    //Request sent to gmail with user data
    request({url:"https://mail.google.com/mail/feed/atom", auth:{user:this.address,pass:this.password}},
      function (error, response, body) {
        //If request is successful
        if (response.statusCode === 200) {
          //Parse the returned xml string into a javascript string so it is readable
          var jsonString = new xml2js.Parser();
          jsonString.parseString(body,function (err,response){
          //initalise array
          inbox = new Array;
          //Get response
          inbox = [response.feed.entry];
          //Only show max 15 emails
          inbox = inbox.slice(0, 15);
          //Send data back to module script
          this.sendSocketNotification("REQUEST_EMAIL_RESULTS", {data: inbox});
        } else {
          //Collect error
          Log.log(error);;
        }
      }
    );
  },

  //If notfications within module received.
  socketNotificationReceived: function (notification, payload) {
    //If started then confirm communication has started
    if (notification === 'STARTED') {
      if (!this.running) {
        this.running = true;
        Log.log("Reached menu nodehelper");
      }
    }
    
    //If module is requesting to get data 
    if (notification === "GET_MAIL_REQUEST") {
      this.getEmailData(config);
    }
    
  },
  
  //If notfications across module received.
  notificationReceived: function (notification, payload) {
    //If user data has been sent globally 
    if (notification === "USER_EMAIL") {
      this.address = payload.emailAddress;
      this.password = payload.emailPassword;
    }
    
  }
  
    
});
