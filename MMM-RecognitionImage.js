Module.register('MMM-RecognitionImage', {

	defaults: {
		// Threshold for the confidence of a recognized face before it's considered a
		// positive match.  Confidence values below this threshold will be considered
		// a positive match because the lower the confidence value, or distance, the
		// more confident the algorithm is that the face was correctly detected.
		threshold: 50,
		// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
		useUSBCam: false,
		// Path to your training xml
		trainingFile: 'modules/MMM-Facial-Recognition-OCV3/training.xml',
		// recognition intervall in seconds (smaller number = faster but CPU intens!)
		interval: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		logoutDelay: 15,
		// Array with usernames (copy and paste from training script)
		users: [],
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true
	},

	login_user: function () {
		var self = this;

		MM.getModules().withClass(this.current_user).enumerate(function (module) {
			module.show(1000, function () {
				Log.log(module.name + ' is shown.');
			}, { lockString: self.identifier });
		});

		this.sendNotification("CURRENT_USER", this.current_user);
	},
	logout_user: function () {

		var self = this;

		MM.getModules().withClass(this.current_user).enumerate(function (module) {
			module.hide(1000, function () {
				Log.log(module.name + ' is hidden.');
			}, { lockString: self.identifier });
		});


		this.sendNotification("CURRENT_USER", "None");
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if(payload.action == "login") {
			this.current_user = payload.user;
			this.login_user();
		}
		else if (payload.action == "logout") {
			this.logout_user();
			this.current_user = null;
		}
	},

	notificationReceived: function (notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			var self = this;
			MM.getModules().exceptWithClass("default").enumerate(function (module) {
				module.hide(1000, function () {
					Log.log('Module is hidden.');
				}, { lockString: self.identifier });
			});
		}
	},

	start: function () {
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}

});
