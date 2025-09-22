import TripModel from "../models/trip.model.js";
import DistrictJson from "../config/tamilnadu.json" with {type:"json"}
class UserServices {
  async homeService() {
    try {
      const data = DistrictJson;
      return { status: true, title: "Home", pageName: "home", data: data };
    } catch (error) {
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }
  async tariffService() {
    try {
      return { status: true, title: "careers", pageName: "careers" };
    } catch (error) {
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }

  async createContactFormService(req_Body) {
    try {
      const createdData = await TripModel.create(req_Body);
      return {
        status: true,
        message: "Submitted Successfully",
        code: 201,
        data: createdData,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }
}

export default new UserServices();
