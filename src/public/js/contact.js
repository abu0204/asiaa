document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // ---- VALIDATION ----
    if (!name) return showToast("Please enter your name");
    if (!email || !email.includes("@"))
      return showToast("Please enter a valid email");
    if (!message) return showToast("Please enter your message");
    if (!phone) return showToast("Please enter your phone number");
    if (!subject) return showToast("Please enter subject");
    // ---- API CALL ----
    try {
      const response = await fetch("/v1/users/submit-contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Application Submitted Successfully!", "success");
        document.getElementById("contactForm").reset();
      } else {
        showToast("Something Wrong");
      }
    } catch (err) {
      console.error(err);
    }
  });
function showToast(message, toastType = "error") {
  Toastify({
    text: message,
    duration: toastType === "success" ? 2000 : 4000,
    gravity: "top", // or "top"
    position: "right", // left, center, or right
    backgroundColor: toastType === "success" ? "#28a745" : "#dc3545",
  }).showToast();
}
