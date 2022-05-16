importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

//fetch firebase config
fetch("./apps/config/firebase-config.json").then(function (res) {
	return res.json();
}).then(function (data) {
	initializeFirebase(data.firebaseConfig);

});

//initialize firebase
initializeFirebase = function (config) {
	// Initialize Firebase
	firebase.initializeApp(config);

	// Retrieve an instance of Firebase Messaging so that it can handle background messages.
	var messaging = firebase.messaging();

	//receive notification when user in different tab- Background handler
	messaging.onBackgroundMessage(function (payload) {
		//console.log('[firebase-messaging-sw.js] Received background message ', payload);
		// Customize notification here
		var notificationOptions = {
			body: payload.notification.body,
			icon: self.registration.scope + '/apps/dist/img/clinsight_resize2.png',
			data: payload.data
		};
		console.log('Background notification received. ', payload);
		self.registration.showNotification(payload.notification.title,
			notificationOptions);
	});
}
var app_path = "apps/dist/index.html";
var clinmode = "#?clin_mode=true"

//respond when notification is clicked
self.addEventListener('notificationclick', function (event) {
	
	var url_obj = (event.notification.data.FCM_MSG ? event.notification.data.FCM_MSG.data : event.notification.data) || {};
	console.log('created url object on click',url_obj);
	//create url pad end query sring
	var url_pad = Object.keys(url_obj).reduce(function (acc, key) {
		var value = url_obj[key];

		acc = acc + "&" + key + "=" + value

		return acc;
	}, "")
	console.log('Notification clicked data',event.notification.data);
	console.log('click url generated ',self.registration.scope + app_path + clinmode + url_pad);
	//open the url in different tab
	//clients.openWindow(event.notification.data.dashboard_url);
	clients.openWindow(self.registration.scope + app_path + clinmode + url_pad);


});

//qaui.glassbeam.com/apps/app/index.html#?clin_mode=true&serial_number=CT50059&rule_name=Rule_1605009445897&mps=gdi/gdi/podui&notificationId=1623404008583