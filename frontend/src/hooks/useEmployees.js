import { startTransition, useEffect, useState } from 'react';
import {
  createEmployee,
  deleteEmployee as removeEmployee,
  getEmployees,
  updateEmployee,
} from '../api/employees';

const defaultStatusBreakdown = {
  Active: 0,
  'On Leave': 0,
  Inactive: 0,
};

function getEmployeeId(employee) {
  return employee?._id ?? employee?.id;
}

function getErrorMessage(error, fallbackMessage) {
  const apiMessage = error.response?.data?.message;
  const apiDetails = error.response?.data?.details;

  if (Array.isArray(apiDetails) && apiDetails.length > 0) {
    return apiDetails[0];
  }

  return apiMessage || fallbackMessage;
}

function getLastUpdatedTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
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

function normalizeEmployeeListResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function normalizeEmployeeMutationResponse(response) {
  if (response?.data && !Array.isArray(response.data)) {
    return {
      employee: response.data,
      message: response.message,
    };
  }

  if (response && !Array.isArray(response) && getEmployeeId(response)) {
    return {
      employee: response,
      message: response.message,
    };
  }

  return {
    employee: null,
    message: response?.message,
  };
}

function buildMeta(employeeList) {
  return {
    total: employeeList.length,
    statusBreakdown: employeeList.reduce((summary, employee) => {
      summary[employee.status] += 1;
      return summary;
    }, { ...defaultStatusBreakdown }),
  };
}

export function useEmployees(filters) {
  const { search, status } = filters;
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const meta = buildMeta(employees);

  const upsertEmployeeInState = (employee) => {
    setEmployees((currentEmployees) => {
      const remainingEmployees = currentEmployees.filter(
        (currentEmployee) => getEmployeeId(currentEmployee) !== getEmployeeId(employee),
      );

      return sortEmployees([employee, ...remainingEmployees]);
    });
    setLastUpdated(getLastUpdatedTime());
  };

  const removeEmployeeFromState = (employeeId) => {
    setEmployees((currentEmployees) =>
      currentEmployees.filter((employee) => getEmployeeId(employee) !== employeeId),
    );
    setLastUpdated(getLastUpdatedTime());
  };

  useEffect(() => {
    let isActive = true;

    async function loadEmployees() {
      setIsLoading(true);
      setError('');

      try {
        const response = await getEmployees({ search, status });

        if (!isActive) {
          return;
        }

        setEmployees(sortEmployees(normalizeEmployeeListResponse(response)));
        setLastUpdated(getLastUpdatedTime());
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(getErrorMessage(loadError, 'Unable to fetch employees.'));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEmployees();

    return () => {
      isActive = false;
    };
  }, [reloadKey, search, status]);

  const refresh = () => {
    startTransition(() => {
      setReloadKey((currentKey) => currentKey + 1);
    });
  };

  const saveEmployee = async (payload, id) => {
    setIsSaving(true);
    setError('');

    try {
      const response = id
        ? await updateEmployee(id, payload)
        : await createEmployee(payload);
      const { employee, message } = normalizeEmployeeMutationResponse(response);

      if (employee && !search.trim() && status === 'all') {
        upsertEmployeeInState(employee);
      }

      refresh();

      return {
        success: true,
        message:
          message ||
          (id
            ? 'Employee updated successfully.'
            : 'Employee created successfully.'),
      };
    } catch (saveError) {
      return {
        success: false,
        message: getErrorMessage(saveError, 'Unable to save the employee record.'),
      };
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEmployee = async (id) => {
    setDeletingId(id);
    setError('');

    try {
      const response = await removeEmployee(id);
      removeEmployeeFromState(id);
      refresh();

      return {
        success: true,
        message: response.message || 'Employee deleted successfully.',
      };
    } catch (deleteError) {
      const message = getErrorMessage(
        deleteError,
        'Unable to delete the employee record.',
      );
      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setDeletingId('');
    }
  };

  return {
    employees,
    meta,
    isLoading,
    isSaving,
    deletingId,
    error,
    lastUpdated,
    saveEmployee,
    deleteEmployee,
  };
}
