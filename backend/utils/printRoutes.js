import expressListEndpoints from "express-list-endpoints";
import logger from '../logger.js'

const printRoutes = (app) => {
    logger.info("📌 API Routes:");
    expressListEndpoints(app).forEach((route) => {
    logger.info(`➡️ ${route.methods.join(", ")} ${route.path}`);
    });
};

export default printRoutes;
