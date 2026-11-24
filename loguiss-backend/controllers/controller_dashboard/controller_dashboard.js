import dashboard_service from "../../services/dashboard_service/dashboard.service.js";


async function dashboard(req, res) {
    await dashboard_service(req, res);
}

export default {dashboard}