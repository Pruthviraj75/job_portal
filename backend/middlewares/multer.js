import multer from "multer"

const storage = multer.memoryStorage();
// export const singleUpload = multer({storage}).single("file");
export const singleUpload = multer({ storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]);