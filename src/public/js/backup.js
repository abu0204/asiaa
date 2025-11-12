// let fromLocation = null;
// let toLocation = null;

// const from = document.getElementById("pickup-district");
// const to = document.getElementById("drop-district");

// from.addEventListener("change", function () {
//   fromLocation = JSON.parse(this.value);
// });

// to.addEventListener("change", function () {
//   toLocation = JSON.parse(this.value);
// });

// function getEstimation() {
//   try {
//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const mobile = document.getElementById("mobile").value.trim();
//     const pickup = document.getElementById("pickup-district").value.trim();
//     const drop = document.getElementById("drop-district").value.trim();
//     const tripDate = document.getElementById("trip-date").value;
//     const returnDate = document.getElementById("return-date").value;
//     const tripTime = document.getElementById("trip-time").value.trim();
//     const travelType = document.getElementById("travel-type").value.trim();
//     const vehicleType = document.getElementById("vehicle-type").value.trim();

//     if (name === "") {
//       showToast("Please enter your full name", "error");
//       return;
//     }
//     if (mobile === "") {
//       showToast("Please enter your mobile number", "error");
//       return;
//     }
//     if (pickup === "") {
//       showToast("Please choose your pickup location", "error");
//       return;
//     }
//     if (drop === "") {
//       showToast("Please choose your drop location", "error");
//       return;
//     }
//     if (tripDate === "") {
//       showToast("Please shedule your trip date", "error");
//       return;
//     }
//     if (tripTime === "") {
//       showToast("Please shedule your trip time", "error");
//       return;
//     }
//     if (tripDate !== "") {
//       const currentDate = new Date();
//       if (new Date(tripDate).getTime() < currentDate.getTime()) {
//         showToast("Pickup date should be greater than current date", "error");
//         return;
//       }
//     }
//     if (travelType === "") {
//       showToast("Please choose your travel type", "error");
//       return;
//     }
//     if (travelType === "roundTrip" && returnDate === "") {
//       showToast("Please choose your return date", "error");
//       return;
//     }
//     if (travelType === "roundTrip" && returnDate !== "") {
//       if (new Date(tripDate).getTime() > new Date(returnDate).getTime()) {
//         showToast("Return date should be grater than pickup date", "error");
//         return;
//       }
//     }
//     if (vehicleType === "") {
//       showToast("Please choose your vehicle type", "error");
//       return;
//     }

//     if (fromLocation && toLocation) {
//       if (fromLocation.district !== toLocation.district) {
//         axios
//           .post(window.origin + "/v1/users/get-estimation", {
//             fromLocation,
//             toLocation,
//             travelType,
//             vehicleType,
//             tripTime,
//             tripDate,
//             returnDate,
//           })
//           .then((response) => {
//             const { status, data } = response.data;
//             if (status) {
//               const {
//                 pickup,
//                 drop,
//                 costPerKilometr,
//                 driverBata,
//                 totalCost,
//                 totalKiloMeter,
//                 vehicle,
//                 travelType,
//                 durationDays,
//                 dateAndTime,
//               } = data;
//               document.getElementById("pickup-value").innerHTML = pickup;
//               document.getElementById("drop-value").innerHTML = drop;
//               document.getElementById("date-time-value").innerHTML =
//                 dateAndTime;
//               document.getElementById("traveltype-value").innerHTML =
//                 travelType;
//               document.getElementById("cartype-value").innerHTML = vehicle;

//               document.getElementById(
//                 "days-value"
//               ).innerHTML = `${durationDays} Days`;
//               document.getElementById("distance-value").innerHTML =
//                 totalKiloMeter;
//               document.getElementById("km-per-value").innerHTML =
//                 costPerKilometr;
//               document.getElementById("driver-batta-value").innerHTML =
//                 driverBata;
//               document.getElementById("fare-value").innerHTML =
//                 parseInt(totalCost);
//               document.getElementById("total-value").innerHTML = parseInt(
//                 totalCost + driverBata
//               );
//             }
//           })
//           .catch((error) => {
//             console.error("Error:", error);
//             showToast(error.message, "error");
//           });
//       } else {
//         showToast("⚠️ Same district selected", "error");
//       }
//     }
//   } catch (error) {
//     console.log({ getEstimation: error });
//     showToast("Something went wrong", "error");
//   }
// }