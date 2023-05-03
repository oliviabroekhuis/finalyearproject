//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: MULTIUSER FUNCTIONALITY 

//NODE HELPER TO FACILITATE REQUIREMENT: multi-user FUNCTIONALITY 
"use strict";

//pull in the node helper library
var NodeHelper = require("node_helper");
//pull in the MYSQL library
var mysql = require("mysql");
this.connection = require(this.file['DBCONNNECT.js])';

module.exports = NodeHelper.create({
	getConnection: function(){
        var con = mysql.createConnection({
            host: 'magicmirror.czkgnpdbuu01-eu-west-2.rds.amazonaws.com',
            port: 3306,
            //HIDDEN FOR USAGE
            //~ user: '',
            //~ password: '',
            database: 'MM_Database'
        });
        //PREFERENCES QUERY
        con.connect(function(err) {
            if (err) throw err;
            con.query('SELECT Module_preferences.* FROM Users, Module_Preferences, Modules WHERE User.user_ID=Module_Preferences.user_ID and Module.Module_Preferences=Users.user_ID and name =' + this.name, function(err, result) {
                if (err) throw err;
                
            });
            con.result
            this.sendSocketNotification("PREFERENCES_RESULT", result);
        });
        //USER DATA QUERY
        con.connect(function(err) {
            if (err) throw err;
            con.query('SELECT Users.* FROM Users WHERE name =' + this.name, function(err, result) {
                if (err) throw err;
                calendar_link = result.calendar_link;
                gm_origin = result.gm_origin;
                gm_dest = result.gm_dest;
                train_to = result.train_to;
                train_from = result.train_from
                email = result.email;
                email = result.email_password;
                this.sendNotification("MAPS_RESULT", {
					gm_origin,gm_dest
				});
				this.sendNotification("GMAIL_RESULT", {
					email,emailpassword
				});
				this.sendNotification("TRAINS_RESULT", {
					train_to,train_from
				});
				this.sendNotification("CALENDAR_RESULT", calendar_link);
            });
        });
        
    }
    
    socketNotificationReceived: function(notification, payload) {
		//IF QUERY BEEN CALLED
        if (notification === "QUERY") {
			//IF THERES A PERSON LOGGED IN
			if (notification === "PERSONLOGIN") {
						getConnection();
			}
        }
    },
}
