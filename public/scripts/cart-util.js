
function addLoadingOverlay(){
  document.getElementById('loading-overlay').style.display = "block";  
}

function removeLoadingOverlay(){
  document.getElementById('loading-overlay').style.display = "none";
}

async function changeItemQuantity(event){

  // make overlay visible  
  addLoadingOverlay();
  

  let response = await fetch("/changequantity", {
    method: "POST",
    body: JSON.stringify({
      cartItemPosition: event.target.dataset.position,
      quantity: event.target.value,
      csrfToken: event.target.dataset.csrftoken
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  response = await response.json();
  
  updateCart(response.shoppingCart);
  updateCsrfToken(response.csrfToken);
  
  // make overlay invisible  
  removeLoadingOverlay();

}


function updateShoppingCartElements(shoppingCart) {
  // update all price and quantity DOM elements...
  const cartItemTotalPriceElements = document.querySelectorAll(
    ".cart-item-total-price-container"
  );

  cartItemTotalPriceElements.forEach((item, index) => {
    item.children[0].textContent = shoppingCart.cartItems[index].totalPrice;
  });

  // navbar:
  document.getElementById("number-of-items").textContent =
    shoppingCart.totalNumberOfItems;

  document.querySelector("#cart-total-price span").textContent =
    shoppingCart.totalPrice;

  // main container:
  document.querySelector("#number-of-items-in-cart").textContent =
    shoppingCart.totalNumberOfItems;
}

function updateCart(shoppingCart) {
  if (shoppingCart.totalNumberOfItems) {
    const cartItemTotalPriceElements = document.querySelectorAll(
      ".cart-item-total-price-container"
    );

    // Cart item total price:
    cartItemTotalPriceElements.forEach((item, index) => {
      item.children[0].textContent = shoppingCart.cartItems[index].totalPrice;
    });

    // Position number above cart item:
    document.querySelectorAll(".cart-item-container").forEach((item, index) => {
      item.children[0].textContent = index + 1;
    });

    document.querySelectorAll('button[onclick*="removeCartItem"]').forEach((item, index) => {
      item.dataset.position = index;
    });

    document.querySelectorAll("input").forEach((item, index) => {
      item.dataset.position = index;
    });

    // navbar:
    document.getElementById("number-of-items").textContent =
      shoppingCart.totalNumberOfItems;

    document.querySelector("#cart-total-price span").textContent =
      shoppingCart.totalPrice;

    // main container:
    document.querySelector("#number-of-items-in-cart").textContent =
      shoppingCart.totalNumberOfItems;
  } else {
    // navbar:
    document.getElementById("number-of-items").style.display = "none";

    // remove total cart price element:
    document.getElementById("cart-total-price").parentElement.remove();

    // main container:
    document.querySelector(
      "#number-of-items-in-cart"
    ).parentElement.textContent = "Your shopping cart is empty.";
  }
}

async function removeCartItem(event) {

  addLoadingOverlay();

  let response = await fetch("/remove-product", {
    method: "POST",
    body: JSON.stringify({
      cartItemPosition: event.target.dataset.position,
      csrfToken: event.target.dataset.csrftoken
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  response = await response.json();
 
  event.target.parentElement.parentElement.remove();

  updateCart(response.shoppingCart);
  updateCsrfToken(response.csrfToken);

  removeLoadingOverlay();
  
}


function updateCsrfToken(csrfToken){
  document.querySelectorAll('[data-csrftoken').forEach(
    element => {element.dataset.csrftoken = csrfToken}
  );
  
  let placeOrderButton = document.querySelector('#place-order-form input');
  if(placeOrderButton){
    placeOrderButton.value = csrfToken;
  }
  
  
}

async function addToCart(event) {

addLoadingOverlay();

  const response = await fetch("/add-product", {
    method: "POST",
    body: JSON.stringify({
      productId: event.target.dataset.productid,
      csrfToken: event.target.dataset.csrftoken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  document.getElementById("number-of-items").style.display = "block";
  document.getElementById("number-of-items").textContent =
    responseData.numberOfItems;

  updateCsrfToken(responseData.csrfToken);

  removeLoadingOverlay();
 
}