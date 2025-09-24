// document.addEventListener("DOMContentLoaded", () => {
//   fetch("header.html")
//     .then((response) => {
//       if (!response.ok) throw new Error("Network response was not ok");
//       return response.text();
//     })
//     .then((data) => {
//       const container = document.getElementById("header-container");
//       container.innerHTML = data;

//       // ===== Initialize Navbar Toggle AFTER header is loaded =====
//       const navbarToggler = container.querySelector(".navbar-toggler");
//       if (navbarToggler) {
//         const togglerIcon = navbarToggler.querySelector(".toggler-icon");
//         const navbarCollapse = container.querySelector("#navbarNav");

//         if (navbarCollapse && togglerIcon) {
//           // Listen for Bootstrap collapse events
//           navbarCollapse.addEventListener("show.bs.collapse", () => {
//             togglerIcon.classList.add("active"); // menu opening → X
//           });
//           navbarCollapse.addEventListener("hide.bs.collapse", () => {
//             togglerIcon.classList.remove("active"); // menu closing → ☰
//           });
//         }
//       }
//     })
//     .catch((err) => console.error("Error loading header:", err));
// });

let fromLocation = null;
let toLocation = null;

const from = document.getElementById("pickup-district");
const to = document.getElementById("drop-district");

from.addEventListener("change", function () {
  fromLocation = JSON.parse(this.value);
});

to.addEventListener("change", function () {
  toLocation = JSON.parse(this.value);
});

function getEstimation() {
  try {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const pickup = document.getElementById("pickup-district").value.trim();
    const drop = document.getElementById("drop-district").value.trim();
    const tripDate = document.getElementById("trip-date").value;
    const tripTime = document.getElementById("trip-time").value.trim();
    const travelType = document.getElementById("travel-type").value.trim();
    const vehicleType = document.getElementById("vehicle-type").value.trim();

    if (name === "") {
      showToast("Please enter your full name", "error");
      return;
    }
    if (email === "") {
      showToast("Please enter your email", "error");
      return;
    }
    if (mobile === "") {
      showToast("Please enter your mobile number", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    if (pickup === "") {
      showToast("Please choose your pickup location", "error");
      return;
    }
    if (drop === "") {
      showToast("Please choose your drop location", "error");
      return;
    }
    if (tripDate === "") {
      showToast("Please shedule your trip date", "error");
      return;
    }
    if (tripTime === "") {
      showToast("Please shedule your trip time", "error");
      return;
    }
    if (travelType === "") {
      showToast("Please choose your travel type", "error");
      return;
    }
    if (vehicleType === "") {
      showToast("Please choose your vehicle type", "error");
      return;
    }

    if (fromLocation && toLocation) {
      if (fromLocation.district !== toLocation.district) {
        axios
          .post(window.origin + "/v1/users/get-estimation", {
            fromLocation,
            toLocation,
            travelType,
            vehicleType,
          })
          .then((response) => {
            console.log("Data:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
            showToast(error.message, "error");
          });
      } else {
        showToast("⚠️ Same district selected", "error");
      }
    }
  } catch (error) {
    console.log({ getEstimation: error });
    showToast("Something went wrong", "error");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("book-trip")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const pickup = document.getElementById("pickup-district").value.trim();
      const drop = document.getElementById("drop-district").value.trim();
      const tripDate = document.getElementById("trip-date").value;
      const tripTime = document.getElementById("trip-time").value.trim();
      const travelType = document.getElementById("travel-type").value.trim();
      const vehicleType = document.getElementById("vehicle-type").value.trim();

      if (name === "") {
        showToast("Please enter your full name", "error");
        return;
      }
      if (email === "") {
        showToast("Please enter your email", "error");
        return;
      }
      if (!isValidEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
      }
      if (mobile === "") {
        showToast("Please enter your mobile number", "error");
        return;
      }
      if (pickup === "") {
        showToast("Please choose your pickup location", "error");
        return;
      }
      if (drop === "") {
        showToast("Please choose your drop location", "error");
        return;
      }
      if (tripDate === "") {
        showToast("Please shedule your trip date", "error");
        return;
      }
      if (tripTime === "") {
        showToast("Please shedule your trip time", "error");
        return;
      }
      if (travelType === "") {
        showToast("Please choose your travel type", "error");
        return;
      }
      if (vehicleType === "") {
        showToast("Please choose your vehicle type", "error");
        return;
      }

      try {
        const response = await fetch("/v1/users/book-trip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile,
            pickup,
            drop,
            tripDate,
            tripTime,
            travelType,
            vehicleType,
          }),
        });

        const data = await response.json();
        if (data.status) {
          showToast(data.message, "success");
          document.getElementById("book-trip").reset();
        } else {
          showToast(data.message, "error");
        }
      } catch (err) {
        console.error("AJAX error:", err);
        alert("Something went wrong. Please try again later.");
      }
    });
});
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, toastType) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: "top", // or "top"
    position: "right", // left, center, or right
    backgroundColor: toastType === "success" ? "#28a745" : "#dc3545",
  }).showToast();
}
