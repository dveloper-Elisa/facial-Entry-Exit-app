const button = document.getElementById("btn");
const uname = document.getElementById("name");
const pwd = document.getElementById("password");
const messageSpan = document.getElementById("login-message"); // Assuming you have a <span id="login-message"></span>

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const Sname = uname.value.trim();
  const password = pwd.value.trim();

  if (!Sname || !password) {
    messageSpan.textContent = "Please fill in all fields.";
    messageSpan.style.color = "red";
    return;
  }

  // Show a loading state
  button.textContent = "Logging in...";
  button.disabled = true;

  try {
    const response = await fetch("/security/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Sname, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      messageSpan.textContent = "Login successful!";
      messageSpan.style.color = "green";

      const logs = {
        name: data.security.name,
        email: data.security.email,
        id: data.security._id,
      };

      localStorage.setItem(
        "sec",
        JSON.stringify({
          name: data.security.name,
          email: data.security.email,
          id: data.security._id,
        })
      );
      // You can redirect to another page or do another action
      window.location.href = "/Sdashboard.html";
    } else {
      messageSpan.textContent = "";
      data.message || "Login failed. Please try again.";
      messageSpan.style.color = "red";
    }
  } catch (error) {
    console.error("Login error:", error.message);
    messageSpan.textContent =
      "An error occurred during login. Please try again.";
    messageSpan.style.color = "red";
  } finally {
    // Reset the button state
    button.textContent = "Login";
    button.disabled = false;
  }
});
