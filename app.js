const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const memberRouter = require("./routes/memberRouter");
const userRouter = require("./routes/userRouter");
const rewardRouter = require('./routes/rewardRouter')
const activityRouter = require("./routes/activityRouter");
const scoreRouter = require("./routes/scoreRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(authRouter);
app.use(memberRouter);
app.use(userRouter);
app.use(rewardRouter);
app.use(activityRouter);
app.use(scoreRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Equiparenting API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});