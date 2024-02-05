const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Equiparenting API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
