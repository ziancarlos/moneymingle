const url = "http://localhost:9000";

const userId = localStorage.getItem("userId");

if (userId !== null) {
  fetch(`${url}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Handle a successful response
        return response.json();
      } else if (response.status === 400) {
        // Handle a bad request (status code 400)
        window.location.href = "login.html";

        alert("Session telah berakhir!");

        throw new Error("Bad request");
      } else if (response.status === 401 || response.status === 403) {
        // Unauthorized or Forbidden, redirect to login

        window.location.href = "login.html";

        alert("Session expired or unauthorized access!");
      } else {
        // Handle other status codes as needed

        window.location.href = "login.html";

        alert("Call admin!");

        throw new Error("Unexpected response");
      }
    })
    .then((data) => {})
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });
} else {
  // The item with the key "userId" is not present in localStorage
  alert("Session is ended!");
  // Redirect to login page if user ID is not present
  window.location.href = "login.html";
}
