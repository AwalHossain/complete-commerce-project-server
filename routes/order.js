const Product = require("../models/Product");
const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyAdmin,
  verifyToken,
} = require("./verifyToken");
const NewOrder = require("../models/NewOrder");

const router = require("express").Router();

//Create Products
router.post("/order", verifyToken, async (req, res) => {
  const newOrder = new NewOrder(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updateOrder = await NewOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
router.delete("/deleteOrder/:id", verifyAdmin, async (req, res) => {
  try {
    await NewOrder.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been successfully deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get  User CART

router.get(
  "/findProduct/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const orders = await NewOrder.find({ userId: req.params.userId });

      res.status(200).json(orders);
    } catch (err) {
      res.status(403).json("You are not allowed");
    }
  }
);

//Get All

router.get("/findAllOrder", verifyAdmin, async (req, res) => {
  try {
    const orders = await NewOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(403).json(errr);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await NewOrder.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
