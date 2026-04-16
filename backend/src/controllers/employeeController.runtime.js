import { randomUUID } from 'node:crypto';
import { ApiError } from '../utils/ApiError.js';

let employees = [];

const employeeStatuses = new Set(['Active', 'On Leave', 'Inactive']);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortEmployees(employeeList) {
  return [...employeeList].sort((leftEmployee, rightEmployee) => {
    const joinedOnDifference =
      new Date(rightEmployee.joinedOn).getTime() -
      new Date(leftEmployee.joinedOn).getTime();

    if (joinedOnDifference !== 0) {
      return joinedOnDifference;
    }

    return (
      new Date(rightEmployee.createdAt ?? 0).getTime() -
      new Date(leftEmployee.createdAt ?? 0).getTime()
    );
  });
}

function buildPayload(body = {}) {
  const parsedSalary =
    body.salary === undefined || body.salary === null || body.salary === ''
      ? undefined
      : Number(body.salary);

  return {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    department: body.department?.trim(),
    position: body.position?.trim(),
    status: body.status ?? 'Active',
    salary: parsedSalary,
    joinedOn: body.joinedOn,
  };
}

function validatePayload(payload) {
  const details = [];

  if (!payload.name) details.push('Name is required.');
  if (!payload.email) details.push('Email is required.');
  if (!payload.department) details.push('Department is required.');
  if (!payload.position) details.push('Position is required.');

  if (!payload.status || !employeeStatuses.has(payload.status)) {
    details.push('Status must be Active, On Leave, or Inactive.');
  }

  if (payload.salary === undefined || Number.isNaN(payload.salary)) {
    details.push('Salary must be a valid number.');
  } else if (payload.salary < 0) {
    details.push('Salary must be a non-negative number.');
  }

  const joinedOnDate = new Date(payload.joinedOn);
  if (!payload.joinedOn || Number.isNaN(joinedOnDate.getTime())) {
    details.push('Join date must be a valid date.');
  }

  return details;
}

function buildFilters(query = {}) {
  const filters = {};

  if (query.status && query.status !== 'all') {
    filters.status = query.status;
  }

  if (query.search?.trim()) {
    filters.searchPattern = new RegExp(escapeRegex(query.search.trim()), 'i');
  }

  return filters;
}

function matchesFilters(employee, filters) {
  if (filters.status && employee.status !== filters.status) {
    return false;
  }

  if (!filters.searchPattern) {
    return true;
  }

  return [
    employee.name,
    employee.email,
    employee.department,
    employee.position,
  ].some((value) => filters.searchPattern.test(value ?? ''));
}

function buildStatusBreakdown(employeeList) {
  return employeeList.reduce(
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
}

function getEmployeeByIdentifier(employeeId) {
  return employees.find((employee) => employee._id === employeeId);
}

function ensureUniqueEmail(email, employeeId) {
  const duplicateEmployee = employees.find(
    (employee) => employee.email === email && employee._id !== employeeId,
  );

  if (duplicateEmployee) {
    throw new ApiError(409, 'An employee with that email already exists.', [
      'Email addresses must be unique.',
    ]);
  }
}

export const getEmployees = (request, response) => {
  const filters = buildFilters(request.query);
  const filteredEmployees = sortEmployees(
    employees.filter((employee) => matchesFilters(employee, filters)),
  );

  response.status(200).json({
    data: filteredEmployees,
    meta: {
      total: filteredEmployees.length,
      statusBreakdown: buildStatusBreakdown(filteredEmployees),
      filters: {
        search: request.query.search ?? '',
        status: request.query.status ?? 'all',
      },
    },
  });
};

export const getEmployeeById = (request, response) => {
  const employee = getEmployeeByIdentifier(request.params.id);

  if (!employee) {
    throw new ApiError(404, 'Employee not found.');
  }

  response.status(200).json({ data: employee });
};

export const createEmployee = (request, response) => {
  const payload = buildPayload(request.body);
  const details = validatePayload(payload);

  if (details.length > 0) {
    throw new ApiError(400, 'Please review the submitted employee details.', details);
  }

  ensureUniqueEmail(payload.email);

  const now = new Date().toISOString();
  const employee = {
    _id: randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  employees = sortEmployees([employee, ...employees]);

  response.status(201).json({
    message: 'Employee created successfully.',
    data: employee,
  });
};

export const updateEmployee = (request, response) => {
  const existingEmployee = getEmployeeByIdentifier(request.params.id);

  if (!existingEmployee) {
    throw new ApiError(404, 'Employee not found.');
  }

  const payload = buildPayload(request.body);
  const details = validatePayload(payload);

  if (details.length > 0) {
    throw new ApiError(400, 'Please review the submitted employee details.', details);
  }

  ensureUniqueEmail(payload.email, existingEmployee._id);

  const updatedEmployee = {
    ...existingEmployee,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  employees = sortEmployees(
    employees.map((employee) =>
      employee._id === existingEmployee._id ? updatedEmployee : employee,
    ),
  );

  response.status(200).json({
    message: 'Employee updated successfully.',
    data: updatedEmployee,
  });
};

export const deleteEmployee = (request, response) => {
  const employee = getEmployeeByIdentifier(request.params.id);

  if (!employee) {
    throw new ApiError(404, 'Employee not found.');
  }

  employees = employees.filter((currentEmployee) => currentEmployee._id !== employee._id);

  response.status(200).json({
    message: 'Employee deleted successfully.',
  });
};
