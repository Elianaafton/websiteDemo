// Get the cart elements from the HTML
const cartItemsContainer = document.getElementById("cartItem"); // Container for cart items
const totalPriceElement = document.getElementById("total"); // Element displaying the total price
const cartCountElement = document.getElementById("count"); // Cart counter in the header
const newReleaseContainer = document.getElementById("newRelease"); // New Release container

// Retrieve cart data from localStorage or initialize
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to render the cart items
function renderCartItems() {
    // Clear the current display
    cartItemsContainer.innerHTML = "";

    // Check if the cart is empty
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartCountElement.textContent = "0"; // Update cart count
        totalPriceElement.textContent = "$0.00"; // Update total price
        return;
    }

    // Render each cart item
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.style.display = "flex";
        cartItem.style.justifyContent = "space-between";
        cartItem.style.alignItems = "center";
        cartItem.style.marginBottom = "15px";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto; border-radius: 5px;">
            <div style="flex: 1; margin-left: 15px;">
                <h3 class="product-name">${item.title}</h3>
                <p style="margin: 5px 0;">Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 5px 0;">Quantity: ${item.quantity}</p>
            </div>
            <button class="remove-btn" data-index="${index}" style="padding: 5px 10px; background-color: orange; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Remove
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add a single "Buy" button for the entire cart
    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.style.padding = "10px 20px";
    buyButton.style.backgroundColor = "orange";
    buyButton.style.color = "white";
    buyButton.style.border = "none";
    buyButton.style.borderRadius = "5px";
    buyButton.style.cursor = "pointer";
    buyButton.style.marginTop = "20px";

    // Attach the "Buy" button to the cart container
    cartItemsContainer.appendChild(buyButton);

    // Add click event to the "Buy" button
    buyButton.addEventListener("click", handleBuy);

    // Attach event listeners to "Remove" buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            removeCartItem(index);
        });
    });

    // Update the total price and cart count
    updateCartSummary();

    // Render the new releases (recently added items)
    renderNewReleases();
}

// Function to render the recently added items (new releases)
function renderNewReleases() {
    // Sort the items by timestamp (most recent first)
    const sortedItems = [...cartItems].sort((a, b) => b.timestamp - a.timestamp);

    // Clear the new release section
    newReleaseContainer.innerHTML = "";

    // Show the top 3 most recent items
    const recentItems = sortedItems.slice(0, 3); // Adjust the number if needed

    if (recentItems.length === 0) {
        newReleaseContainer.innerHTML = "<p>No recent items.</p>";
        return;
    }

    // Render each recent item
    recentItems.forEach((item) => {
        const recentItemElement = document.createElement("div");
        recentItemElement.classList.add("new-release-item");
        recentItemElement.style.display = "flex";
        recentItemElement.style.justifyContent = "space-between";
        recentItemElement.style.alignItems = "center";
        recentItemElement.style.marginBottom = "15px";

        recentItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: auto; border-radius: 5px;">
            <div style="flex: 1; margin-left: 15px;">
                <h4 class="product-name">${item.title}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
        `;
        newReleaseContainer.appendChild(recentItemElement);
    });
}

// Function to handle the "Buy" button click
function handleBuy() {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items to purchase.");
    } else {
        alert("Thank you for your purchase!");
        // Clear the cart
        cartItems = [];
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        // Re-render the cart
        renderCartItems();
    }
}

// Function to add a new item to the cart
function addItemToCart(item) {
    item.timestamp = new Date().getTime(); // Add timestamp to track when it was added
    cartItems.push(item);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCartItems();
}

// Function to remove a cart item
function removeCartItem(index) {
    // Decrease the quantity if greater than 1, otherwise remove the item
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        cartItems[index].totalPrice = cartItems[index].quantity * cartItems[index].price;
    } else {
        cartItems.splice(index, 1); // Remove the item
    }

    // Update the localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Re-render the cart items
    renderCartItems();
}

// Function to update the total price and cart count
function updateCartSummary() {
    const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Update total price and cart count
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    cartCountElement.textContent = totalItems.toString();
}

// Initial render of the cart items
renderCartItems();
