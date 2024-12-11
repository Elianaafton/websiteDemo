// Cart Data
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Form and Container References
const addItemForm = document.getElementById("add-item-form");
const itemsContainer = document.getElementById("items-container");

// Function to update cart count in header
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    // You can add code here to update the cart count in your header if needed.
}

// Function to render items in the "New Releases" section
function renderItems() {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    itemsContainer.innerHTML = ""; // Clear current items

    storedItems.forEach((item, index) => {
        const itemBox = document.createElement("div");
        itemBox.classList.add("box");
        itemBox.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="border-radius: 5px; width: 100%; height: auto;">
            <h3 class="product-name">${item.title}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="genre">Genre: ${item.genre}</div> <!-- Genre Display -->
            <button class="add-to-cart-btn" style="padding: 10px 20px; background-color: orange; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Add to Cart
            </button>
            <button class="remove-btn" data-index="${index}" style="padding: 10px 20px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Remove
            </button>
            <button class="edit-btn" data-index="${index}" style="padding: 10px 20px; background-color: blue; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Edit
            </button>
        `;
        itemsContainer.appendChild(itemBox);

        // Add to Cart functionality
        itemBox.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(item));

        // Remove functionality
        itemBox.querySelector(".remove-btn").addEventListener("click", () => {
            removeItem(index);
        });

        // Edit functionality
        itemBox.querySelector(".edit-btn").addEventListener("click", () => {
            editItem(index);
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
    alert(`${item.title} has been added to your cart!`);
}

// Function to remove an item from the New Releases section
function removeItem(index) {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    storedItems.splice(index, 1); // Remove item by index
    localStorage.setItem("storeItems", JSON.stringify(storedItems));

    renderItems(); // Re-render items
    alert("Item removed successfully!");
}

// Function to edit an item
function editItem(index) {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    const item = storedItems[index];

    // Prompt user for new values
    const newTitle = prompt("Edit Title:", item.title);
    const newDescription = prompt("Edit Description:", item.description);
    const newPrice = parseFloat(prompt("Edit Price:", item.price));
    const newImage = prompt("Edit Image URL:", item.image);
    const newGenre = prompt("Edit Genre:", item.genre);

    // Update item details
    if (newTitle) item.title = newTitle;
    if (newDescription) item.description = newDescription;
    if (!isNaN(newPrice)) item.price = newPrice;
    if (newImage) item.image = newImage;
    if (newGenre) item.genre = newGenre;

    // Save updated items back to localStorage
    storedItems[index] = item;
    localStorage.setItem("storeItems", JSON.stringify(storedItems));

    renderItems(); // Re-render items
    alert("Item updated successfully!");
}

// Event listener for adding new items
addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get form values
    const title = document.getElementById("item-title").value;
    const description = document.getElementById("item-description").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const image = document.getElementById("item-image").value;
    const genre = document.getElementById("item-genre").value; // Get selected genre

    if (!genre) {
        alert("Please select a genre!");
        return;
    }

    const newItem = { title, description, price, image, genre };

    // Store in localStorage
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    storedItems.push(newItem);
    localStorage.setItem("storeItems", JSON.stringify(storedItems));

    renderItems(); // Re-render items to show the new one in the New Release section
    addItemForm.reset(); // Clear the form
    alert("New item added successfully!");
});

// Initial Load
updateCartCount();
renderItems(); // Ensure the New Releases section is rendered on initial load
