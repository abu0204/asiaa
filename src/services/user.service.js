import ContactModel from "../models/contact.model.js";

class UserServices {
  async homeService() {
    try {
      return { status: true, title: "Home", pageName: "home" };
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
      const createdData = await ContactModel.create(req_Body);
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
