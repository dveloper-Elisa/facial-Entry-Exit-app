// import Router from "router";
import express from "express";
import register from "../controllers/register.security.js";
import securityLogin from "../controllers/login.security.js";
import studentSignUp from "../controllers/registerStudent.js";

const router = express.Router();

router.post("/security", register);

router.post("/security/login", securityLogin);

router.post("/recognize-face", studentSignUp);

export default router;
