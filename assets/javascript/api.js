var config = {
  apiKey: "AIzaSyBmwNLyWcwDu5BzNxxM4VipvSPA4QNMDu8",
  authDomain: "price-tracker-4174d.firebaseapp.com",
  databaseURL: "https://price-tracker-4174d.firebaseio.com",
  projectId: "price-tracker-4174d",
  storageBucket: "price-tracker-4174d.appspot.com",
  messagingSenderId: "233147626473"
};

firebase.initializeApp(config);
var database = firebase.database();
$("#registerButton").on("click", function(e) {
  e.preventDefault();
  var inputEmail =  $('#newUserEmail').val();
  saveUser(inputEmail);
});

$("#loginButton").on("click", function(e) {
  e.preventDefault();
  var inputEmail =  $('#existingUserEmail').val();
  retrieveUser(inputEmail);
});

//Save the user to Firebase
function saveUser(userEmail) {
    var cleanEmail = userEmail.replace(/\./g, ',').toLowerCase();
    var newUser = {
      email: userEmail,
    };
    database.ref(cleanEmail).set(newUser);
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(newUser));
    window.location.href = './search-page.html';
}

//Retrieve the user from Firebase
function retrieveUser(userEmail) {
    var cleanEmail = userEmail.replace(/\./g, ',').toLowerCase();
    return firebase.database().ref(cleanEmail).once('value').then(function(user) {
      if(user.val()) {
        var existingUser = {
            email: user.val().email,
            subscriptions: user.val().subscriptions,
        };
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify(existingUser));
        window.location.href = './search-page.html';
      } else {
        alert("User Not Found");
      }
    });

}

//Subscribe the user to this Item in Firebase
function subscribeItem(userId, itemId) {

}

//Unsubscribe the user from this item in Firebase
function unsubscribeItem(userId, itemId) {

}

//Search the walmart api for this item and return a list of items
function findItems(keyword) {

}
