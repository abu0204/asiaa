import Drivers from "../../models/Drivers.js";

export const approveDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID required" });
    }

    const driver = await Drivers.findByIdAndUpdate(
      driverId,
      { isApproved: true },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ 
      message: "Driver approved successfully",
      driver 
    });
  } catch (err) {
    console.error("Error approving driver:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const disapproveDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID required" });
    }

    const driver = await Drivers.findByIdAndUpdate(
      driverId,
      { isApproved: false },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ 
      message: "Driver disapproved successfully",
      driver 
    });
  } catch (err) {
    console.error("Error disapproving driver:", err);
    res.status(500).json({ message: "Server error" });
  }
};
