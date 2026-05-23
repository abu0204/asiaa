import mongoose from "mongoose";
import Drivers from "../../models/Drivers.js";
import BookingModel from "../../models/Bookings.js";
import TripDetails from "../../models/TripDetails.js";
import ContactModel from "../../models/ContactForm.js";
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
      console.log({ error })
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
        const orConditions = [
          { name: { $regex: searchQuery, $options: "i" } },
          { mobile: { $regex: searchQuery, $options: "i" } },
          { pickup: { $regex: searchQuery, $options: "i" } },
          { drop: { $regex: searchQuery, $options: "i" } }
        ];

        // Check if search query is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(searchQuery)) {
          orConditions.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
        }

        searchFilter = { $or: orConditions };
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
      console.log({ error });
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
  contacts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const data = await ContactModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const payload = {
        status: true,
        title: "Contacts",
        pageName: "admin/contacts",
        data: data,
        pagination: {
          page,
          totalPages: Math.ceil(await ContactModel.countDocuments() / limit)
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

      let searchFilter = {};
      if (searchQuery) {
        const orConditions = [
          { status: { $regex: searchQuery, $options: "i" } }
        ];
        if (mongoose.Types.ObjectId.isValid(searchQuery)) {
          orConditions.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
          orConditions.push({ bookingId: new mongoose.Types.ObjectId(searchQuery) });
        }
        searchFilter = { $or: orConditions };
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
      console.log({ error });
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

  getDashboardStats = async (req, res) => {
    try {
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Parallel queries for all stats
      const [totalUsers, activeDrivers, todayBookings, todayTrips, last7DaysEarnings, last6MonthsEarnings, last5YearsEarnings] = await Promise.all([
        Drivers.countDocuments(), // Total users who made bookings
        Drivers.countDocuments({ isOnline: true }), // Active/verified drivers
        BookingModel.find({
          createdAt: { $gte: today, $lt: tomorrow }
        }).lean(), // Today's bookings
        TripDetails.countDocuments({
          createdAt: { $gte: today, $lt: tomorrow }
        }), // Today's trips
        BookingModel.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%a", date: "$createdAt" }
              },
              total: { $sum: { $toDouble: "$totalVal" } }
            }
          },
          { $sort: { "_id": 1 } }
        ]),
        BookingModel.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%b", date: "$createdAt" }
              },
              total: { $sum: { $toDouble: "$totalVal" } }
            }
          },
          { $sort: { "_id": 1 } }
        ]),
        BookingModel.aggregate([
          {
            $group: {
              _id: { $year: "$createdAt" },
              total: { $sum: { $toDouble: "$totalVal" } }
            }
          },
          { $sort: { "_id": 1 } }
        ])
      ]);

      // Calculate today's earnings
      const todayEarnings = todayBookings.reduce((sum, booking) => {
        return sum + (parseFloat(booking.totalVal) || 0);
      }, 0);

      // Format chart data
      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dayValues = new Array(7).fill(0);
      last7DaysEarnings.forEach(item => {
        const dayIndex = dayLabels.findIndex(label => label === item._id);
        if (dayIndex !== -1) dayValues[dayIndex] = Math.round(item.total);
      });

      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthValues = new Array(6).fill(0);
      last6MonthsEarnings.forEach(item => {
        const monthIndex = monthLabels.findIndex(label => label === item._id);
        if (monthIndex !== -1) monthValues[monthIndex] = Math.round(item.total);
      });

      const yearLabels = [];
      const yearValues = [];
      last5YearsEarnings.forEach(item => {
        yearLabels.push(item._id.toString());
        yearValues.push(Math.round(item.total));
      });

      const payload = {
        status: true,
        data: {
          stats: {
            totalUsers: totalUsers,
            activeDrivers: activeDrivers,
            todayEarnings: Math.round(todayEarnings),
            todayTrips: todayTrips
          },
          chartData: {
            day: {
              labels: dayLabels,
              values: dayValues
            },
            month: {
              labels: monthLabels.slice(0, 6),
              values: monthValues
            },
            year: {
              labels: yearLabels,
              values: yearValues
            }
          }
        }
      };

      return res.json(payload);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  };
}

export default new AdminPages();
