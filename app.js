const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const memberRouter = require("./routes/memberRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(authRouter);
app.use(memberRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Equiparenting API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
