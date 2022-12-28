$(document).ready(function() {
    //check if local storage value of "cart retrived " is True
    retrieve_saved_cart()
    var cart = !!localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : null;
    if (cart !== null)
        document.getElementById('cart-count').innerText = parseFloat(cart.length).toLocaleString('en-US')

    if (window.location.href.indexOf("cart") > -1) {
        //dynamically generate the cart on the page
        load_cart()
    }

    if (window.location.href.indexOf("view-orders") > -1) {
        order_list_functionality()

    }
    $('#order-tbl').find('th, td').addClass('px-2 py-1 align-middle')
    $('#order-tbl').find('th:nth-child(1), td:nth-child(1)').addClass('text-center')
    $('#order-tbl').find('th:nth-last-child(1), td:nth-last-child(1)').addClass('text-right')
});

const one = document.getElementById('1')
const two = document.getElementById('2')
const three = document.getElementById('3')
const four = document.getElementById('4')
const five = document.getElementById('5')

// get the form, confirm-box and csrf token
const form = document.querySelector('.rate-form')
const confirmBox = document.getElementById('confirm-box')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const handleStarSelect = (size) => {
    const children = form.children
    console.log(children[0])
    for (let i=0; i < children.length; i++) {
        if(i <= size) {
            children[i].classList.add('checked')
        } else {
            children[i].classList.remove('checked')
        }
    }
}

const handleSelect = (selection) => {
    switch(selection){
        case '1': {
            // one.classList.add('checked')
            // two.classList.remove('checked')
            // three.classList.remove('checked')
            // four.classList.remove('checked')
            // five.classList.remove('checked')
            handleStarSelect(1)
            return
        }
        case '2': {
            handleStarSelect(2)
            return
        }
        case '3': {
            handleStarSelect(3)
            return
        }
        case '4': {
            handleStarSelect(4)
            return
        }
        case '5': {
            handleStarSelect(5)
            return
        }
        default: {
            handleStarSelect(0)
        }
    }

}

const getNumericValue = (stringValue) =>{
    let numericValue;
    if (stringValue === '1') {
        numericValue = 1
    }
    else if (stringValue === '2') {
        numericValue = 2
    }
    else if (stringValue === '3') {
        numericValue = 3
    }
    else if (stringValue === '4') {
        numericValue = 4
    }
    else if (stringValue === '5') {
        numericValue = 5
    }
    else {
        numericValue = 0
    }
    return numericValue
}

if (one) {
    const arr = [one, two, three, four, five]

    arr.forEach(item=> item.addEventListener('mouseover', (event)=>{
        handleSelect(event.target.id)
    }))

    arr.forEach(item=> item.addEventListener('click', (event)=>{
        // value of the rating not numeric
        const val = event.target.id

        let isSubmit = false
        form.addEventListener('submit', e=>{
            e.preventDefault()
            if (isSubmit) {
                return
            }
            isSubmit = true
            // picture id
            const id = e.target.id
            // value of the rating translated into numeric
            const val_num = getNumericValue(val)

            $.ajax({
                type: 'POST',
                url: '/rate/',
                data: {
                    'csrfmiddlewaretoken': csrf[0].value,
                    'el_id': id,
                    'val': val_num,
                },
                success: function(response){
                    console.log(response)
                    confirmBox.innerHTML = `<h3>Successfully rated with ${response.score}</h3>`
                },
                error: function(error){
                    console.log(error)
                    confirmBox.innerHTML = '<h1>Ups... something went wrong</h1>'
                }
            })
        })
    }))
}

function order_list_functionality() {
    onRowClick("orders_table", function(row) {
        var id = row.getElementsByTagName("td")[0].innerHTML;
        var csrftoken = getCookie('csrftoken');
        //send get request to see if user has superuser permissions
        var user_is_super = check_user_super();
        if (user_is_super && row.classList.contains("mark-as-complete")) {
            var r = confirm("Would you like to mark order " + id + " as delivered?");
            if (r == true) {
                $.ajax({
                    url: "/mark_order_as_delivered", // the endpoint
                    type: "POST", // http method
                    data: { id: id, csrfmiddlewaretoken: csrftoken }, // data sent with the post request

                    // handle a successful response
                    success: function(json) {
                        //make the row green
                        row.classList.remove("table-danger");
                        row.classList.add("table-success")
                    },

                    // handle a non-successful response
                    error: function(xhr, errmsg, err) {
                        //have this as another toast
                        console.log("the server said no lol")
                    }
                }); //make ajax post request
            }
        }

    });
}

function check_user_super() {
    var return_value;
    $.ajax({
        url: "check_superuser",
        type: 'GET',
        success: function(res) {
            console.log("we got back from the server the value ---> " + res)
            if (res == "True") {
                console.log("assigned true")
                return_value = true;
            } else {
                return_value = false;
            }
        },
        async: false
    });
    return return_value
}

function add_to_cart(info) {
    //info will be the stuff displayed in the reciept
    // item description as well as teh price
    display_notif("add to cart", info);
    var cart_retrieved = !!localStorage.getItem("cart") ? localStorage.getItem("cart") : null
    if (cart_retrieved === null) {
        //make a new cart
        var cart = [info];
        localStorage.setItem('cart', JSON.stringify(cart));
        document.getElementById('cart-count').innerText = ''

    } else {
        var cart = JSON.parse(cart_retrieved);
        cart.push(info)
        localStorage.setItem('cart', JSON.stringify(cart));
        document.getElementById('cart-count').innerText = parseFloat(cart.length).toLocaleString('en-US')
    }


}

function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId),
        rows = table.getElementsByTagName("tr"),
        i;

    for (i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function(row) { return function() { callback(row); }; }(table.rows[i]);
    }
}

function display_notif(type, info = "No info provided") {
    //the different types of toasts are success, warning ... info and error
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "70",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "500",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    switch (type) {
        case "add to cart":
            toastr.success(info.item_description + ': Php ' + info.price, 'Added to Cart');
            break;
        case "remove from cart":
            toastr.info("Successfully removed " + info + " from cart");
            break;
        case "new order":
            toastr.success("Order successfully placed");
            break;
    }

}

function load_cart() {
    var table = document.getElementById('cart_body');
    table.innerHTML = ""; //clear the table
    var cart = JSON.parse(localStorage.getItem("cart"));
    var total = 0;
    if (cart !== null && cart.length > 0) {
        for (var i = 0; i < cart.length; i++) {

            var row = table.insertRow(-1);
            var item_number = row.insertCell(0);
            var item_description = row.insertCell(1);
            var item_price = row.insertCell(2);
            item_number.innerHTML = String(i + 1);
            item_description.innerHTML = cart[i].item_description;
            item_price.innerHTML = "Php " + parseFloat(cart[i].price).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 });

            total += cart[i].price
        }
        total = Math.round(total * 100) / 100
        localStorage.setItem('total_price', total);
        document.getElementById('total').innerHTML = "Php " + parseFloat(localStorage.getItem("total_price")).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })


        onRowClick("cart_body", function(row) {
            var value = row.getElementsByTagName("td")[0].innerHTML;
            var description = row.getElementsByTagName("td")[1].innerHTML;
            var r = confirm("Proceed to delete '" + description + "' from cart?");
            if (r == true) {
                document.getElementById("cart_body").deleteRow(value - 1);
                //edit the cart
                cart.splice(value - 1, 1) //this is how you remove elements from a list in javascript
                localStorage.setItem('cart', JSON.stringify(cart)); //change the elements in the cart in local storage
                display_notif("remove from cart", description)
                load_cart() //refresh the page
            }
        });
    } else {
        display_empty_cart()
    }
    $('#card-tbl').find('th, td').addClass('px-2 py-1 align-middle')
    $('#card-tbl').find('th:nth-child(1), td:nth-child(1)').addClass('text-center')
    $('#card-tbl').find('th:nth-last-child(1), td:nth-last-child(1)').addClass('text-right')

}

function format_toppings(topping_choices) {
    var toppings = ""
    var arrayLength = topping_choices.length;
    for (var i = 0; i < arrayLength; i++) {
        if (i == 0) {
            //first iteration
            toppings += topping_choices[i]
        } else {
            toppings += " + "
            toppings += topping_choices[i]
        }
    }
    return toppings
}

function pizza_toppings(number_of_toppings, type_of_pizza, price) {
    var last_valid_selection = null;

    $('#toppings_label')[0].innerHTML = "Choose " + String(number_of_toppings) + " topping(s) here"
    $('#select_toppings').change(function(event) {
        console.log($(this).val().length)
        console.log(number_of_toppings)
        if ($(this).val().length > number_of_toppings) {

            $(this).val(last_valid_selection);
        } else {
            last_valid_selection = $(this).val();
        }
    }); //this is what restircts the user from choosing more than they are paying fpr

    $('#toppings_modal').modal('show'); //show the modal
    $("#submit_toppings").click(function() {
        var topping_choices = $('#select_toppings').val();
        //console.log("TOPping choices are "+topping_choices[0])

        $('#toppings_modal').modal('toggle'); //hide the modal
        var info = {
            "item_description": type_of_pizza + " pizza with " + format_toppings(topping_choices),
            "price": price
        }
        add_to_cart(info)

    });
};

function close_modal() {
    $('#toppings_modal').modal('hide');
    $('#toppings_modal').modal('dispose');
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
} //this function is to get the CSRF token

function display_empty_cart() {
    var table = document.getElementById('cart_body');
    table.innerHTML = ""; //clear the table
    document.getElementById('total').innerHTML = ""
    document.getElementById('cart_heading').innerHTML = "Cart is empty!"
    document.getElementById("checkout_button").disabled = true;

}

function clear_cart() {
    localStorage.removeItem("cart"); //Clear the cart
    localStorage.removeItem("total_price"); //clear the price
    //remove the elements from the page
    display_empty_cart();
}

function checkout() {
    //this is the function that will be run when the user wants to checkout
    var cart = localStorage.getItem("cart")
    var price_of_cart = localStorage.getItem("total_price")
    var csrftoken = getCookie('csrftoken');

    console.log("Checkout was clicked so we now send it to the server!") // sanity check
    $.ajax({
        url: "/checkout", // the endpoint
        type: "POST", // http method
        data: { cart: cart, price_of_cart: price_of_cart, csrfmiddlewaretoken: csrftoken }, // data sent with the post request

        // handle a successful response
        success: function(json) {
            display_notif("new order")
            clear_cart()
        },

        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            //have this as another toast
            console.log("the server said no lol")

        }
    });

}

function logout() {
    var current_cart = localStorage.getItem("cart")
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: "/save_cart", // the endpoint
        type: "POST", // http method
        data: { cart: current_cart, csrfmiddlewaretoken: csrftoken }, // data sent with the post request

        // handle a successful response
        success: function(json) {
            //clear the local storage
            localStorage.removeItem("cart"); //Clear the cart
            localStorage.setItem('cart_retrieved', false);
            window.location.href = "/logout";
        },

        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            //have this as another toast
            console.log("the server said no lol")

        }
    });

}

function retrieve_saved_cart() {
    if (localStorage.getItem("cart_retrieved") !== "true") {
        $.ajax({
            url: "retrieve_saved_cart",
            type: 'GET',
            success: function(res) {
                localStorage.setItem('cart_retrieved', true);
                localStorage.setItem("cart", res)
            }
        });
        //
    }
}
