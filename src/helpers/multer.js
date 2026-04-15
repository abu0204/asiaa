import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fileFilter = (req, file, cb) => {
  const isValid = allowedTypes.includes(file.mimetype);
  cb(null, isValid);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

export const uploadDriverDocuments = upload.fields([
  { name: "car_photo", maxCount: 1 },
  { name: "register_certificate", maxCount: 1 },
  { name: "insurance", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "aadhaar", maxCount: 1 },
]);
