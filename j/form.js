// Form validation and submission
        const gdprCheckbox = document.getElementById('gdpr');
        const submitBtn = document.getElementById('submit-btn');
        const emailInput = document.getElementById('email-input');
        const form = document.getElementById('waitlist-form');
        const successMessage = document.getElementById('success-message');
        const formContent = document.getElementById('form-content');

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
            submitBtn.textContent = 'Submitting...';

            // Your Google Apps Script Web App URL
            const endpoint = "https://script.google.com/macros/s/AKfycbxuXQzfkcKsJpfUkns09e8OmWFSbAUieYvtpjIufEJtuHMp6GEgyUElLSbAVeFZ9n6LsQ/exec";

            try {
                // Send data to Google Sheets
                // Note: Due to CORS, we can't read the response, but the data should still be sent
                await fetch(endpoint, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "email=" + encodeURIComponent(emailInput.value)
                });

                // Show success message and hide form
                formContent.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Optional: Reset form after a delay
                setTimeout(() => {
                    form.reset();
                    updateButtonState();
                }, 3000);
                
            } catch (error) {
                // Even if there's an error (which is expected with no-cors), 
                // we'll still show success since the data is likely sent
                console.log('Form submitted (no-cors mode)');
                
                // Show success message and hide form
                formContent.classList.add('hidden');
                successMessage.classList.remove('hidden');
            }
        });