document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const usernameInput = document.querySelector("input[name='username']");
    const passwordInput = document.querySelector("input[name='password']");
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("custom-error-message", "text-center");
    errorMessage.style.display = "none";
    form.appendChild(errorMessage);

    form.addEventListener("submit", (event) => {
      errorMessage.style.display = "none";
      errorMessage.textContent = "";

      if (passwordInput.value.length < 3) {
        event.preventDefault(); 
        errorMessage.textContent = "Password must be more than 3 characters long.";
        errorMessage.style.display = "block";
      }
      if (usernameInput.value.length < 3) {
        event.preventDefault(); 
        errorMessage.textContent = "Username must be at least 3 characters long.";
        errorMessage.style.display = "block";
      }
        if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
            event.preventDefault(); 
            errorMessage.textContent = "Please enter both username and password.";
            errorMessage.style.display = "block";
        }
        if (usernameInput.value.trim() === "" && passwordInput.value.trim() !== "") {
            event.preventDefault(); 
            errorMessage.textContent = "Please enter a username.";
            errorMessage.style.display = "block";
        }
        if (passwordInput.value.trim() === "" && usernameInput.value.trim() !== "") {
            event.preventDefault(); 
            errorMessage.textContent = "Please enter a password.";
            errorMessage.style.display = "block";
        }
    });
  });
