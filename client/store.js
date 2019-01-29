if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    var removeItemsButtons = document.getElementsByClassName('btn-remove')
    for (var i = 0; i<removeItemsButtons.length; i++) {
        var button = removeItemsButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('addToCart')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
        console.log("adding item to cart")
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

var stripeHandler = StripeCheckout.configure()

function purchaseClicked(event) {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('€', '')) * 100
    stripeHandler.open({
        amount: price
    })
}

function addToCartClicked(event) {
    var button = event.target
    var storeItem = button.parentElement.parentElement
    var name = storeItem.getElementsByClassName('store-item-name')[0].innerText
    var price = storeItem.getElementsByClassName('store-item-price')[0].innerText
    var imgSrc = storeItem.getElementsByClassName('store-item-image')[0].src
    var id = storeItem.dataset.itemId
    addItemToCart(name, price, imgSrc, id)
    updateTotal()
}

function addItemToCart(name, price, imgSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-name')
    for (var i=0; i<cartItemNames.length; i++){
        if (cartItemNames[i].innerText == name) {
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imgSrc}" width="100" height="100">
            <span class="cart-item-name">${name}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-remove" type="button">X</button>
        </div>`
        cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('click', quantityChanged)
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateTotal()
}

function updateTotal() {
    var cartItemBlock = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemBlock.getElementsByClassName('cart-row')
    var total = 0;
    for (var i=0; i<cartRows.length; i++) {
       var cartRow = cartRows[i]
       var priceElement = cartRow.getElementsByClassName('cart-price')[0]
       var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
       var price = parseFloat(priceElement.innerText.replace('€', ''))
       var quantity = quantityElement.value
       total = total + (price * quantity)
    }
    console.log ("updating total")
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '€' + total
}