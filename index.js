require("dotenv").config();
const express = require("express");
const movie = require("./controller/movie");
const comment = require("./controller/comment");
const like = require("./controller/like");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.SERVER_PORT || 3080;

app.use(express.json({ limit: "25mb" }));

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.use("/api/movie", movie);
app.use("/api/comment", comment);
app.use("/api/like", like);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
