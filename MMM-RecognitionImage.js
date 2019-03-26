Module.register('MMM-RecognitionImage', {

	defaults: {
		// Threshold for the confidence of a recognized image
		confidence_threshold: 5,
		// USB camera = true, Pi camera = false
		useUSBCam: false,
		// Array with usernames (copy and paste from training script)
		users: [],
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
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
