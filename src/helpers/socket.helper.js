import DriversModel from "../models/Drivers.js";
import BookingModel from "../models/Bookings.js";
let socket;
export const socketInitialize = (io) => {
  socket = io;
};

export const alertDriversForNewBookings = async () => {
  try {
    const bookingDet = await BookingModel.find({ status: "Approve" });
    socket.emit("new-booking", bookingDet);
  } catch (error) {
    console.error({ alertDriversForNewBookings: error });
  }
};