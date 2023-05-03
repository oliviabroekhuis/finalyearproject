
//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: FACIAL REOCGNITION FUNCTIONALITY 

"use strict";

//Labelled facial_recognition, as displayed in a face reco function
Module.register("facial_recognition", {
	defaults: {
		noFace: "noface",
		unauthenticated: "unauthenticated",
		authenticated: "authenticated",
	},

	session: {},
	users: [],
	userClasses: [],

	
	start: function () {
		var self = this;
        //Set up to start module and logging process
        this.sendSocketNotification("STARTED", this.config);
            Log.log("Starting module: " + this.name);
            this.config.debug && Log.log(this.config);

		//GET USER STATES
		this.config.noUser = [self.config.noFace];
		this.config.unauthenticated = [self.config.unauthenticated];
		this.config.authenticated = [self.config.authenticated];
	},
	
	//Get Custom CSS for image.gif module, with the getStyles function
	getStyles: function () {
        return [this.file('facial_recognition.css')];
    },
	
	getUser: function (name) {
		var self = this;
		var thisnewUsers;
		var thisExistingUsers;
		

		Log.log("Logged in user:" + name);
		this.users.push(name);

		if (this.users.length === 1) {
			thisExistingUsers = this.config.noFace;
		} else if (this.users.length > 1) {
			thisExistingUsers = this.config.authenticated;
		}


		if (name === "unknown") {
			thisUserClasses = this.config.unauthenticated;
		} else {
			var newUser = this.config.authenticated;
			newUser.push(name);
			thisnewUsers = newUser;
		}
		var newClassList;
		this.userClasses[name] = thisnewUsers;

		newClassList = this.config.authenticated;

		this.sendNotification("PERSONCLASSES",newClassList);
		
		//SEND NOTIFCATION TO ALERT NOW USER HAS LOGGED IN
		this.sendNotification("SHOW_ALERT", {
			type: "notification",
			title: "Welcome back, " + name
		});
		this.sendNotification("PERSONLOGIN", {
			this.userClasses[name]
		});
	},

	noUser: function (name) {
		var self = this;

		if (this.users.includes(name)) {
			this.users = this.users.filter(function (u) {
				return u !== name;
			});

			var oldUserClasses = Object.assign({}, this.userClasses); 

			delete this.userClasses[name];

			if (this.users.length === 0) {
				if (name === "unknown") {
					this.hide(this.config.noFace);
				} else {
					this.hide(this.config.noFace);
				}
			} else {
				this.sendNotification("PERSONLOGIN", {
					this.userClasses[name]
				});
			}
		}
	},

	
	 // Override dom generator.
	getDom: function() {
	  var element = document.createElement("div");
	  element.className = "face-image";
	  element.innerHTML = "Searching For User ...";
    
      var img = document.createElement("img");
      img.setAttribute('src', "modules/facial_recognition/faceID.gif");
      element.appendChild(img);

	 
	  return element;
	},
	
	hide: function(noFace){
		MM.getModules()
				.exceptWithClass(noFace)
				.enumerate(function (module) {
					module.hide(0,
						function () {
						},
						{
							lockString: self.identifier
						}
					);
				});
	},
	
	
	socketNotificationReceived: function (notification, payload) {
		var self = this;
		var user;

		if (payload.action === "login") {
			var usersIn = 0;
			for (user of payload.users) {
				if (user != null) {
					if (!this.users.includes(user)) {
						this.login_user(user);
						usersIn++;
					} 
					if (this.session[user] != null) {
						clearTimeout(this.session[user]);
					}
				}
			}
			if (usersIn > 0) {
				this.sendNotification("PERSONLOGIN", payload.users);
			}
		} else if (payload.action === "logout") {
			var usersOut = 0;
			for (usersOut of payload.users) {
				if (user != null) {
					if (this.users.includes(user)) {
						this.session[usersOut] = setTimeout(function () 
							self.sendNotification("USERS_LOGOUT_MODULES", user);
							self.noUser(user);
							usersOut++;
						}, 15000);
					} 
				}
			}

			if (usersOut > 0) {
				this.sendNotification("USERS_LOGOUT", payload.users);
			}
		}
	},
	//If notfications across modules received.
	notificationReceived: function (notification, payload) {
		var self = this;

		// Event if DOM is created
		if (notification === "DOM_OBJECTS_CREATED") {
			//HIDE MODULES
			this.hide_modules(0, this.config.noUser);
		}

		//SEND NOTIFICATION TO MODULES
		if (notification === "USER_REQUEST") {
			this.sendNotification("PERSONLOGIN", this.name);
		}
	},
	
	//If notfications within module received.
    socketNotificationReceived: function(notification, payload) {

    }
	
});
