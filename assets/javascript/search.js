const maxContentLength = 50;

// Register on click event listen for the product search button

$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
          if (start * numItems < totalResults) {
            start++;
            searchCatalog(searchItem);
          }
           // ajax call get data from server and append to the div
    }
});

var start;
var numItems = 15; //Number of items to display for each call
var totalResults;
var searchItem = '';
var user = JSON.parse(localStorage.getItem("user"));
$("#search_submit").on('click',function(e){
    e.preventDefault();
    start = 1;
    $('#items').empty();
    searchItem =  $('#search_box').val();
    searchCatalog(searchItem);
});

$(document).ready(function() {
  if(window.location.href.includes('saved-page')) {
    var itemIds = '';
    for (var itemId in user.subscriptions) {
      itemIds += user.subscriptions[itemId] + ',';
    }
    itemIds = itemIds.substring(0,itemIds.length-1);
    findItems(itemIds);
  } else if(window.location.href.includes('profile-page')) {
    var userEmail = user.email;
    var row  = `<div class="col"><span class="font-weight-bold">Email:&nbsp;</span>${userEmail}</div>`;
    $('#user').append(row);
  }
});

// register listener on image click
$(document.body).on('click', '.btn' ,function(event){
    event.preventDefault();
});


// register button click to track save item on modal window
$(document.body).on('click', '.subscribe' ,function(event){
    subscribeItem(this);
});

// register button click to track save item on modal window
$(document.body).on('click', '#modalSave' ,function(event){
    var itemId = $("#modalSave").attr('data-item');
    subscribeItem($('#' + itemId));
});


// register listener on image click
$(document.body).on('click', '.open-Modal' ,function(event){
    var itemId = $(this).attr('item-type');
    var itemStatus = $('#' + itemId).attr('item-status');
    showModalItem(itemId, itemStatus);
});

// Callback function to interpret the JSON response from search api
function parseResponse(json){
    totalResults = json.totalResults;
    var itemId = '';
    var imgURL = '';
    var msrp = '';
    var salePrice = '';
    var shortDesc = '';
    var stock = '';
    var name = '';
    var row = '';
    for (var i = 0; i < json.items.length; i++){
        itemId = json.items[i].itemId;
        imgURL = json.items[i].largeImage;
        msrp = json.items[i].msrp;
        salePrice = json.items[i].salePrice;
        shortDesc = json.items[i].shortDescription;
        stock = json.items[i].stock;
        name = json.items[i].name;
        if (name.length > maxContentLength){
            name = name.substring(0,maxContentLength) + '...';
        }
        var row  = '<div class="col custCol" ><div class="card" style="width: 15rem;">'+
               `<img class="card-img-top open-Modal" src="${imgURL}" alt="${name}" item-type="${itemId}" width="254" height="254" data-toggle="modal" data-target="#detailModal"'>` +
               '<div class="card-body">'+
               `<h5 class="card-title">${name}</h5>` +
               `<p class="card-text">MSRP: ${msrp} <br/> Sale Price: ${salePrice}</p><br/>`;
               if(salePrice < msrp * 0.8) {
                   row += `<div class="alert alert-danger" role="alert"><b>On Sale!</b></div>`;
               }
               if(user.subscriptions.indexOf(itemId.toString()) >= 0) {
                 row += `<a href="#" class="btn btn-primary subscribe" id="${itemId}" item-status="subscribed">Remove Item</a>`;
               } else {
                 row += `<a href="#" class="btn btn-primary subscribe" id="${itemId}" item-status="unsubscribed">Save Item</a>`;
               }
               '</div></div></div>';
        $('#items').append(row);
    }
}

// Callback function to interpret the JSON response from search api for the modal window
function parseModalResponse(json){
    for (var i = 0; i < json.items.length; i++){
        $('#modalLabel').text(json.items[i].name);
        $("#productImage").attr('src', json.items[i].largeImage);
        $("#productIdValue").html(json.items[i].itemId);
        $("#productDescriptionValue").empty();
        $("#productDescriptionValue").append($.parseHTML(json.items[i].shortDescription));
        $("#productMSRPValue").html(json.items[i].msrp);
        $("#productPriceValue").html(json.items[i].salePrice);
        $("#productAvailabilityValue").html(json.items[i].stock);
        $("#modalSave").attr('data-item', json.items[i].itemId);
    }
}

function searchCatalog (category, overrideUrl){
    // Walmart domain
    var domain = 'https://api.walmartlabs.com/v1/search';

    // API Key
    var apiKey = 'jjntmj9urbkey38nbuy2kztk';

    // API URL
    var url = `${domain}?apiKey=${apiKey}&query=${category}&start=${start}&numItems=${numItems}`;

    // JSONP call to retrieve product details
    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonpCallback: "parseResponse",
    });

}

// find items based on an array of items
function findItems (itemIds){

    // Walmart domain
    var domain = 'https://api.walmartlabs.com/v1/items';

    // API Key
    var apiKey = 'jjntmj9urbkey38nbuy2kztk';

    // API URL
    var url = `${domain}?apiKey=${apiKey}&ids=${itemIds}`;

    // JSONP call to retrieve product details
    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonpCallback: "parseResponse",
    });

}

// displays the modal window on image click
function showModalItem (itemId, itemStatus){
    if(itemStatus==='unsubscribed') {
      $("#modalSave").html('Save Item');
    } else {
      $("#modalSave").html('Remove Item');
    }
    // Walmart domain
    var domain = 'https://api.walmartlabs.com/v1/items';

    // API Key
    var apiKey = 'jjntmj9urbkey38nbuy2kztk';

    // API URL
    var url = `${domain}?apiKey=${apiKey}&ids=${itemId}`;

    // JSONP call to retrieve product details
    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonpCallback: "parseModalResponse",
    });

}

// Triggers the email api endpoint
function emailer(to_name, message_html) {

    emailjs.init("user_ITZhTZz79nrtiOTftjpPw");

    var template_params = {
        "from_name": "tahreemsohailbutt@gmail.com",
        "to_name": to_name,
        "message_html": message_html
    };

    var service_id = "tahreemsohailbutt@gmail.com";
    var template_id = "template_HXSdd43S";
    emailjs.send(service_id, template_id, template_params);
}
