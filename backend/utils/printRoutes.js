import expressListEndpoints from "express-list-endpoints";


const printRoutes = (app) => {
    // console.log("📌 API Routes:");
    expressListEndpoints(app).forEach((route) => {
        // console.log(`➡️ ${route.methods.join(", ")} ${route.path}`);
    });
};

export default printRoutes;
