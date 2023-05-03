//DEVELOPED FOR PROJECT
//NODE HELPER TO FACILITATE REQUIREMENT: FACE RECO 

'use strict';
//pull in the node helper library
const NodeHelper = require('node_helper');
//pull in the python shell library
const { PythonShell } = require('python-shell');
//pull in the signal exit library
const onExit = require('signal-exit');
var pythonStarted = false;

module.exports = NodeHelper.create({
  pyshell: null,
  //STARTS PYTHON
  runPython: function () {
    //NEW SHELL RUNNING CMD LINE PYTHON
    this.pyshell = new PythonShell(
      'modules/facial_recognition/main_fr.py',
      mode: 'json',
      args: ['--encodings=modules/facial_recognition/encodings.pickle'],);

   //SENDS NOTIFICATIONS TO DATABASE CONN MODULE BASED ON USER PRESENCE
    this.pyshell.on('message', function (message) {
      if (message.hasOwnProperty('ENTER')) {
        this.sendNotfication('PERSONLOGIN', {
          action: 'ENTER',
          users: message.login.name,
        });
      }

      if (message.hasOwnProperty('EXIT')) {
        this.sendNotfication('PERSONLOGOUT', {
          action: 'EXIT',
          users: message.login.name,
        });
      }
    });
  },
  //ENDS PYTHON
  endPython: function () {
    runPython = false;
    this.destroy();
  },
  
  //TERMINATE
  destroy: function () {
    this.pyshell.childProcess.kill();
  },

   //If notfications within module received.
  socketNotificationReceived: function(notification, payload) {
    //If started then confirm communication has started
    if (notification === 'STARTED') {
        runPython = true;
        this.runPython();
    }
    

});
