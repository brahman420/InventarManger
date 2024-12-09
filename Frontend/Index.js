// Select the form and message elements
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

// Add an event listener to handle form submission
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get the input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate inputs
    if (!username || !password) {
        message.textContent = "Alle felter skal udfyldes!";
        message.style.display = 'block';
        return;
    }

    // Prepare the data to send
    const data = {
        username: username,
        password: password
    };

    try {
        // Send a POST request to the backend API
        const response = await fetch('https://localhost:7165/api/LoginUser/LoginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Parse the JSON response
        const result = await response.json();

        if (response.ok) {
            // Login successful, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Display error message
            message.textContent = result.Message || "Brugernavn eller adgangskode er forkert.";
            message.style.color = 'red';
            message.style.display = 'block';
        }
    } catch (error) {
        console.error('Fejl:', error);
        message.textContent = "Der opstod en fejl. Prøv igen senere.";
        message.style.color = 'red';
        message.style.display = 'block';
    }
});
