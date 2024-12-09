document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('themeSelect');
    const categorySelect = document.getElementById('categorySelect');
    const itemsList = document.getElementById('itemsList');
    const addItemThemeSelect = document.getElementById('addItemThemeSelect');
    const addItemCategorySelect = document.getElementById('addItemCategorySelect');
    const newItemNameInput = document.getElementById('newItemName');
    const addItemButton = document.getElementById('addItemButton');

    // References for persons section
    const personsSection = document.getElementById('personsSection');
    const personsList = document.getElementById('personsList');

    // Store the currently selected item ID
    let selectedItemId = null;

    // Base URL for your API
    const baseUrl = 'https://localhost:7165';

    // Fetch themes for both display and add-item sections
    const fetchThemes = (targetSelect) => {
        fetch(`${baseUrl}/api/items/themes`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch themes');
                return response.json();
            })
            .then(themes => {
                if (Array.isArray(themes)) {
                    targetSelect.innerHTML = '<option value="">-- Select a Theme --</option>';
                    themes.forEach(theme => {
                        const option = document.createElement('option');
                        option.value = theme.themeID;
                        option.textContent = theme.themeName;
                        targetSelect.appendChild(option);
                    });
                } else {
                    console.error('Unexpected response format:', themes);
                }
            })
            .catch(error => console.error('Error fetching themes:', error));
    };

    fetchThemes(themeSelect);
    fetchThemes(addItemThemeSelect);

    // Fetch categories for a selected theme
    const fetchCategories = (themeId, targetSelect) => {
        targetSelect.innerHTML = '<option value="">-- Select a Category --</option>';
        if (!themeId) {
            targetSelect.disabled = true;
            return;
        }
        fetch(`${baseUrl}/api/items/themes/categories?themeId=${themeId}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch categories');
                return response.json();
            })
            .then(categories => {
                if (categories.length > 0) {
                    targetSelect.disabled = false;
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.categoryID;
                        option.textContent = category.categoryName;
                        targetSelect.appendChild(option);
                    });
                } else {
                    targetSelect.disabled = true;
                    alert('No categories found for the selected theme.');
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                alert('An error occurred while fetching categories.');
            });
    };

    themeSelect.addEventListener('change', () => {
        const themeId = themeSelect.value;
        fetchCategories(themeId, categorySelect);
        itemsList.innerHTML = '';
        selectedItemId = null;
        personsSection.style.display = 'none';
    });

    categorySelect.addEventListener('change', () => {
        const categoryId = categorySelect.value;
        itemsList.innerHTML = '';
        selectedItemId = null;
        personsSection.style.display = 'none';
        if (categoryId) {
            fetch(`${baseUrl}/api/items/categories/items?categoryId=${categoryId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch items');
                    return response.json();
                })
                .then(items => {
                    if (items.length > 0) {
                        items.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item.productName;
                            li.classList.add('selectable-item');

                            li.addEventListener('click', () => {
                                // Remove highlighting from previously selected item
                                const previouslySelected = itemsList.querySelector('.selected');
                                if (previouslySelected) {
                                    previouslySelected.classList.remove('selected');
                                }

                                // Highlight newly selected item
                                li.classList.add('selected');

                                // Store the selected item ID
                                selectedItemId = item.itemID;
                                console.log('Selected Item ID:', selectedItemId);

                                // Fetch and display persons now that an item is selected
                                fetchPersons();
                            });

                            itemsList.appendChild(li);
                        });
                    } else {
                        itemsList.innerHTML = '<li>No items found for the selected category.</li>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    alert('An error occurred while fetching items.');
                });
        }
    });

    // Fetch and display persons
    function fetchPersons() {
        fetch(`${baseUrl}/api/Person/GetAllPersons`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch persons');
                return response.json();
            })
            .then(persons => {
                personsList.innerHTML = '';
                if (Array.isArray(persons) && persons.length > 0) {
                    persons.forEach(person => {
                        const li = document.createElement('li');
                        li.textContent = person.name; // Use the 'Name' property
                        li.classList.add('selectable-person');

                        li.addEventListener('click', () => {
                            // Assign the selected item to this person
                            console.log(`Giving item ${selectedItemId} to person ${person.personID}`);
                            
                            fetch(`${baseUrl}/api/Person/GivePersonItem?personId=${person.personID}&itemId=${selectedItemId}`, {
                                method: 'POST' // Adjust if the API expects another method
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to assign item to person.');
                                }
                                alert(`Item (ID: ${selectedItemId}) successfully given to person (ID: ${person.personID}).`);
                            })
                            .catch(error => {
                                console.error('Error assigning item to person:', error);
                                alert('An error occurred while assigning the item. Please try again.');
                            });
                        });

                        personsList.appendChild(li);
                    });
                    personsSection.style.display = 'block';
                } else {
                    personsSection.style.display = 'none';
                    alert('No persons found.');
                }
            })
            .catch(error => {
                console.error('Error fetching persons:', error);
                alert('An error occurred while fetching persons.');
            });
    }

    addItemThemeSelect.addEventListener('change', () => {
        const themeId = addItemThemeSelect.value;
        fetchCategories(themeId, addItemCategorySelect);
    });

    addItemCategorySelect.addEventListener('change', () => {
        addItemButton.disabled = !addItemCategorySelect.value;
    });

    addItemButton.addEventListener('click', () => {
        const itemName = newItemNameInput.value.trim();
        const categoryId = addItemCategorySelect.value;

        if (!itemName || !categoryId) {
            alert('Please provide an item name and select a category.');
            return;
        }

        console.log(`Adding Item: ${itemName}, Category ID: ${categoryId}`);

        fetch(`${baseUrl}/api/items/add?categoryId=${categoryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: itemName,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add item.');
                }
                alert('Item added successfully!');
                newItemNameInput.value = '';
                addItemButton.disabled = true;
            })
            .catch(error => {
                console.error('Error adding item:', error);
                alert('An error occurred while adding the item. Please try again.');
            });
    });
});
