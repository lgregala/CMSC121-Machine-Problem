document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.querySelector('input[type="password"]');
    const eyeToggle = document.querySelector(".toggle-password");
    
    // Check if elements exist before trying to use them
    if (passwordInput && eyeToggle) {
        // Hide eye toggle by default
        eyeToggle.style.display = "none";
        
        // Show/hide eye icon based on input
        passwordInput.addEventListener("input", function() {
            if (this.value.length > 0) {
                eyeToggle.style.display = "block";
            } else {
                eyeToggle.style.display = "none";
                // Reset to closed eye if field is empty
                this.type = "password";
                document.getElementById("eye-icon").classList.remove("fa-eye-slash");
                document.getElementById("eye-icon").classList.add("fa-eye");
            }
        });
        
        // Check if there's already text in the field ->
        if (passwordInput.value.length > 0) {
            eyeToggle.style.display = "block";
        }
    }
});

function togglePassword() {
    const toggleButton = document.querySelector(".toggle-password");
    const passwordInput = toggleButton.closest('.input-group').querySelector('input');
    const eyeIcon = document.getElementById("eye-icon");
    
    if (passwordInput && eyeIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        }
    }
}