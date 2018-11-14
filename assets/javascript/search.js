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
$("button").on('click',function(e){
    e.preventDefault();
    start = 1;
    $('#items').empty();
    searchItem =  $('#search_box').val();
    searchCatalog(searchItem);
});

$( document ).ready(function() {
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

// register button click to track save items
$(document.body).on('click', '.btnItem' ,function(event){
    event.preventDefault();
    console.log($(this).attr('id'));
});

// register button click to track save item on modal window
$(document.body).on('click', '.modalTrack' ,function(event){
    event.preventDefault();
    subscribeItem('my email???', $(this).attr('data-item'));
    console.log($(this).attr('data-item'));
    $('#detailModal').modal('hide')
});

// register listener on image click
$(document.body).on('click', '.open-Modal' ,function(event){
    event.preventDefault();
    var id = $(this).attr('item-type');
    showModalItem(id);
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
        var row  = '<div class="col col-lg-3 col-md-4 custCol" >' +
               '<div class="card" style="width: 15rem;">'+
               `<img class="card-img-top open-Modal" src="${imgURL}" alt="${name}" item-type="${itemId}" width="254" height="254" data-toggle="modal" data-target="#detailModal"'>` +
               '<div class="card-body">'+
               `<h5 class="card-title">${name}</h5>` +
               `<p class="card-text">MSRP: ${msrp} <br/> Sale Price: ${salePrice}</p><br/>`;
               if(user.subscriptions.indexOf(itemId.toString()) >= 0) {
                 row += `<a href="#" class="btn btn-primary" id="${itemId}" item-status="subscribed" onclick="subscribeItem(this);">Remove Item</a>`;
               } else {
                 row += `<a href="#" class="btn btn-primary" id="${itemId}" item-status="unsubscribed" onclick="subscribeItem(this);">Save Item</a>`;
               }
               '</div></div></div>';
        $('#items').append(row);
    }
}

function parseModalResponse(json){
    for (var i = 0; i < json.items.length; i++){
        $("#productImage").attr('src', json.items[i].largeImage);
        $("#productIdValue").html(json.items[i].itemId);
        $("#productDescriptionValue").html(json.items[i].shortDescription);
        $("#productMSRPValue").html(json.items[i].bestMarketplacePrice.price);
        $("#productPriceValue").html(json.items[i].salePrice);
        $("#productAvailabilityValue").html(json.items[i].stock);
        $('#modalLabel').text(json.items[i].name);
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

function showModalItem (itemId){

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
