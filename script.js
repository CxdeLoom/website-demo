let currentUser = null;
let lists = {};
let currentList = null;

// Authentication
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("register-btn").addEventListener("click", register);

// Theme toggle
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", toggleTheme);

// View previous lists button
const viewPreviousBtn = document.getElementById("view-previous-btn");
viewPreviousBtn.addEventListener("click", showPreviousLists);

function toggleTheme() {
    document.body.classList.toggle("light");
    document.querySelector(".container").classList.toggle("light");
    themeToggleBtn.textContent = document.body.classList.contains("light") ? "Switch to Dark Theme" : "Switch to Light Theme";
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (email && password) {
        const storedLists = localStorage.getItem(email);
        if (storedLists) {
            currentUser = email;
            lists = JSON.parse(storedLists);
            loadUserLists();
        } else {
            alert("User not found. Please register.");
        }
    }
}

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        if (localStorage.getItem(email)) {
            alert("User already exists. Please log in.");
        } else {
            localStorage.setItem(email, JSON.stringify({ lists: {} }));
            alert("Registered successfully. You can log in now.");
        }
    }
}

// Load user lists
function loadUserLists() {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    lists = userData.lists || {};
    
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("selection-page").classList.remove("hidden");
    updateCreatedLists();
}

// Show previous lists
function showPreviousLists() {
    alert(JSON.stringify(lists, null, 2));
}

// Create new list
document.querySelectorAll(".list-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentList = btn.getAttribute("data-type");
        document.getElementById("list-title").textContent = `${currentList.charAt(0).toUpperCase() + currentList.slice(1)} List`;
        document.getElementById("selection-page").classList.add("hidden");
        document.getElementById("list-page").classList.remove("hidden");
        displayList();
    });
});

// Back button functionality
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("list-page").classList.add("hidden");
    document.getElementById("selection-page").classList.remove("hidden");
});

// Add item to list
document.getElementById("add-item-btn").addEventListener("click", addItem);

function addItem() {
    const itemInput = document.getElementById("item-input");
    const quantityInput = document.getElementById("item-quantity");
    const unitInput = document.getElementById("item-unit");
    const notesInput = document.getElementById("item-notes");

    if (itemInput.value && unitInput.value) {
        const item = {
            name: itemInput.value,
            quantity: `${quantityInput.value} ${unitInput.value}`,
            notes: notesInput.value || "",
            bought: false
        };
        
        if (!lists[currentList]) lists[currentList] = [];
        lists[currentList].push(item);
        itemInput.value = "";
        quantityInput.value = "";
        notesInput.value = "";
        unitInput.selectedIndex = 0;

        displayList();
        saveUserLists(); // Save to local storage
    }
}

// Display items in list
function displayList() {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    const items = lists[currentList] || [];
    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item"; // Set class for animations
        li.innerHTML = `
            <input type="checkbox" onchange="toggleItem(${index})" ${item.bought ? "checked" : ""}>
            ${item.name} (${item.quantity}) ${item.notes ? `- ${item.notes}` : ""}
            <button class="btn btn-danger btn-sm float-right" onclick="removeItem(${index})">Remove</button>
        `;
        itemList.appendChild(li);
    });
}

// Mark item as bought
function toggleItem(index) {
    const items = lists[currentList];
    items[index].bought = !items[index].bought;
    
    // Check if all items are bought
    if (items.every(item => item.bought)) {
        alert("All items bought! The list will be deleted.");
        delete lists[currentList]; // Remove the list
        saveUserLists(); // Save changes
        displayList(); // Update the display
        updateCreatedLists(); // Refresh the created lists
    } else {
        saveUserLists(); // Save after toggling
    }
}

// Remove item from list
function removeItem(index) {
    const items = lists[currentList];
    items.splice(index, 1);
    displayList();
    saveUserLists(); // Save after removal
}

// Save user lists to local storage
function saveUserLists() {
    const userData = { lists };
    localStorage.setItem(currentUser, JSON.stringify(userData)); // Save to local storage
    updateCreatedLists();
}

// Update created lists display
function updateCreatedLists() {
    const createdListsUl = document.getElementById("created-lists");
    createdListsUl.innerHTML = "";
    Object.keys(lists).forEach(type => {
        const li = document.createElement("li");
        li.className = "list-group-item"; // Bootstrap styling
        li.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        li.addEventListener("click", () => {
            currentList = type;
            document.getElementById("selection-page").classList.add("hidden");
            document.getElementById("list-page").classList.remove("hidden");
            displayList();
        });
        createdListsUl.appendChild(li);
    });
}

// Export list to CSV
document.getElementById("export-list-btn").addEventListener("click", exportList);

function exportList() {
    const items = lists[currentList] || [];
    const csvContent = "data:text/csv;charset=utf-8," + items.map(item => `${item.name},${item.quantity},${item.notes}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentList}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Feedback modal
document.getElementById("feedback-btn").addEventListener("click", () => {
    document.getElementById("feedback-modal").classList.remove("hidden");
});

document.getElementById("submit-feedback").addEventListener("click", () => {
    const feedback = document.getElementById("feedback-text").value;
    alert("Thank you for your feedback!");
    document.getElementById("feedback-modal").classList.add("hidden");
});

// Test and feedback loop
document.addEventListener("DOMContentLoaded", () => {
    console.log("User testing for the app has started.");
});
