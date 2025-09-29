document.getElementById("travel-type").addEventListener("change", function () {
  const returnTimeContainer = document.getElementById("return-time-container");

  if (this.value === "roundTrip") {
    returnTimeContainer.style.display = "flex"; // show
    document.getElementById("return-date").setAttribute("required", true);
  } else {
    returnTimeContainer.style.display = "none"; // hide
    document.getElementById("return-date").removeAttribute("required");
  }
});

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
    const returnDate = document.getElementById("return-date").value;
    const tripTime = document.getElementById("trip-time").value.trim();
    const travelType = document.getElementById("travel-type").value.trim();
    const vehicleType = document.getElementById("vehicle-type").value.trim();

    if (name === "") {
      showToast("Please enter your full name", "error");
      return;
    }
    // if (email === "") {
    //   showToast("Please enter your email", "error");
    //   return;
    // }
    if (mobile === "") {
      showToast("Please enter your mobile number", "error");
      return;
    }
    // if (!isValidEmail(email)) {
    //   showToast("Please enter a valid email address", "error");
    //   return;
    // }
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
    if (tripDate !== "") {
      const currentDate = new Date();
      if (new Date(tripDate).getTime() < currentDate.getTime()) {
        showToast("Pickup date should be greater than current date", "error");
        return;
      }
    }
    if (travelType === "") {
      showToast("Please choose your travel type", "error");
      return;
    }
    if (travelType === "roundTrip" && returnDate === "") {
      showToast("Please choose your return date", "error");
      return;
    }
    if (travelType === "roundTrip" && returnDate !== "") {
      if (new Date(tripDate).getTime() > new Date(returnDate).getTime()) {
        showToast("Return date should be grater than pickup date", "error");
        return;
      }
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
            const { status, data } = response.data;
            if (status) {
              const {
                pickup,
                drop,
                costPerKilometr,
                driverBata,
                totalCost,
                totalKiloMeter,
                vehicle,
                travelType,
                vehicleType,
              } = data;
              document.getElementById("cartype-value").innerHTML = vehicle;
              document.getElementById("traveltype-value").innerHTML =
                travelType;
                document.getElementById("distance-value").innerHTML = totalKiloMeter;
                document.getElementById("pickup-value").innerHTML = pickup;
                document.getElementById("drop-value").innerHTML = drop;
                document.getElementById("fare-value").innerHTML = totalCost;
            }
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
      const returnDate = document.getElementById("return-date").value;
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
      if (tripDate !== "") {
        const currentDate = new Date();
        if (new Date(tripDate).getTime() < currentDate.getTime()) {
          showToast("Pickup date should be greater than current date", "error");
          return;
        }
      }
      if (travelType === "") {
        showToast("Please choose your travel type", "error");
        return;
      }
      if (travelType === "roundTrip" && returnDate === "") {
        showToast("Please choose your return date", "error");
        return;
      }
      if (travelType === "roundTrip" && returnDate !== "") {
        if (new Date(tripDate).getTime() > new Date(returnDate).getTime()) {
          showToast("Return date should be grater than pickup date", "error");
          return;
        }
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
            returnDate,
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
    duration: toastType === "success" ? 2000 : 4000,
    gravity: "top", // or "top"
    position: "right", // left, center, or right
    backgroundColor: toastType === "success" ? "#28a745" : "#dc3545",
  }).showToast();
}
