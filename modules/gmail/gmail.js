//DEVELOPED FOR PROJECT
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: DISPLAY EMAILS, AND NOTFICATIONS

"use strict";

//Labelled gmail, as displayed in a gmail function
Module.register("gmail", {
	//Predefine these variables
	intialInboxCount: 0,
	address = null,
	password = null,
	inboxLoad: null,
	
	start: function(){
		//Set up to start module and logging process
		this.sendSocketNotification("STARTED", this.config);
		Log.log("Starting module: " + this.name);
		this.config.debug && Log.log(this.config);
		
		// Request node_helper to get json from url
		this.sendSocketNotification("GET_MAIL_REQUEST", this.config);
		//Start automatic refresh intervals
		this.refreshInbox();
	},


	//Load in the css files, for mail table and icons
	getStyles: function() {
        return ["gmail.css", "font-awesome.css"];
    },
    
    //Load in the moment.js script
	getScripts: function () {
		return ["moment.js"];
	},
	
	//Displays titles and sends notifications
	getHeader: function () {
		//Sends a new notfication if a new email has entered the inbox
		if (this.inboxLoad.fullcount > this.intialInboxCount) {
			this.sendNotification('SHOW_ALERT', {
			type: 'notification',
			title: 'New Email!'
			});
		}
		//Set new inbox count 
		this.intialInboxCount = this.inboxLoad.fullcount;
		return this.address +" Gmail Inbox";
	},
	
	
	//Get display for GUI.
	getDom: function () {
		const container = this.createContainerDiv();
		
		table = this.makeTable();
		
		container.appendChild(table);
		return container;
	 },
	 
	//Create table container
	createContainerDiv: function () {
		const containerDiv = document.createElement("div");
		containerDiv.className = "divTable";

		return containerDiv;
	},
	 
	 //Make the table by retrieveing cotent from the append row function
	 makeTable: function(){
		var table = document.createElement("table");
		table.classList.add("mail-displayed");
		//check if no emails at all if not then append cells to rowa
		if (this.inboxLoad.fullcount == 0) {
		  table.classList.add("empty-inbox");
		}else if(!this.inboxLoad.fullcount){
		  Log.log("Unable to retrieve data");
		} else {
		  //create new row
		  var row = document.createElement("tr");
		  table.append(row);
		  //retrieve items in dataset
		  var items = this.inboxLoad.entry;
		  items.forEach((item) => {
			var row = this.appendEmailToNewRow(item);
			table.appendChild(row);
		  );
		  //display table
		  return table;
		}
		
	},
	//appending email data into each row
	 appendEmailToNewRow: function (singleDataEntry) {
		//Create element for row in table
		var dataEntry = document.createElement("tr");
		
		//Create elements for the data in the rows, from, subject, date and time
		//Add class lists off css file
		var senderColumn = document.createElement("td");
		senderColumn.classList.add("from-column");
		var subjectColumn = document.createElement("td");
		subjectColumn.classList.add("subject-column");
		var dateColumn = document.createElement("td");
		dateColumn.classList.add("date-column");
		var timeColumn = document.createElement("td");
		timeColumn.classList.add("time-column");
		
		var sender = document.createTextNode(singleDataEntry.author.name.substring(0, 22));
		var sub = document.createTextNode(singleDataEntry.title.substring(0, 55));
		var emailDate = moment(jsonObject.issued);
		var formattedDate = document.createTextNode(issueDt.format("MMM DD - "));
		var formattedTime = document.createTextNode(issueDt.format("MMM DD - "));
		
		senderColumn.append(sender);
		subjectColumn.append(sub);
		dateColumn.append(formattedDate);
		timeColumn.append(formattedTime);

		dataEntry.append(senderColumn);
		dataEntry.append(subjectColumn);
		dataEntry.append(dateColumn);
		dataEntry.append(timeColumn);

		return dataEntry;
	},
	
	//Set interval to refresh the current inbox state every 2 minutes
	refreshInbox: function () {
		setInterval(function () {
			this.sendGetRequest();
		}, 20000);
	},
	
	//If notfications across modules received.
	notificationReceived: function (notification, payload) {
		if (notification === "GMAIL_RESULT") {
			this.origin = payload.train_from;
			this.dest = payload.train_to;
		}
	},
	
	//If notfications within module received.  
	socketNotificationReceived: function (notification, payload) {
		if (notification === "REQUEST_EMAIL_RESULTS") {
			if (!this.address) {
				this.inboxLoad = payload.data;
				this.updateDom(500);
			}
		}
	},

});
