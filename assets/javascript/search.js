const maxContentLength = 55;

// Register on click event listen for the product search button
$("button").on('click',function(e){
    e.preventDefault();
    var searchItem =  $('#search_box').val();
    searchCatalog(searchItem);
    
});

// register button click to track save items
$(document.body).on('click', '.btnItem' ,function(event){
    event.preventDefault();
    console.log($(this).attr('id'));
});

// Callback function to interpret the JSON response from search api
function parseResponse(json){

    var itemId = '';
    var imgURL = '';
    var msrp = '';
    var salePrice = '';
    var shortDesc = '';
    var stock = '';
    var name = '';

    var row = '';

    row = '<div class="row">';
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
   
        row  += '<div class="col col-lg-3 col-md-4" >' +
            '<div class="card" style="width: 16rem;">'+
            `<img class="card-img-top" src="${imgURL}" alt="${name}" width="254" height="254">` +
            '<div class="card-body">'+
            `<h5 class="card-title">${name}</h5>` +
            `<a href="#" class="btn btn-primary btnItem" id="${itemId}">Save Item</a>` +
            '</div>'+
            '</div></div>';
    }
    row += '</div>';
    $('.gridContainer').append(row);
 
}

function searchCatalog (category){

    // Walmart domain
    var domain = 'http://api.walmartlabs.com/v1/search';

    // API Key
    var apiKey = 'jjntmj9urbkey38nbuy2kztk';

    // API URL
    var url = `${domain}?apiKey=${apiKey}&query=${category}`;

    // JSONP call to retrieve product details
    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonpCallback: "parseResponse",
    });
    
}
