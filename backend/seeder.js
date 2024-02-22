const mongoose = require("mongoose");

const dotenv = require("dotenv");

const User = require("./Model/UserModel");
const product = require("./Model/ProductModel");

const products = require("./Products");
const connectDB = require("./config/config");

dotenv.config();

connectDB();

const importData = async () => {
  const sampleData = products.map((product) => {
    return { ...product };
  });

  await product.insertMany(sampleData);
  console.log("Data Imported");
  process.exit();
};

const dataDestroy = async () => {
  await product.deleteMany(sampleData);
  await User.deleteMany();
  process.exit();
};

if (process.argv[2] === "-id") {
  dataDestroy();
} else {
  importData();
}
