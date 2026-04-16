// 🔥 In-memory storage (temporary for demo)

let employees = [];

// CREATE employee
export const createEmployee = (req, res) => {
  const newEmployee = {
    id: Date.now(),
    ...req.body,
  };

  employees.push(newEmployee);

  res.status(201).json(newEmployee);
};

// GET all employees
export const getEmployees = (req, res) => {
  res.json(employees);
};
// DELETE employee
export const deleteEmployee = (req, res) => {
  const { id } = req.params;

  employees = employees.filter(emp => emp.id != id);

  res.json({ message: "Employee deleted" });
};
// GET employee by ID
export const getEmployeeById = (req, res) => {
  const { id } = req.params;

  const employee = employees.find(emp => emp.id == id);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(employee);
};
// UPDATE employee
export const updateEmployee = (req, res) => {
  const { id } = req.params;

  const index = employees.findIndex(emp => emp.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees[index] = {
    ...employees[index],
    ...req.body,
  };

  res.json(employees[index]);
};