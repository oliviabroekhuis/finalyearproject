//MAIN MODULE SCRIPT TO FACILITATE REQUIREMENT: DATABASE FUNCTIONALITY 

"use strict";

//Labelled database, as displayed in a database function
Module.register("database",{
    
    notificationReceived: function(notification, payload){

        if(notification === 'PERSONLOGIN'){
            this.name = payload.name;
            console.log("Getting Data from Datbase");
            this.sendSocketNotification("QUERY", {name: payload.name});
        }
        
        
         if(notification === 'PREFERENCESRESULT'){
          getData(payload)
        }

    },
    
    
    getId: function(moduleName) {
        var id;
        MM.getModules().enumerate(function(module) {
            if (moduleName == module.name){
                id = module.identifier;
            }
        });
        return id;
    },

    getData: function(object) {
        var values = Object.values(object);
        for (var i = 0; i < values.length; i++) {
            var id = this.getid(modulenames[i]);
            MM.getModules().withClass(modulenames[i]).enumerate(function(module) {
                if (values[i].position) {
                    var split_position = values[i].position.split("_");
                    var selected_module = document.getElementById(id);
                    var region = document.querySelector('div.region.' + split_position[0] + '.' + split_position[1] + ' div.container');

                    // Make sure the region is visible
                    if (region.style.display === 'none') {
                        region.style.display = 'block';
                    }

                    // Move module
                    region.appendChild(selected_module);

                }

                // Set the module visible after moving to trigger css opacity transition animation
                if (values[i].visible == 'true') {
                    module.show(1000, function() {});
                }else if(values[i].visible == 'false'){
                    module.hide(1000, function() {});
                }
            });
        }
    },

});
