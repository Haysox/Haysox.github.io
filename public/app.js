// JavaScript File
var Firebase = require("firebase")
var myFirebaseRef = new Firebase("https://boiling-fire-6468.firebaseio.com/");
// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}
// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://boiling-fire-6468.firebaseio.com");
ref.onAuth(authDataCallback);

var ref = new Firebase("https://boiling-fire-6468.firebaseio.com");
var authData = ref.getAuth();
if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
}
// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

ref.authWithPassword({
  email    : 'bobtony@firebase.com',
  password : 'correcthorsebatterystaple'
}, authHandler);

ref.unauth();
// we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean
var isNewUser = true;
var ref = new Firebase("https://boiling-fire-6468.firebaseio.com");
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
  }
});
// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}

var ref = new Firebase("https://boiling-fire-6468.firebaseio.com");
// prefer pop-ups, so we don't navigate away from the page
ref.authWithOAuthPopup("google", function(error, authData) {
  if (error) {
    if (error.code === "TRANSPORT_UNAVAILABLE") {
      // fall-back to browser redirects, and pick up the session
      // automatically when we come back to the origin page
      ref.authWithOAuthRedirect("google", function(error) { /* ... */ });
    }
  } else if (authData) {
    // user authenticated with Firebase
  }
});

var ref = new Firebase("https://boiling-fire-6468.firebaseio.com");
ref.authWithPassword({
  email    : "bobtony@firebase.com",
  password : "invalid-password"
}, function(error, authData) {
  if (error) {
    switch (error.code) {
      case "INVALID_EMAIL":
        console.log("The specified user account email is invalid.");
        break;
      case "INVALID_PASSWORD":
        console.log("The specified user account password is incorrect.");
        break;
      case "INVALID_USER":
        console.log("The specified user account does not exist.");
        break;
      default:
        console.log("Error logging user in:", error);
    }
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});

var presenceRef = new Firebase('https://boiling-fire-6468.firebaseio.com/disconnectmessage');
// Write a string when this client loses connection
presenceRef.onDisconnect().set("I disconnected!");

var connectedRef = new Firebase("https://boiling-fire-6468.firebaseio.com/.info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    alert("connected");
  } else {
    alert("not connected");
  }
});
// since I can connect from multiple devices or browser tabs, we store each connection instance separately
// any time that connectionsRef's value is null (i.e. has no children) I am offline
var myConnectionsRef = new Firebase('https://boiling-fire-6468.firebaseio.com/users/joe/connections');
// stores the timestamp of my last disconnect (the last time I was seen online)
var lastOnlineRef = new Firebase('https://boiling-fire-6468.firebaseio.com/users/joe/lastOnline');
var connectedRef = new Firebase('https://boiling-fire-6468.firebaseio.com/.info/connected');
connectedRef.on('value', function(snap) {
  if (snap.val() === true) {
    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    // add this device to my connections list
    // this value could contain info about the device or a timestamp too
    var con = myConnectionsRef.push(true);
    // when I disconnect, remove this device
    con.onDisconnect().remove();
    // when I disconnect, update the last time I was seen online
    lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
  }
});