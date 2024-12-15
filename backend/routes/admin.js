const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
//bcrypt,zod,jsonwebtoken

//signup endpoint for admin
adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    await adminModel.create({
      email: email,
      password: hasedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    console.error(e.message || e);
  }

  res.json({
    message: "Signup succeded",
  });
});

//signin endpoint for admin
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({
      email: email,
    });
    if (!admin) {
      return res.status(400).json({
        message: "email not valid try again",
      });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(403).json({
        message: "password os not valid try again",
      });
    }
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
    );
    res.json({ token });
  } catch (error) {
    console.error(error.message || error);
  }
});
//course creation
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price } = req.body;
  const course = await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    adminId,
  });

  res.json({
    message: "Course created",
    courseId : course._id
  });
});



adminRouter.put("/course", adminMiddleware, async(req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price,courseId } = req.body;
  const course = await courseModel.updateOne({
    _id: courseId,
    creatorId:adminId
  },{
    title,
    description,
    imageUrl,
    price,
  });

  res.json({
    message: "Course updated",
    courseId : course._id
  });
});



adminRouter.get("/course/bulk", adminMiddleware,async(req, res) => {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId:adminId
  });

  res.json({
    message: "Course list",
    courses
  });
});

module.exports = {
  adminRouter: adminRouter,
};
