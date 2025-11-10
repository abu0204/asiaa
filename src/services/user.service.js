import TripModel from "../models/trip.model.js";
import DistrictJson from "../config/tamilnadu.json" with {type:"json"};
import tripConfig from "../config/trip.config.json" with {type:"json"};

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const { OSRM_API } = process.env;

function calculateDays(startDate, endDate) {
  console.log("startDate, endDate",startDate, endDate)
    let start = new Date(startDate);
    let end = new Date(endDate);
    let timeDifference = end - start;
    let daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference;
};
function convertTo12HourFormat(time24) {
  let [hours, minutes] = time24.split(":").map(Number);

  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};


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
      return { status: true, title: "tariff", pageName: "tariff" };
    } catch (error) {
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }

   async aboutService() {
    try {
      return { status: true, title: "about", pageName: "about" };
    } catch (error) {
      return {
        status: false,
        message: error.message ? error.message : "Internal Server Error!",
      };
    }
  }

     async contactService() {
    try {
      return { status: true, title: "contact", pageName: "contact" };
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
      const {fromLocation,toLocation,travelType,vehicleType,tripDate,returnDate,tripTime} = req_Body;
      const fromData = DistrictJson.find(location=>location.district === fromLocation.district);
      const toData = DistrictJson.find(location=>location.district === toLocation.district);

      const result = await axios.get(OSRM_API+`${fromData.lon},${fromData.lat};${toData.lon},${toData.lat}?overview=false`);
      const totalMeters = result.data.routes[0].distance;
      
      const tripMode = tripConfig[travelType];
      const vehicleDet = tripMode[vehicleType];
      const costPerKilometr = vehicleDet.costPerKilometer;
      const driverBata = vehicleDet.driverBata;
      const vehicle = vehicleType;
      const totalKiloMeter = totalMeters / 1000;
      const totalCost = totalKiloMeter * costPerKilometr;
      return {
        status:true,
        message:"success",
        data:{
          pickup:fromData.district,
          drop:toData.district,
          vehicle,
          driverBata,
          totalKiloMeter:parseInt(totalKiloMeter),
          costPerKilometr,
          totalCost,
          travelType,
          vehicleType,
          durationDays : travelType === "onewayTrip" ? 1 : calculateDays(tripDate,returnDate) ,
          dateAndTime : `${tripDate} , ${convertTo12HourFormat(tripTime)}`
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
      console.log({req_Body})
      const { name,email,mobile,pickup,drop,tripDate,tripTime,travelType,vehicleType} = req_Body;
      const pickupDistrict = JSON.parse(pickup).district;
      const dropDistrict = JSON.parse(drop).district;

      const fromData = DistrictJson.find(location=>location.district === pickupDistrict);
      const toData = DistrictJson.find(location=>location.district === dropDistrict);

      const result = await axios.get(OSRM_API+`${fromData.lon},${fromData.lat};${toData.lon},${toData.lat}?overview=false`);
      const totalMeters = result.data.routes[0].distance;

       const tripMode = tripConfig[travelType];
      const vehicleDet = tripMode[vehicleType];
      const costPerKilometr = vehicleDet.costPerKilometer;
      const driverBata = vehicleDet.driverBata;
      const totalKiloMeter = totalMeters / 1000;
      const totalCost = totalKiloMeter * costPerKilometr;
      const insertObj = {
        name,
        email,
        phoneNumber:mobile,
        pickup:pickupDistrict,
        drop : dropDistrict,
        date:new Date(tripDate),
        time:tripTime,
        travelType,
        vehicleType,
        driverBata,
        costPerKilometr,
        totalKiloMeter,
        totalCost
      };
      await TripModel.create(insertObj);
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