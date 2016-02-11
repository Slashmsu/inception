$(function() {

    $('#search').keyup(function() {

        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/api/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: function(products) {

                $('#searchResults').empty();
                for (var i = 0; i < products.length; i++) {
                    var html = "";
                    html += '<div class="col-md-4">';
                    html += '<a href="/product/' + products[i]._id + '">';
                    html += '<div class="thumbnail">';
                    html += '<img src="' +  products[i].image + '">';
                    html += '<div class="caption">';
                    html += '<h3>' + products[i].name  + '</h3>';
                    html += '<p>' +  products[i].category.name  + '</h3>';
                    html += '<p>$' +  products[i].price  + '</p>';
                    html += '</div></div></a></div>';

                    $('#searchResults').append(html);
                }

            },

            error: function(error) {
                console.log(error);
            }
        });
    });

});

//===========================Dropdown  menu==================================================
$('div.dropdown ul.dropdown-menu li a').click(function (e) {
    //e.preventDefault();
    $('.selected').html($(this).html());
});

//===========================Plus & Minus button==================================================
$(document).on('click', '#plus', function (e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());

    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
});

$(document).on('click', '#minus', function (e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());

    if (quantity > 1) {
        priceValue -= parseFloat($('#priceHidden').val());
        quantity -= 1;

        $('#quantity').val(quantity);
        $('#priceValue').val(priceValue.toFixed(2));
        $('#total').html(quantity);
    }

});