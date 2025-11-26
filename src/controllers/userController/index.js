import UserServices from "../../services/user.service.js";
import {
  errorResponse,
  renderResponse,
  successResponse,
} from "../../helpers/response.helper.js";
class UserController {
  async index(req, res) {
    try {
      const result = await UserServices.homeService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
  async home(req, res) {
    try {
      const result = await UserServices.homeService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
  async tariff(req, res) {
    try {
      const result = await UserServices.tariffService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
  async about(req, res) {
    try {
      const result = await UserServices.aboutService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  async contact(req, res) {
    try {
      const result = await UserServices.contactService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
  async terms(req, res) {
    try {
      const result = await UserServices.termsService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
  async privacy(req, res) {
    try {
      const result = await UserServices.privacyService(req);
      return renderResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  async contactForm(req, res) {
    try {
      const result = await UserServices.createContactFormService(req.body);
      return successResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  async getEstimation(req, res) {
    try {
      const result = await UserServices.getEstimationService(req.body);
      return successResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  async bookATrip(req, res) {
    try {
      const result = await UserServices.bookATrip(req.body);
      return successResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, {
        status: false,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
}
export default new UserController();
