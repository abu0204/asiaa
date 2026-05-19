import Drivers from "../../models/Drivers.js";
import BookingModel from "../../models/Bookings.js";
import TripDetails from "../../models/TripDetails.js";
import {
  errorResponse,
  renderResponse,
  successResponse,
} from "../../helpers/response.helper.js";

class AdminPages {
  redirectPage = async (req, res) => {
    res.redirect("/admin/home");
  };
  login = async (req, res) => {
    try {
      const payload = {
        status: true,
        title: "Home",
        pageName: "admin/login",
        data: null,
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
  home = async (req, res) => {
    try {
      const payload = {
        status: true,
        title: "Home",
        pageName: "admin/home",
        data: null,
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
  drivers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || "";

      // Build search filter
      let searchFilter = {};
      if (searchQuery) {
        searchFilter = {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
          ]
        };
      }

      const [drivers, totalDrivers] = await Promise.all([
        Drivers.find(searchFilter)
          .populate("Documents")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Drivers.countDocuments(searchFilter)
      ]);

      const totalPages = Math.ceil(totalDrivers / limit);

      const payload = {
        status: true,
        title: "Drivers",
        pageName: "admin/drivers",
        data: drivers,
        pagination: {
          page,
          totalPages,
          searchQuery
        },
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      console.log({error})
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
  bookings = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || "";

      // Build search filter
      let searchFilter = {};
      if (searchQuery) {
        searchFilter = {
          $or: [
            { _id: { $regex: searchQuery, $options: "i" } }, // Allow searching by booking ID
            { name: { $regex: searchQuery, $options: "i" } },
            { mobile: { $regex: searchQuery, $options: "i" } },
            { pickup: { $regex: searchQuery, $options: "i" } },
            { drop: { $regex: searchQuery, $options: "i" } }
          ]
        };
      }

      const [bookings, totalBookings] = await Promise.all([
        BookingModel.find(searchFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        BookingModel.countDocuments(searchFilter)
      ]);

      const totalPages = Math.ceil(totalBookings / limit);

      const payload = {
        status: true,
        title: "Bookings",
        pageName: "admin/bookings",
        data: bookings,
        pagination: {
          page,
          totalPages,
          searchQuery
        }
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };

  trips = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || "";

      // Build search filter
      let searchFilter = {};
      if (searchQuery) {
        searchFilter = {
          $or: [
            { status: { $regex: searchQuery, $options: "i" } },
            { _id: { $regex: searchQuery, $options: "i" } }, // Allow searching by trip ID
          ]
        };
      }

      const [trips, totalTrips] = await Promise.all([
        TripDetails.find(searchFilter)
          .populate("driverId")
          .populate({
            path: "bookingId",
            select: "name mobile pickup drop status"
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        TripDetails.countDocuments(searchFilter)
      ]);

      const totalPages = Math.ceil(totalTrips / limit);

      const payload = {
        status: true,
        title: "Trips",
        pageName: "admin/trips",
        data: trips,
        pagination: {
          page,
          totalPages,
          searchQuery
        }
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      console.log({error});
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
  payments = async (req, res) => {
    try {
      const payload = {
        status: true,
        title: "payments",
        pageName: "admin/payments",
        data: [],
      };
      return renderResponse(req, res, payload);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
}

export default new AdminPages();
