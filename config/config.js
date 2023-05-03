let config = {
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: true, 		// Support HTTPS or not, default "false" will use HTTP
	httpsCertificate: "/home/onb/magicmirror.key", 	// HTTPS Certificate path, only require when useHttps is true
	httpsPrivateKey: "/home/onb/magicmirror.csr", 	// HTTPS private key path, only require when useHttps is true
	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "database",
			classes: "noFace",
		},
		{
			module: "alert",
			classes: "noFace",
		},
		{
			module: "updatenotification",
			position: "top_bar",
			classes: "noFace",
		},
		{
			module: "clock",
			position: "top_left",
			classes: "noFace",
		},
		{
			module: "lighting",
			position: "top_left",
			classes: "noFace",
		},
		{
			module: "calendar",
			header: "Today's Meetings",
			position: "top_left",
			classes: "authenticated",
			config: {
			
			}
		},
		
		{
			module: "gmail",
			header: "Today's Meetings",
			classes: "authenticated",
			position: "bottom_left",
			
		},
		
		{
			module: "trains",
			position: "bottom_right",
			classes: "authenticated",
		},
		
		{
			module: "facial_recognition",
			position: "top_right",
			classes: "noFace",
		},
		
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "Leeds",
				locationID: "2644688", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "255a499d365bc6f74cf0ef965f1e19d4"
			}
		},
		
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},
		{
		  module: 'menu', 
		  position: 'bottom_center', 
		  config:{ 
			
		  }
		},
	]
};


/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
