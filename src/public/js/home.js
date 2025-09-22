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
  checkLocations();
});

to.addEventListener("change", function () {
  toLocation = JSON.parse(this.value);
  checkLocations();
});

function checkLocations() {
  if (fromLocation && toLocation) {
    if (fromLocation.district !== toLocation.district) {
      axios
        .post(window.origin + "/v1/users/get-estimation", {
          fromLocation,
          toLocation,
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
}

function bookATrip() {
  try {
    if (fromLocation && toLocation) {
      if (fromLocation.district !== toLocation.district) {
        axios
          .post(window.origin + "/v1/users/book-a-trip", {
            fromLocation,
            toLocation,
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
    console.error({ bookATrip: error });
  }
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
