// import Router from "router";
import express from "express";
import register from "../controllers/register.security.js";
import securityLogin from "../controllers/login.security.js";
import CheckOut from "../controllers/checkout.js";
import checkedIn from "../controllers/getCheckedIn.js";
import getAllSecurrity from "../controllers/getSecurrities.js";
import deletesec from "../controllers/deletesec.js";

const router = express.Router();

router.post("/security", register);

router.post("/security/login", securityLogin);

router.get("/securirties", getAllSecurrity)

router.delete("/dele/:id", deletesec)

router.put("/out/:id", CheckOut);

router.get("/checkedin/:id", checkedIn);

export default router;
