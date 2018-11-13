const maxContentLength = 50;

// Register on click event listen for the product search button
$("button").on('click',function(e){
    e.preventDefault();
    var searchItem =  $('#search_box').val();
    if (searchItem)
        searchCatalog(searchItem);
    
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
    var jsonText = $(this).attr('item-data');
    $('#modalLabel').text(`Item ID: ${id}`);
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
    $('.gridContainer').empty();
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
   
        row  += '<div class="col col-lg-3 col-md-4 custCol" >' +
            '<div class="card" style="width: 15rem;">'+
            `<img class="card-img-top open-Modal" src="${imgURL}" alt="${name}" item-type="${itemId}" width="254" height="254" data-toggle="modal" data-target="#detailModal"'>` +
            '<div class="card-body">'+
            `<h5 class="card-title">${name}</h5>` +
            `<p class="card-text">MSRP: ${msrp} <br/> Sale Price: ${salePrice}</p><br/>` +
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
