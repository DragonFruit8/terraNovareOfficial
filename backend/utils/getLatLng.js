import axios from "axios";
import dotenv from "dotenv";
 
dotenv.config();

const ORS_API_KEY = process.env.ORS_API_KEY;

// ✅ Convert ZIP code to Latitude & Longitude
export const getLatLng = async (zipcode) => {
  try {
    console.log(`📌 Looking up ZIP Code: ${zipcode}`);


    const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${zipcode},USA&boundary.country=US`;
    const response = await axios.get(url);

    console.log("📡 Geocode API Response:", response.data);

    if (response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates; // [lng, lat]
    } else {
      console.error(`❌ Invalid ZIP Code (No results): ${zipcode}`);
      return null;
    }
  } catch (error) {
    console.error("❌ Geocoding Error:", error.response?.data || error.message);
    return null;
  }
};