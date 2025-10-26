const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();

const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log("error", error);
  }
};

startServer();
