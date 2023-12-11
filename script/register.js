const url = "http://localhost:9000";

document
  .getElementById("registerButton")
  .addEventListener("click", function (e) {
    e.preventDefault();

    const usernameInput = document.querySelector("#usernameInput").value;
    const emailInput = document.querySelector("#emailInput").value;
    const passwordInput = document.querySelector("#passwordInput").value;

    // Basic validation checks
    if (!usernameInput || !passwordInput || !emailInput) {
      alert("Please fill in all fields!");
      return;
    }

    if (!isValidUsername(usernameInput)) {
      alert("Invalid username format!");
      return;
    }

    if (!isValidEmail(emailInput)) {
      alert("Invalid email format!");
      return;
    }

    if (!isValidPassword(passwordInput)) {
      alert("Invalid password format!");
      return;
    }

    // Proceed with the fetch request if validation passes
    fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          window.location.href = "dashboard.html";
          return response.json();
        } else if (response.status === 400) {
          // Handle a bad request (status code 400)
          alert("Register failed!");
          throw new Error("Bad request");
        } else {
          alert("Call admin!");
          // Handle other status codes as needed
          throw new Error("Unexpected response");
        }
      })
      .then((data) => {
        // Save data to localStorage for a successful response
        localStorage.setItem("userId", data.data.userId);
      })
      .catch((error) => {
        document.querySelector("#usernameInput").value = "";
        document.querySelector("#emailInput").value = "";
        document.querySelector("#passwordInput").value = "";
      });
  });

// Function to validate the username format (you can customize it based on your requirements)
function isValidUsername(username) {
  // Example: Username must be at least 3 characters long
  return username.length >= 3;
}

// Function to validate the email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate the password format (you can customize it based on your requirements)
function isValidPassword(password) {
  // Example: Password must be at least 6 characters long
  return password.length >= 6;
}
