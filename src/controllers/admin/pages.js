import Drivers from "../../models/Drivers.js";
import BookingModel from "../../models/Bookings.js";
import {
  errorResponse,
  renderResponse,
  successResponse,
} from "../../helpers/response.helper.js";

class AdminPages {
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
      const drivers = await Drivers.find().sort({ createdAt: -1 }).lean();
      const payload = {
        status: true,
        title: "Home",
        pageName: "admin/drivers",
        data: drivers,
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
  bookings = async (req, res) => {
    try {
      const drivers = await BookingModel.find().sort({ createdAt: -1 }).lean();
      const payload = {
        status: true,
        title: "Home",
        pageName: "admin/bookings",
        data: drivers,
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
  bookingDet = async (req, res) => {
    try {
      const bookingData = await BookingModel.findById(
        req.params.bookingId
      ).lean();

      if (!bookingData) {
        return errorResponse(req, res, {
          status: false,
          message: "Trip not found",
        });
      }

      return successResponse(req, res, { data: bookingData });
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
