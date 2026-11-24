import express from 'express';
import controller from '../controllers/controller_dashboard/controller_dashboard.js'

const router_dashboard = express.Router();

router_dashboard.get('/dash', (req, res)=> {
    controller.dashboard(req, res);
})

export default router_dashboard;