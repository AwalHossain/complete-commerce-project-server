const Product = require("../models/Product");
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//Create Products
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
router.delete(
  "/deleteCart/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//Get  User CART

router.get(
  "/findProduct/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });

      res.status(200).json(cart);
    } catch (err) {
      res.status(403).json("You are not allowed");
    }
  }
);

//Get All

router.get("/findAllProduct", verifyAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(403).json(errr);
  }
});

module.exports = router;
