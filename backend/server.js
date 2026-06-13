require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/student"));
app.use("/api/programs", require("./routes/program"));
app.use("/api/teachers", require("./routes/teacher"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/enrollments", require("./routes/enrollment"));
app.use("/api/grades", require("./routes/grade"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/campuses", require("./routes/campus"));
app.use("/api/sections", require("./routes/sections"));

app.get("/", (req, res) => {
  res.json({
    message: "ScholaX API Running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
