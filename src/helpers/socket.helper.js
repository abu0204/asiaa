import BookingModel from "../models/Bookings.js";
import notification from '../helpers/notification.js';
let socket;
export const socketInitialize = (io) => {
  socket = io;
};

export const alertDriversForNewBookings = async () => {
  try {
    const bookingDet = await BookingModel.find({ status: "Approve" });
    socket.emit("new-booking", bookingDet);
    const message = {
      notification: {
        title: "🚖 New Ride Request",
        body: "A new booking is available now. Accept it before another driver does!",
      },
      topic: "allUsers",
    };

    notification.messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent:", response);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error({ alertDriversForNewBookings: error });
  }
};
