"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
(async function () {
    // Configuration
    cloudinary_1.v2.config({
        cloud_name: "dpsixqarm",
        api_key: "811873658523129",
        api_secret: "7yc-AU84fvPbYj6UzciNX_Md3ck", // Click 'View API Keys' above to copy your API secret
    });
    // Upload an image
    const uploadResult = await cloudinary_1.v2.uploader
        .upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
        public_id: "shoes",
    })
        .catch((error) => {
        console.log(error);
    });
    console.log(uploadResult);
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary_1.v2.url("shoes", {
        fetch_format: "auto",
        quality: "auto",
    });
    console.log(optimizeUrl);
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary_1.v2.url("shoes", {
        crop: "auto",
        gravity: "auto",
        width: 500,
        height: 500,
    });
    console.log(autoCropUrl);
})();
//# sourceMappingURL=cloudinary.js.map