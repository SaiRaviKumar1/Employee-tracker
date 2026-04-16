import StatusPill from './StatusPill';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});
export default function EmployeeList({
  employees,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}) {
  const getEmployeeId = (employee) => employee._id ?? employee.id;

  if (isLoading && !employees.length) {
    return (
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Employee Records</p>
            <h2>Employee directory</h2>
          </div>
        </div>
        <div className="empty-state">Loading employee records...</div>
      </section>
    );
  }

  if (!employees.length) {
    return (
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Employee Records</p>
            <h2>Employee directory</h2>
          </div>
        </div>
        <div className="empty-state">
          No employee records match the current filters yet.
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Employee Records</p>
          <h2>Employee directory</h2>
        </div>
      </div>

      {isLoading ? (
        <p className="panel-status" role="status">
          Syncing the latest employee changes...
        </p>
      ) : null}

      <div className="table-shell">
        <table className="employee-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Status</th>
              <th scope="col">Salary</th>
              <th scope="col" className="employee-table__actions-header">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const employeeId = getEmployeeId(employee);

              return (
                <tr key={employeeId}>
                  <td data-label="Name">
                    <div className="employee-table__name">
                      <span className="employee-table__primary">{employee.name}</span>
                      <span className="employee-table__secondary">
                        {employee.position}
                      </span>
                    </div>
                  </td>
                  <td data-label="Email">{employee.email}</td>
                  <td data-label="Department">{employee.department}</td>
                  <td data-label="Status">
                    <StatusPill status={employee.status} />
                  </td>
                  <td data-label="Salary">
                    {currencyFormatter.format(employee.salary)}
                  </td>
                  <td data-label="Actions">
                    <div className="employee-table__actions">
                      <button
                        className="button button--ghost button--compact"
                        type="button"
                        onClick={() => onEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="button button--danger button--compact"
                        type="button"
                        onClick={() => onDelete(employeeId)}
                        disabled={deletingId === employeeId}
                      >
                        {deletingId === employeeId ? 'Removing...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
