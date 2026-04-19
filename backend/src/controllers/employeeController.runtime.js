import Employee from '../models/Employee.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
    const { search = '', status = 'all' } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search.trim()) {
      const searchPattern = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [
        { name: searchPattern },
        { email: searchPattern },
        { department: searchPattern },
        { position: searchPattern },
      ];
    }

    const employees = await Employee.find(query).sort({ joinedOn: -1, createdAt: -1 });

    const statusBreakdown = employees.reduce(
      (summary, employee) => {
        summary[employee.status] += 1;
        return summary;
      },
      {
        Active: 0,
        'On Leave': 0,
        Inactive: 0,
      },
    );

    res.json({
      data: employees,
      meta: {
        total: employees.length,
        statusBreakdown,
        filters: {
          search,
          status,
        },
      },
    });
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
