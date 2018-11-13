const maxContentLength = 55;

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
    $('.row').empty();
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
    $('.row').append(row);
  }
});

// Callback function to interpret the JSON response from search api
function parseResponse(json){
    totalResults = json.totalResults;
    numItems = json.numItems;
    var itemId = '';
    var imgURL = '';
    var msrp = '';
    var salePrice = '';
    var shortDesc = '';
    var stock = '';
    var name = '';
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
        var row  = '<div class="col col-lg-3 col-md-4" >' +
            '<div class="card" style="width: 16rem;">'+
            `<img class="card-img-top" src="${imgURL}" alt="${name}" width="254" height="254">` +
            '<div class="card-body">'+
            `<h5 class="card-title">${name}</h5>`;
        if(user.subscriptions.indexOf(itemId.toString()) >= 0) {
          row += `<a href="#" class="btn btn-primary" id="${itemId}" item-status="subscribed" onclick="subscribeItem(this);">Remove Item</a>`;
        } else {
          row += `<a href="#" class="btn btn-primary" id="${itemId}" item-status="unsubscribed" onclick="subscribeItem(this);">Save Item</a>`;
        }
        row += '</div></div></div>';
        $('.row').append(row);
    }
}

function searchCatalog (category, overrideUrl){

    // Walmart domain
    var domain = 'http://api.walmartlabs.com/v1/search';

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
    var domain = 'http://api.walmartlabs.com/v1/items';

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
