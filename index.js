const express = require("express");
require("dotenv/config");
const app = express();
const PORT = process.env.PORT || 8000;
const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("<h1>users</h1>")
});

// GET ALL users
app.get("/api/users", (req, res) => {
    pool
      .query("SELECT * FROM users;")
      .then((data) => {
        console.log(data);
        res.json(data.rows);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  });
// GET A SPECIFIC USER WITH ID
app.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM users WHERE id=$1;", [id])
      .then((data) => {
        console.log(data);
        if (data.rowCount === 0) {
          res.status(404).json({ message: "Book not found" });
        }
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  });

  app.post("/api/users", (req, res) => {
    const { first_name, last_name, age, active } = req.body; // form data from body
    pool
      .query(
        "INSERT INTO users (first_name,last_name,age,active) VALUES ($1,$2,$3,$4) RETURNING *;",
        [first_name, last_name, age, active]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  }); 

  app.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, age, active  } = req.body; // form data from body
    pool
      .query(
        "UPDATE users SET first_name=$1,last_name=$2,age=$3, active=$4 WHERE id=$5 RETURNING *;",
        [first_name, last_name, age, active, id]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  });

  app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    pool
      .query("DELETE FROM users WHERE id=$1 RETURNING *;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  });
app.listen(PORT, () => console.log(`server is up on port ${PORT}`));