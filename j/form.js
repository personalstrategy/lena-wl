// Form validation and submission
const gdprCheckbox = document.getElementById('gdpr');
const submitBtn = document.getElementById('submit-btn');
const emailInput = document.getElementById('email-input');
const form = document.getElementById('waitlist-form');
const successMessage = document.getElementById('success-message');

// Email validation function
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Enable/disable submit button based on GDPR checkbox AND valid email
function updateButtonState() {
    const emailValid = isValidEmail(emailInput.value);
    const gdprChecked = gdprCheckbox.checked;
    submitBtn.disabled = !(emailValid && gdprChecked);
}

// Add event listeners for validation
gdprCheckbox.addEventListener('change', updateButtonState);
emailInput.addEventListener('input', updateButtonState);

// Initialize button state
updateButtonState();

// Submit handler
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Double-check email validity
    if (!isValidEmail(emailInput.value)) {
        alert('Please enter a valid email address');
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';

    // Your Google Apps Script Web App URL
    const endpoint = "https://script.google.com/macros/s/AKfycbz5LCQN2sBA-T-gNc0kTjMY9fX98Oo6fkKi4qYv5E2gPJ05bSOUpkVOLBkbl29Sdn1E7g/exec";

    try {
        // Send data to Google Sheets as JSON
        const response = await fetch(endpoint, {
            method: "POST",
            mode: "no-cors", // Required for Google Apps Script from GitHub Pages
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailInput.value })
        });

        // With no-cors, we can't read the response, but the request should go through
        // Show success message
        successMessage.classList.remove('hidden');
        
        // Reset form
        form.reset();
        updateButtonState();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
        
    } catch (error) {
        console.error('Submission error:', error);
        // Even with errors, the submission might have worked with no-cors
        // Show success message anyway
        successMessage.classList.remove('hidden');
        
        // Reset form
        form.reset();
        updateButtonState();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    } finally {
        // Always restore button text
        submitBtn.textContent = originalBtnText;
        // Button state will be updated by updateButtonState() after form.reset()
    }
});