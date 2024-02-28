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

// Middleware to enable CORS
app.use(cors({
  origin: 'https://equiparenting.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

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
