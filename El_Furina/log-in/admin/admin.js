let users = JSON.parse(localStorage.getItem('users')) || [
    { firstname: "Admin", lastname: "", address: "", email: "eliana@gmail.com", password: "542005", role: "admin" }
];
let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
let activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];

window.onload = function() {
    loadUsers();
    loadLoginHistory();
    loadActivityLogs();
};

// Function to display the list of recently signed-up users
function loadUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear existing list

    users.forEach((user, index) => {
        if (user.role !== "admin") { // Skip displaying admin info
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <p><strong>Name:</strong> ${user.firstname} ${user.lastname}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <div class="password-container" id="password-container-${index}">
                    <input type="password" id="password-${index}" value="${user.password}" readonly>
                    <button onclick="togglePasswordVisibility(${index})">Show Password</button>
                </div>
                <button onclick="removeUser(${index})">Remove</button>
            `;
            userList.appendChild(userItem);
        }
    });
}

// Function to remove a user
function removeUser(index) {
    if (confirm("Are you sure you want to remove this user?")) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        alert("User removed successfully.");
    }
}

// Toggle password visibility function
function togglePasswordVisibility(index) {
    const passwordInput = document.getElementById(`password-${index}`);
    const button = document.getElementById(`password-container-${index}`).querySelector('button');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.textContent = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        button.textContent = 'Show Password';
    }
}

// Function to display the login history with detailed user information
function loadLoginHistory() {
    const loginList = document.getElementById('login-history');
    loginList.innerHTML = ''; // Clear existing history

    loginHistory.forEach(entry => {
        const loginItem = document.createElement('li');
        loginItem.innerHTML = `
            ${entry.email} - ${entry.time} - 
            <strong>IP:</strong> ${entry.ip} - 
            <strong>City:</strong> ${entry.city} - 
            <strong>Region:</strong> ${entry.region} - 
            <strong>Country:</strong> ${entry.country} - 
            <strong>Location:</strong> ${entry.loc} - 
            <strong>Organization:</strong> ${entry.org} - 
            <strong>Postal:</strong> ${entry.postal} - 
            <strong>Timezone:</strong> ${entry.timezone}
        `;
        loginList.appendChild(loginItem);
    });
}

// Function to load activity logs
function loadActivityLogs() {
    const logList = document.getElementById('user-logs');
    logList.innerHTML = ''; // Clear existing logs

    activityLogs.forEach(log => {
        const logItem = document.createElement('li');
        logItem.innerHTML = `${log.time} - ${log.action} ${log.username ? 'by ' + log.username : ''}`;
        logList.appendChild(logItem);
    });
}

// Function to log user activity (action, username, and time)
function logActivity(action, username = null) {
    const log = {
        action,
        username,
        time: new Date().toLocaleString()
    };
    activityLogs.push(log);
    localStorage.setItem("activityLogs", JSON.stringify(activityLogs));
}

// Logout button functionality (record activity)
document.getElementById('logout-button').onclick = function() {
    logActivity('User logged out');
    alert("You have been logged out.");
    window.location.href = "../log-in/login.html";
};

// Function to fetch location data using ipinfo.io API
async function getLocationData() {
    const token = "YOUR_API_KEY"; // Replace with your ipinfo.io API token
    try {
        const response = await fetch(`https://ipinfo.io?token=17081137dcfe95`);
        if (!response.ok) throw new Error("Failed to fetch location data");
        const data = await response.json();
        return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            loc: data.loc,
            org: data.org,
            postal: data.postal,
            timezone: data.timezone
        };
    } catch (error) {
        console.error("Error fetching location data:", error);
        return {
            ip: "Unavailable",
            city: "Unavailable",
            region: "Unavailable",
            country: "Unavailable",
            loc: "Unavailable",
            org: "Unavailable",
            postal: "Unavailable",
            timezone: "Unavailable"
        };
    }
}

// Function to simulate user login and track IP address, device, and country
async function addLoginHistory(userEmail) {
    const time = new Date().toLocaleString();
    const locationData = await getLocationData();

    const loginEntry = {
        email: userEmail,
        time,
        ...locationData // Spread location data into this object
    };

    loginHistory.push(loginEntry);
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    logActivity(`User ${userEmail} logged in from ${locationData.city}, ${locationData.country}`, userEmail); // Log the login activity
}

// Example usage of login function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        addLoginHistory(user.email);
        logActivity('User logged in', user.email); // Record the login activity

        if (user.role === "admin") {
            alert("Welcome Admin Eliana!");
            window.location.href = "../log-in/admin/admin.html";
        } else {
            alert("Welcome User!");
            window.location.href = "../log-in/user/user.html";
        }
    } else {
        alert("This user is not in the database. Please sign up.");
    }
}

// Function to remove all activity logs
function removeAllActivityLogs() {
    activityLogs = [];
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
    loadActivityLogs(); // Reload the activity logs display
}

// Clear activity logs button functionality
document.getElementById('clear-user-logs-button').onclick = function() {
    if (confirm("Are you sure you want to clear all activity logs?")) {
        removeAllActivityLogs();
        alert("All activity logs have been cleared.");
    }
};

// Clear all login history functionality
document.getElementById('clear-login-history-button').onclick = function() {
    if (confirm("Are you sure you want to clear all login history?")) {
        loginHistory = [];
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
        loadLoginHistory();
        alert("All login history has been cleared.");
    }
};
