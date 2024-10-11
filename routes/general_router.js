// import Router from "router";
import express from "express";
import register from "../controllers/register.security.js";
import securityLogin from "../controllers/login.security.js";
import CheckOut from "../controllers/checkout.js";
import checkedIn from "../controllers/getCheckedIn.js";

const router = express.Router();

router.post("/security", register);

router.post("/security/login", securityLogin);

router.put("/out/:id", CheckOut);

router.get("/checkedin/:id", checkedIn);

export default router;
