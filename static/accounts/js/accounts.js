// accounts.js
document.addEventListener('DOMContentLoaded', function () {
    // Auto-focus on OTP input if present
    const otpInput = document.querySelector('input[name="code"]');
    if (otpInput) {
        otpInput.focus();
    }

    // Add simple animation to form inputs
    const inputs = document.querySelectorAll('.cyber-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
});
