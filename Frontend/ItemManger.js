// Dark Mode Toggle
const toggleThemeButton = document.getElementById('toggleTheme');
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleThemeButton.textContent = document.body.classList.contains('dark-mode') 
        ? 'Switch to Light Mode' 
        : 'Switch to Dark Mode';
});

// Global variable to store selected item
let selectedItem = null;

// Fetch items from the API and populate the left panel
async function fetchItems() {
    const url = 'https://localhost:7165/api/items/GetItemsInUse';
    const leftPanel = document.getElementById('left-panel');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const items = await response.json();

        // Clear the panel before adding items
        leftPanel.innerHTML = '<ul></ul>';
        const list = leftPanel.querySelector('ul');

        // Populate the left panel with fetched items
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.productName; // Use productName from API
            listItem.dataset.itemId = item.itemID; // Use itemID from API
            listItem.classList.add('selectable-item');

            // Add click event to select the item
            listItem.addEventListener('click', () => selectItem(item));

            list.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        leftPanel.innerHTML = '<p>Kunne ikke hente items.</p>'; // Danish error message
    }
}

// Fetch category and theme for a selected item and display them
async function fetchItemInfo(itemID) {
    const url = `https://localhost:7165/api/items/GetItemInfo?itemID=${itemID}`;
    const itemNameElement = document.getElementById('item-name');
    const itemCategoryElement = document.getElementById('item-category');
    const itemThemeElement = document.getElementById('item-theme');

    try {
        const response = await fetch(url); // Fetch data from the API
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const itemInfoArray = await response.json(); // Parse the JSON response

        // Ensure the array is not empty
        if (itemInfoArray.length === 0) {
            throw new Error('Empty item info array');
        }

        const itemInfo = itemInfoArray[0]; // Extract the first object

        // Update the right panel with the item details
        itemNameElement.textContent = selectedItem.productName; // The name of the item
        itemCategoryElement.textContent = `Kategori: ${itemInfo.categoryName}`;
        itemThemeElement.textContent = `Tema: ${itemInfo.themeName}`;
    } catch (error) {
        console.error('Error fetching item info:', error);
        itemNameElement.textContent = 'Kunne ikke hente item information'; // Danish error message
        itemCategoryElement.textContent = '';
        itemThemeElement.textContent = '';
    }
}

// Fetch the person who uses the selected item and display their name and email
async function fetchPersonName(itemID) {
    const url = `https://localhost:7165/api/Person/GetPersonByitem?itemId=${itemID}`;
    const personNameElement = document.getElementById('item-person');
    const personEmailElement = document.getElementById('item-email');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const personData = await response.json();

        // If the endpoint returns an array:
        if (Array.isArray(personData) && personData.length > 0) {
            const personInfo = personData[0];
            personNameElement.textContent = `Person: ${personInfo.name}`;
            personEmailElement.textContent = `Email: ${personInfo.email}`;
        } 
        // If the endpoint returns a single object:
        else if (personData && personData.name) {
            personNameElement.textContent = `Person: ${personData.name}`;
            personEmailElement.textContent = `Email: ${personData.email ?? 'Ingen'}`;
        } else {
            // If no data returned
            personNameElement.textContent = 'Person: Ingen';
            personEmailElement.textContent = 'Email: Ingen';
        }
    } catch (error) {
        console.error('Error fetching person info:', error);
        personNameElement.textContent = 'Kunne ikke hente person information';
        personEmailElement.textContent = '';
    }
}

// Select an item and store it for later use
function selectItem(item) {
    selectedItem = item; // Store the selected item

    // Fetch and display additional details
    fetchItemInfo(item.itemID);
    fetchPersonName(item.itemID);
}

// Initialize the script
fetchItems();
