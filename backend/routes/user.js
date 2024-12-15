const { Router } = require("express");
const bcrypt = require("bcrypt");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require('../config')
const {userMiddleware} = require('../middleware/user')

//signup endpoint for user
userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    await userModel.create({
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

//sigin endpoint for user
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        message: "email not valid try again",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({
        message: "password os not valid try again",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );
    res.json({ token });
  } catch (error) {
    console.error(error.message || error);
  }
});

//purchases 
userRouter.get("/purchases", userMiddleware, async(req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId
  })
  
  const courseData = await courseModel.find({
    _id: {$in:purchases.map(x=>x.courseId)}
  })

  res.json({
    purchases
  })
});

module.exports = {
  userRouter: userRouter,
};
