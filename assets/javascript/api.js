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
  var user = {
    email: inputEmail,
    subscriptions: [],
  };
  saveUser(user);
});

$("#loginButton").on("click", function(e) {
  e.preventDefault();
  var inputEmail =  $('#existingUserEmail').val();
  retrieveUser(inputEmail);
});

//Save the user to Firebase
function saveUser(user) {
    var cleanEmail = user.email.replace(/\./g, ',').toLowerCase();
    database.ref(cleanEmail).set(user);
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = './search-page.html';
}

//Retrieve the user from Firebase
function retrieveUser(userEmail) {
    var cleanEmail = userEmail.replace(/\./g, ',').toLowerCase();
    return firebase.database().ref(cleanEmail).once('value').then(function(user) {
      if(user.val()) {
        var existingUser = {
            email: user.val().email,
            subscriptions: user.val().subscriptions || [],
        };
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify(existingUser));
        window.location.href = './search-page.html';
      } else {
        $("#error").show();
        $('#existingUserEmail').val('');
        $('#newUserEmail').val('');
      }
    });

}

//Subscribe the user to this Item in Firebase
function subscribeItem(item) {
    var user = JSON.parse(localStorage.getItem("user"));
    var itemStatus = $(item).attr('item-status');
    var itemId = $(item).attr('id');
    if(itemStatus === 'unsubscribed') {
      $(item).attr('item-status', 'subscribed');
      $(item).html('Remove Item');
      user.subscriptions.push(itemId);
    } else {
      $(item).attr('item-status', 'unsubscribed');
      $(item).html('Save Item');
      while(user.subscriptions.indexOf(itemId) >= 0) {
        user.subscriptions.splice(user.subscriptions.indexOf(itemId), 1);
      }
      if(window.location.href.includes('saved-page')) {
        $(item).parent().parent().parent().remove();
      }
    }
    var cleanEmail = user.email.replace(/\./g, ',').toLowerCase();
    database.ref(cleanEmail).set(user);
    localStorage.setItem("user", JSON.stringify(user));
}

//Search the walmart api for this item and return a list of items
function findItems(keyword) {

}
