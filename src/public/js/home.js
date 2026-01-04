document.getElementById("travel-type").addEventListener("change", function () {
  const returnTimeContainer = document.getElementById("return-time-container");

  if (this.value === "roundTrip") {
    returnTimeContainer.style.display = "flex"; // show
    document.getElementById("return-date").setAttribute("required", true);
    document.getElementById("return-time").setAttribute("required", true);
    const vehicleTypeValues = document.getElementById("vehicle-type");
    const option = document.createElement("option");
    option.value = "toyotoInnova";
    option.textContent = "TOTOTA CRYSTA";
    vehicleTypeValues.appendChild(option);
  } else {
    returnTimeContainer.style.display = "none"; // hide
    document.getElementById("return-date").removeAttribute("required");
    document.getElementById("return-time").removeAttribute("required");
    const vehicleTypeValues = document.getElementById("vehicle-type");
    const innovaOption = vehicleTypeValues.querySelector(
      'option[value="toyotoInnova"]'
    );
    if (innovaOption) {
      innovaOption.remove();
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("trip-date").setAttribute("min", today);
  document.getElementById("return-date").setAttribute("min", today);
});
const bookTrip = async () => {
  try {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const pickup = document.getElementById("pickup-value").innerText;
    const drop = document.getElementById("drop-value").innerText;
    const dateTime = document.getElementById("date-time-value").innerText;
    const returnDateTime =
      document.getElementById("return-date-time-value")?.innerText || "";
    const travelType = document.getElementById("traveltype-value").innerText;
    const vehicleType = document.getElementById("cartype-value").innerText;
    const days = document.getElementById("days-value").innerText;
    const distanceVal = document.getElementById("distance-value").innerText;
    const kilometerPerVal = document.getElementById("km-per-value").innerText;
    const driverBata = document.getElementById("driver-batta-value").innerText;
    const fareVal = document.getElementById("fare-value").innerText;
    const totalVal = document.getElementById("total-value").innerText;

    if (
      !name ||
      !mobile ||
      !pickup ||
      !drop ||
      !dateTime ||
      !travelType ||
      !vehicleType ||
      !days ||
      !distanceVal ||
      !kilometerPerVal ||
      !driverBata ||
      !fareVal ||
      !totalVal
    ) {
      showToast("Get your Estimation to Continue!", "error");
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
          dateTime,
          returnDateTime,
          travelType,
          vehicleType,
          days,
          distanceVal,
          kilometerPerVal,
          driverBata,
          fareVal,
          totalVal,
        }),
      });

      const data = await response.json();
      if (data.status) {
        var myModal = new bootstrap.Modal(
          document.getElementById("successModal")
        );
        // myModal.show();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      console.error("AJAX error:", err);
      alert("Something went wrong. Please try again later.");
    }
  } catch (error) {
    console.error({ bookTrip: error });
  }
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function refresh() {
  setTimeout(() => {
    window.location.reload();
  }, 1000);
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
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 50; // Lower = faster

  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const suffix = counter.innerText.includes("%")
        ? "%"
        : counter.innerText.includes("+")
        ? "+"
        : "";
      let count = 0;

      const updateCount = () => {
        const increment = Math.ceil(target / speed);
        if (count < target) {
          count += increment;
          counter.innerText = count + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  };

  // Trigger animation when section is visible
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect(); // run only once
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(document.querySelector(".stats-section"));
});
