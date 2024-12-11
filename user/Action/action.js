/*search animation */
let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active')
    navbar.classList.remove('active');
}


/*Navbar animation */
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active')
    searchForm.classList.remove('active')
}


window.onscroll =() =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active')
}


// Select the search input and the product boxes
const searchBox = document.getElementById("search-box");
const productBoxes = document.querySelectorAll(".box");

// Add event listener to the search input
searchBox.addEventListener("input", () => {
    const searchValue = searchBox.value.toLowerCase(); // Get the search value in lowercase
    
    productBoxes.forEach(box => {
        const productName = box.querySelector(".product-name").textContent.toLowerCase(); // Get the product name
        // Show or hide the box based on the search value
        if (productName.includes(searchValue)) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });
});



// Get references to cart count and all "Add to Cart" buttons
const cartCount = document.getElementById("count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Retrieve stored cart data or initialize it
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Update cart counter on page load
updateCartCounter();

// Add event listeners to "Add to Cart" buttons
addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const productBox = button.closest(".box");
        const productName = productBox.querySelector(".product-name").textContent;
        const productPrice = productBox.querySelector(".price").textContent.match(/\d+(\.\d+)?/g); // Extract numeric prices
        const productImage = productBox.querySelector("img").src;

        // Create a product object
        const product = { name: productName, price: parseFloat(productPrice[0]), image: productImage };

        // Check if the item already exists in the cart
        const existingItem = cartItems.find(item => item.name === product.name);

        if (existingItem) {
            // Increment the quantity and update the total price
            existingItem.quantity++;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
        } else {
            // Add the product as a new item in the cart
            cartItems.push({ ...product, quantity: 1, totalPrice: product.price });
        }

        // Save the cart data to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Update cart counter
        updateCartCounter();

        // Provide feedback (optional)
        button.textContent = "Added!";
        button.disabled = true;
    });
});

// Function to update the cart counter
function updateCartCounter() {
    cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0); // Sum all quantities
}






const cartItemsContainer = document.getElementById("cartItem"); // Container for cart items
const totalPriceElement = document.getElementById("total"); // Element displaying the total price
const cartCountElement = document.getElementById("count"); // Cart counter in the header
// Form and Container References
const newReleaseItemsContainer = document.getElementById("newReleaseItems");

// Function to update cart count in header
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    // You can add code here to update the cart count in your header if needed.
}

// Function to render items in the "New Releases" section
function renderItems() {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    newReleaseItemsContainer.innerHTML = ""; // Clear current items

    storedItems.forEach((item, index) => {
        const itemBox = document.createElement("div");
        itemBox.classList.add("box");
        itemBox.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="border-radius: 5px; width: 100%; height: auto;">
            <h3 class="product-name">${item.title}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" style="padding: 10px 20px; background-color: orange; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Add to Cart
            </button>
            <button class="remove-btn" data-index="${index}" style="padding: 10px 20px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Remove
            </button>
        `;

        newReleaseItemsContainer.appendChild(itemBox);

        // Add to Cart functionality
        itemBox.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(item));

        // Remove functionality
        itemBox.querySelector(".remove-btn").addEventListener("click", () => {
            removeItem(index);
        
        });
    });
}

// Function to add an item to the cart
function addToCart(item) {
    const existingItem = cartItems.find((cartItem) => cartItem.title === item.title);

    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += item.price;
    } else {
        cartItems.push({ ...item, quantity: 1, totalPrice: item.price });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
}

// Function to remove an item from the New Releases section
function removeItem(index) {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    storedItems.splice(index, 1); // Remove item by index
    localStorage.setItem("storeItems", JSON.stringify(storedItems));

    renderItems(); // Re-render items
    alert("Item removed successfully!");
}

// Event listener for adding new items
addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get form values
    const title = document.getElementById("item-title").value;
    const description = document.getElementById("item-description").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const image = document.getElementById("item-image").value;

    const newItem = { title, description, price, image };

    // Store in localStorage
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    storedItems.push(newItem);
    localStorage.setItem("storeItems", JSON.stringify(storedItems));

    renderItems(); // Re-render items
    addItemForm.reset(); // Clear the form
    alert("New item added successfully!");
});

// Initial Load
updateCartCount();
renderItems();