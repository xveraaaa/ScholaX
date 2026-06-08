const pool = require("../db");

// Get all campuses (Public route for Website Tour)
exports.getAllCampuses = async (req, res) => {
  try {
    const [campuses] = await pool.execute(
      "SELECT * FROM campuses WHERE address IS NOT NULL",
    );
    res.json(campuses);
  } catch (error) {
    console.error("Get campuses error:", error);
    res.status(500).json({ message: "Failed to fetch campuses" });
  }
};

// Get single campus details
exports.getCampusById = async (req, res) => {
  try {
    const { id } = req.params;
    const [campuses] = await pool.execute(
      "SELECT * FROM campuses WHERE id = ?",
      [id],
    );

    if (campuses.length === 0) {
      return res.status(404).json({ message: "Campus not found" });
    }
    res.json(campuses[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new campus (Admin only)
exports.createCampus = async (req, res) => {
  const { name, address, latitude, longitude, image_url, virtual_tour_url } =
    req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO campuses (name, address, latitude, longitude, image_url, virtual_tour_url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [name, address, latitude, longitude, image_url, virtual_tour_url],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Campus created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create campus" });
  }
};
