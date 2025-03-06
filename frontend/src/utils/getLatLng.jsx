import axios from "axios";

const ORS_API_KEY = "5b3ce3597851110001cf6248fab46d1e370947f487ed216f7c710ced";

// ✅ Convert ZIP code to Latitude & Longitude
export const getLatLng = async (zipcode) => {
  try {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${zipcode}&boundary.country=US`;
    const response = await axios.get(url);

    if (response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates; // [lng, lat]
    } else {
      throw new Error("Invalid ZIP Code");
    }
  } catch (error) {
    console.error("❌ Geocoding Error:", error);
    return null;
  }
};

// ✅ Get driving distance between two ZIP codes
export const getZipDistance = async (zip1, zip2) => {
  try {
    const coords1 = await getLatLng(zip1);
    const coords2 = await getLatLng(zip2);
    if (!coords1 || !coords2) {
      console.error("❌ Missing coordinates for ZIPs");
      return null;
    }

    const response = await axios.post("http://localhost:9000/api/distance", { zip1, zip2 });
    console.log("🛰 API Response:", response.data);
    return response.data.distance; // ✅ Now using the backend API
  } catch (error) {
    console.error("❌ Distance API Error:", error.response?.data || error.message);
    return null;
  }
};

