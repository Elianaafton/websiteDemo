// Retrieve users and login history from localStorage, or initialize them if not set
let users = JSON.parse(localStorage.getItem('users')) || [
    { firstname: "Admin", lastname: "", address: "", email: "eliana@gmail.com", password: "542005", role: "admin" }
];
let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];

function toggleSignup() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
}

function toggleLogin() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Save login history
        loginHistory.push({ email, time: new Date().toLocaleString(), ipAddress: "192.168.1.1" }); // Simulate IP address for now
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));

        // Redirect based on user role
        if (user.role === "admin") {
            alert("Welcome Admin!");
            window.location.href = "../log-in/admin/admin.html"; // Redirect to admin page
        } else {
            alert("Welcome User!");
            window.location.href = "../log-in/user/New Release/Nrelease.html"; // Redirect to user page
        }
    } else {
        alert("This user is not in the database. Please sign up.");
    }
}

function signup() {
    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const address = document.getElementById('signup-address').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (firstname && lastname && address && email && password && confirmPassword) {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert("User already exists. Please log in.");
        } else {
            // Add new user and save to localStorage
            const newUser = { firstname, lastname, address, email, password, role: "user" };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users)); // Save users to localStorage
            alert("Sign up successful! Please log in.");
            toggleLogin();
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Admin panel logic (display registered users and login history)
if (window.location.pathname.includes('admin.html')) {
    document.body.innerHTML = `
        <h2>Admin Dashboard</h2>
        <h3>Registered Users</h3>
        <ul id="user-list">
            ${users.map(user => `
                <li>
                    ${user.firstname} ${user.lastname} - ${user.email} (${user.address})
                    <div class="password-container">
                        <input type="password" value="${user.password}" readonly>
                        <button onclick="togglePasswordVisibility(${user.email})">Show Password</button>
                    </div>
                </li>
            `).join('')}
        </ul>
        <h3>Login History</h3>
        <ul id="login-history">
            ${loginHistory.map(entry => `
                <li>${entry.email} - ${entry.time} - IP: ${entry.ipAddress}</li>
            `).join('')}
        </ul>`;
}

// Toggle password visibility
function togglePasswordVisibility(email) {
    const passwordInput = document.querySelector(`input[value="${email}"]`);
    const button = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.textContent = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        button.textContent = 'Show Password';
    }
}


// Ensure you're selecting the correct elements
const newReleaseItemsContainer = document.getElementById("new-release-items");
const addItemForm = document.getElementById("addItemForm"); // Ensure the form exists in your HTML

// Render items from localStorage in the "New Releases" section
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
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find(cartItem => cartItem.title === item.title);

    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += item.price;
    } else {
        cartItems.push({ ...item, quantity: 1, totalPrice: item.price });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to remove an item from "New Releases"
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
renderItems();