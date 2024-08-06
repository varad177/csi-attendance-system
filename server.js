import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from 'path'
import cors from "cors";
import Admin from "./Schema/admin.schema.js";
import Student from "./Schema/student.schema.js";
const __dirname = path.resolve()
const server = express();

server.use(express.json());
server.use(cors());

let PORT = 3000;

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

server.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:* https://cdn.jsdelivr.net");
  next();
});

server.use(express.static(path.join(__dirname, './client/dist')));
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'), err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(isMatch);
    console.log(isMatch.password);

    const dataToSend = {
      email: admin.email,
      active: admin.active,
      token: admin.password,
    };
    res.status(200).json({ message: "Login successful", dataToSend });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

server.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "please enter all details" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = new Admin({ name, email, password });
    console.log(admin);
    await admin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

server.post("/admin/add-otp", async (req, res) => {
  try {
    const { email, otp, ename, password } = req.body;
    if (!email || !otp || !ename || !password) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (admin.password != password) {
      return res.status(400).json({ message: "Invalid admin" });
    }
    admin.otp = otp;
    admin.ename = ename;
    await admin.save();
    res.status(200).json({ message: "OTP added successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

server.put("/admin/toggle-active", async (req, res) => {
  try {
    const { email, active } = req.body;
    if (!email || typeof active !== "boolean") {
      return res.status(400).json({
        message: "Email and active status (true or false) are required",
      });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.active = active;
    await admin.save();
    res
      .status(200)
      .json({ message: "Admin status updated", active: admin.active });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// student atp

server.post("/student/add-attendance", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      department,
      studentid,
      year,
      sem,
      div,
      roll,
      otp,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !studentid ||
      !department ||
      !year ||
      !sem ||
      !div ||
      !roll ||
      !otp
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const admin = await Admin.findOne({ otp });
    if (!admin) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (admin.active == false) {
      return res
        .status(400)
        .json({ message: "you can't mark the attendance now." });
    }

    const studentExist = await Student.findOne({ studentid });
    if (studentExist) {
      return res.status(400).json({ message: "student is already present" });
    }

    // Add new student

    const student = new Student({
      firstname,
      lastname,
      studentid,
      department,
      year,
      sem,
      div,
      roll,
      otp,
    });
    await student.save();

    res.status(201).json({ message: "Attendance added successfully", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

server.post("/student/all-student", async (req, res) => {
  try {
    const users = await Student.find({});
    res.status(200).json({ message: "All students", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});
server.post("/get-ename", async (req, res) => {
  try {
    const users = await Admin.find({});
    const admin = users[0];
    res.status(200).json({ ename: admin.ename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});



server.listen(PORT, () => {
  console.log(`listing on ${PORT}`);
});
