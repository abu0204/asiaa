import TripModel from "../models/trip.model.js";
import DistrictJson from "../config/tamilnadu.json" with {type:"json"};
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const { OSRM_API } = process.env;
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
  };

  async getEstimationService(req_Body){
    try {
      const {fromLocation,toLocation} = req_Body;
      const fromData = DistrictJson.find(location=>location.district === fromLocation.district);
      const toData = DistrictJson.find(location=>location.district === toLocation.district);

      const result = await axios.get(OSRM_API+`${fromData.lon},${fromData.lat};${toData.lon},${toData.lat}?overview=false`);
      const totalMeters = result.data.routes[0].distance;
      const totalKiloMeter = totalMeters / 1000;
      return {
        status:true,
        message:"success",
        data:{
          km:totalKiloMeter
        }
      };
    } catch (error) {
       return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    };
  };

  async bookATrip (req_Body){
    try {
      
      

      await TripModel.create(req_Body);
      return {
        status:true,
        message:"Trip Booked!"
      }
    } catch (error) {
      console.error({bookATrip:error});
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }
};

export default new UserServices();