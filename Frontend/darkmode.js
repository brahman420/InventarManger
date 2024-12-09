document.addEventListener('DOMContentLoaded', () => {

    // Dark Mode Toggle
    const toggleButton = document.getElementById('toggleTheme');

      // Dark Mode Toggle
      if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            toggleButton.textContent = document.body.classList.contains('dark-mode') 
                ? 'Switch to Light Mode' 
                : 'Switch to Dark Mode';
        });
    }
});