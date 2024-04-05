const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const app = express();
const PORT = 3000; 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  
mongoose.connect("mongodb://localhost:27017/Employees", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");
  if (!mongoose.models.Employee) {
    const employeeSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
    });
    mongoose.model("Employees", employeeSchema);
  } 
  const Employee = mongoose.model("Employees"); 
  app.use(cors()); 
  app.use((req, res, next) => {
    if (!Employee) {
      return res.status(500).json({ error: "Employee model is not registered" });
    }
    next();
  }); 
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }); 
  app.post("/api/employees", async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const employee = new Employee({ name, email, phone });
      await employee.save();
      res.status(201).json(employee);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }); 
  app.post("/api/employees/search", async (req, res) => {
    try {
      const { query } = req.body;
      const employee = await Employee.findOne({ $or: [{ name: query }, { email: query }, { phone: query }] });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); 
  app.post("/api/employees/delete", async (req, res) => {
    try {
      const { query } = req.body;
      await Employee.deleteOne({ $or: [{ name: query }, { email: query }, { phone: query }] });
      const employees = await Employee.find();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true }
      );
      res.json(updatedEmployee);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
}); 
app.listen(PORT, () => console.log('Server running on port ${PORT}'));