const Product = require("../models/Product");
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyAdmin } = require("./verifyToken");

const router = require("express").Router();

//Create Products
router.post("/uploadProducts", verifyAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put("/updateProduct/:id", verifyAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
router.delete("/deleteProduct/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been successfully deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get  User

router.get("/findProduct/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await Product.findById(req.params.id);
    console.log(user);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(403).json("You are not allowed");
  }
});

//Get All User

router.get("/findAllProduct", verifyAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(403).json("You are not allowed");
  }
});

module.exports = router;
