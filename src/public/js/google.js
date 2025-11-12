let pickupPlace = null;
let dropPlace = null;
let totalKiloMeter = 0;

const allowedStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Puducherry",
];

const tripConfig = {
  onewayTrip: {
    minimumKilometer: 100,
    Sedan: { costPerKilometer: 12, driverBata: 400 },
    primeSeadan: { costPerKilometer: 13, driverBata: 400 },
    Suv: { costPerKilometer: 17.1, driverBata: 400 },
    primeSuv: { costPerKilometer: 18, driverBata: 400 },
  },
  roundTrip: {
    minimumKilometer: 250,
    Sedan: { costPerKilometer: 11.7, driverBata: 400 },
    primeSeadan: { costPerKilometer: 12, driverBata: 400 },
    Suv: { costPerKilometer: 15.3, driverBata: 400 },
    primeSuv: { costPerKilometer: 16.2, driverBata: 500 },
    toyotoInnova: { costPerKilometer: 17.1, driverBata: 500 },
  },
};

function initAutocomplete() {
  const pickupInput = document.getElementById("pickup");
  const dropInput = document.getElementById("drop");

  const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
    componentRestrictions: { country: "in" },
    fields: ["formatted_address", "geometry", "address_components"],
  });

  const dropAutocomplete = new google.maps.places.Autocomplete(dropInput, {
    componentRestrictions: { country: "in" },
    fields: ["formatted_address", "geometry", "address_components"],
  });

  pickupAutocomplete.addListener("place_changed", () => {
    const place = pickupAutocomplete.getPlace();
    if (!validateState(place, "pickup")) return;
    pickupPlace = place;
    if (pickupPlace && dropPlace) calculateDistance(pickupPlace, dropPlace);
  });

  dropAutocomplete.addListener("place_changed", () => {
    const place = dropAutocomplete.getPlace();
    if (!validateState(place, "drop")) return;
    dropPlace = place;
    if (pickupPlace && dropPlace) calculateDistance(pickupPlace, dropPlace);
  });
}

function validateState(place, type) {
  if (!place || !place.address_components) return false;

  let state = "";
  place.address_components.forEach((component) => {
    if (component.types.includes("administrative_area_level_1")) {
      state = component.long_name;
    }
  });

  if (!allowedStates.includes(state)) {
    alert(
      `Sorry, we only support locations in Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Puducherry.`
    );
    document.getElementById(type).value = "";
    if (type === "pickup") pickupPlace = null;
    else dropPlace = null;
    return false;
  }

  return true;
}

function calculateDistance(pickup, drop) {
  if (!pickup.geometry || !drop.geometry) {
    console.error("Missing geometry data.");
    return;
  }

  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [pickup.geometry.location],
      destinations: [drop.geometry.location],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    },
    (response, status) => {
      if (status === "OK") {
        const element = response.rows[0].elements[0];
        if (element.status === "OK") {
          const distanceKm = element.distance.value / 1000;
          totalKiloMeter = distanceKm;
        } else {
          console.warn("DistanceMatrix element error:", element.status);
        }
      } else {
        console.error("DistanceMatrixService failed:", status);
      }
    }
  );
}

function getEstimationService() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const pickup = document.getElementById("pickup").value.trim();
  const drop = document.getElementById("drop").value.trim();
  const tripDate = document.getElementById("trip-date").value;
  const returnDate = document.getElementById("return-date").value;
  const returnTime = document.getElementById("return-time").value;
  const tripTime = document.getElementById("trip-time").value.trim();
  const travelType = document.getElementById("travel-type").value.trim();
  const vehicleType = document.getElementById("vehicle-type").value.trim();

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
  // if (travelType === "roundTrip" && returnDate !== "") {
  //   if (new Date(tripDate).getTime() > new Date(returnDate).getTime()) {
  //     showToast("Return date should be grater than pickup date", "error");
  //     return;
  //   }
  // }
  if (travelType === "roundTrip" && returnTime === "") {
    showToast("Please choose your return time", "error");
    return;
  }
  if (vehicleType === "") {
    showToast("Please choose your vehicle type", "error");
    return;
  }
  if (name === "") {
    showToast("Please enter your full name", "error");
    return;
  }
  if (mobile === "") {
    showToast("Please enter your mobile number", "error");
    return;
  }

  if (!pickupPlace || !dropPlace) {
    alert("Please select valid pickup and drop locations.");
    return;
  }

  const fromLocation = pickupPlace.formatted_address;
  const toLocation = dropPlace.formatted_address;

  const tripMode = tripConfig[travelType];
  const vehicleDet = tripMode[vehicleType];
  const { costPerKilometer, driverBata } = vehicleDet;
  const minKm = tripMode.minimumKilometer;
  const totalKmFinal = Math.max(totalKiloMeter, minKm);
  const totalCost = totalKmFinal * costPerKilometer;

  const tripDetails = {
    status: true,
    data: {
      pickup: fromLocation,
      drop: toLocation,
      vehicle: vehicleType,
      driverBata,
      totalKiloMeter: parseInt(totalKmFinal),
      costPerKilometr: costPerKilometer,
      totalCost,
      travelType,
      durationDays:
        travelType === "onewayTrip" ? 1 : calculateDays(tripDate, returnDate),
      dateAndTime: `${tripDate}, ${convertTo12HourFormat(tripTime)}`,
    },
  };

  displayEstimation(tripDetails);
}

function displayEstimation(response) {
  const { status, data } = response;
  if (!status) return;

  const tripDate = document.getElementById("trip-date").value;
  const returnDate = document.getElementById("return-date").value;
  const returnTime = document.getElementById("return-time").value.trim();
  const travelType = document.getElementById("travel-type").value.trim();

  const totalDays = calculateDays(tripDate, returnDate);
  if (returnDate) {
    const travelDateTime = document.querySelector(
      "#estimate-output p:nth-child(3)"
    );

    let returnDateSection = document.getElementById("return-date-and-time");
    if (returnDateSection) {
      document.getElementById("return-date-time-value").textContent =
        returnDate;
    } else {
      travelDateTime.insertAdjacentHTML(
        "afterend",
        `<p id="return-date-and-time">
        <strong>Return Date & Time:</strong>
        <span id="return-date-time-value">${returnDate}, ${convertTo12HourFormat(
          returnTime
        )}</span>
      </p>`
      );
    }
  }
  const isPositive = totalDays - 3;
  const waitingCharges = isPositive ? isPositive * 250 : 0;
  document.getElementById("pickup-value").innerHTML = data.pickup;
  document.getElementById("drop-value").innerHTML = data.drop;
  document.getElementById("date-time-value").innerHTML = data.dateAndTime;
  document.getElementById("traveltype-value").innerHTML = data.travelType;
  document.getElementById("cartype-value").innerHTML = data.vehicle;
  document.getElementById("days-value").innerHTML = `${data.durationDays} Days`;
  document.getElementById("distance-value").innerHTML =
    travelType === "roundTrip" ? data.totalKiloMeter * 2 : data.totalKiloMeter;
  document.getElementById("km-per-value").innerHTML = data.costPerKilometr;
  document.getElementById("driver-batta-value").innerHTML =
    data.durationDays * data.driverBata;
  document.getElementById("fare-value").innerHTML = parseInt(data.totalCost);
  document.getElementById("total-value").innerHTML = parseInt(
    data.totalCost + data.driverBata + waitingCharges
  );
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

function calculateDays(start, end) {
  if (!start || !end) return 1;
  const diffTime = new Date(end) - new Date(start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

function convertTo12HourFormat(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

window.initAutocomplete = initAutocomplete;
