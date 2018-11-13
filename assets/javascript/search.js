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

$("button").on('click',function(e){
    e.preventDefault();
    start = 1;
    searchItem =  $('#search_box').val();
    searchCatalog(searchItem);

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
            `<h5 class="card-title">${name}</h5>` +
            '<a href="#" class="btn btn-primary">Save Item</a>' +
            '</div>'+
            '</div></div>';
        $('.row').append(row);
    }
}

function searchCatalog (category){

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
