$( document ).ready(function() {
  
  $('#existingUserEmail').keyup(function() {
    $('#error').hide();
  });

  $('#newUserEmail').keyup(function() {
    $('#error').hide();
  });

});


//Render the given items in the UI
function renderItems(keyword){
  findItems();
}

