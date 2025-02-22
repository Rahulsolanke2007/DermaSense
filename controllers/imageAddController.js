// // controllers/imageController.js

// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const Image = require("../models/imageModel");
// const mongoose = require("mongoose");
// const cloudinary = require("cloudinary").v2;

// // Function to check if the file type is supported
// function isFileTypeSupported(type, supportedTypes) {
//   return supportedTypes.includes(type);
// }

// // Function to upload file to Cloudinary
// async function uploadFileToCloudinary(file, folder, quality) {
//   const options = { folder };
//   console.log("Temp file path:", file.tempFilePath);

//   if (quality) {
//     options.quality = quality;
//   }

//   options.resource_type = "auto";
//   return await cloudinary.uploader.upload(file.tempFilePath, options);
// }

// // Controller to add an image
// const addImage = async (req, res) => {
//   try {
//     const { age, sex, localization, address, coordinates } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized user" });
//     }

//     const post = req.user.id;
//     console.log("Extracted User ID:", post);

//     // Validate required fields
//     if (!age || !sex || !localization || !address || !coordinates) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if file exists
//     if (!req.files || !req.files.imageFile) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const file = req.files.imageFile;
//     console.log("Uploaded File:", file);

//     // Validate file type
//     const supportedTypes = ["jpg", "jpeg", "png"];
//     const fileType = file.name.split(".").pop().toLowerCase();

//     if (!isFileTypeSupported(fileType, supportedTypes)) {
//       return res.status(400).json({ success: false, message: "File format not supported" });
//     }

//     // Upload to Cloudinary
//     console.log("Uploading to Cloudinary...");
//     const cloudinaryResponse = await uploadFileToCloudinary(file, "DermaSense");
//     console.log("Cloudinary Response:", cloudinaryResponse);

//     // Create new image document
//     const newImage = new Image({
//       post: new mongoose.Types.ObjectId(post),
//       age,
//       sex,
//       localization,
//       address,
//       coordinates,
//       image: cloudinaryResponse.secure_url,
//     });

//     // Save image document to database
//     await newImage.save();

//     res.status(201).json({
//       success: true,
//       imageUrl: cloudinaryResponse.secure_url,
//       message: "Image successfully uploaded",
//       data: newImage,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to add image", details: error.message });
//   }
// };

// module.exports = { addImage };

// controllers/imageController.js


// controllers/imageController.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Image = require("../models/imageModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Function to check if the file type is supported
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

// Function to upload file to Cloudinary
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  console.log("Temp file path:", file.tempFilePath);

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Controller to add an image
const addImage = async (req, res) => {
  try {
    const { age, sex, localization, address, coordinates } = req.body;

    const post = req.user ? req.user.id : null;
    console.log("Extracted User ID:", post);

    // Check if file exists
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.imageFile;
    console.log("Uploaded File:", file);

    // Validate file type
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".").pop().toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({ success: false, message: "File format not supported" });
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const cloudinaryResponse = await uploadFileToCloudinary(file, "DermaSense");
    console.log("Cloudinary Response:", cloudinaryResponse);

    // Create new image document
    const newImageData = {
      age: age || null,
      sex: sex || null,
      localization: localization || null,
      address: address || null,
      coordinates: coordinates || null,
      image: cloudinaryResponse.secure_url,
    };

    if (post) {
      newImageData.post = new mongoose.Types.ObjectId(post);
    }

    const newImage = new Image(newImageData);

    // Save image document to database
    await newImage.save();

    res.status(201).json({
      success: true,
      imageUrl: cloudinaryResponse.secure_url,
      message: "Image successfully uploaded",
      data: newImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add image", details: error.message });
  }
};

module.exports = { addImage };

