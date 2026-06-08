import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_in_production";
const user = {
  id: "a3bc27c9-ad28-4a40-9312-0595fc31907b",
  name: "Zoro",
  email: "zor0roronoa1469@gmail.com",
  avatar: "https://lh3.googleusercontent.com/a/ACg8ocJU2O5-qpp_GVC4Zb1TDrUwbYB2HtL4RbxkBt60geFIaOSqeA=s96-c"
};

const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });
console.log("TEST_TOKEN_START");
console.log(token);
console.log("TEST_TOKEN_END");
