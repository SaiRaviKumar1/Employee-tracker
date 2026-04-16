import Employee from '../models/Employee.js';

// CREATE employee
export const createEmployee = async (req, res) => {
  try {
    console.log("👉 Incoming:", req.body);

    const employee = await Employee.create({
      ...req.body,
      joinedOn: new Date(), // FORCE add date
    });

    console.log("✅ Saved to MongoDB:", employee);

    res.status(201).json(employee);
  } catch (error) {
    console.error("❌ ERROR saving:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};