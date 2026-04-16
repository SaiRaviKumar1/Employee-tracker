import { startTransition, useDeferredValue, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import StatCard from './components/StatCard';
import { useEmployees } from './hooks/useEmployees';

const statusOptions = ['all', 'Active', 'On Leave', 'Inactive'];

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const deferredSearch = useDeferredValue(searchInput);

  const {
    employees,
    meta,
    isLoading,
    isSaving,
    deletingId,
    error,
    lastUpdated,
    saveEmployee,
    deleteEmployee,
  } = useEmployees({
    search: deferredSearch,
    status: statusFilter,
  });

  const handleEdit = (employee) => {
    startTransition(() => {
      setSelectedEmployee(employee);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    startTransition(() => {
      setSelectedEmployee(null);
    });
  };

  const handleSubmit = async (payload) => {
    const result = await saveEmployee(payload, selectedEmployee?._id);

    if (result.success) {
      startTransition(() => {
        setSelectedEmployee(null);
      });
    }

    return result;
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      'Delete this employee record? This action cannot be undone.',
    );

    if (!shouldDelete) {
      return;
    }

    const result = await deleteEmployee(id);

    if (result.success && selectedEmployee?._id === id) {
      startTransition(() => {
        setSelectedEmployee(null);
      });
    }
  };

  const isSearching = deferredSearch !== searchInput;

  return (
    <main className="app-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow"></p>
          <h1>Employee Directory</h1>
          <p className="dashboard-header__text">
            Manage employee records, staffing status, and core team details in
            one place.
          </p>
        </div>
        <div className="dashboard-header__meta">
          <span className="header-chip">People Operations</span>
          <p>{lastUpdated ? `Last synced at ${lastUpdated}` : 'Waiting for data'}</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Employees" value={meta.total} accent="primary" />
        <StatCard
          label="Active"
          value={meta.statusBreakdown.Active}
          accent="secondary"
        />
        <StatCard
          label="On Leave"
          value={meta.statusBreakdown['On Leave']}
          accent="warning"
        />
        <StatCard
          label="Inactive"
          value={meta.statusBreakdown.Inactive}
          accent="neutral"
        />
      </section>

      <section className="toolbar panel">
        <div className="toolbar__controls">
          <label className="toolbar__field">
            <span>Search</span>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, email, department, or role"
            />
          </label>

          <label className="toolbar__field toolbar__field--compact">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption === 'all' ? 'All statuses' : statusOption}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="toolbar__meta">
          <p>{isSearching ? 'Updating results...' : 'Results update automatically.'}</p>
          <p>Status and search filters are applied to the employee list.</p>
        </div>
      </section>

      {error ? <p className="banner banner--error">{error}</p> : null}

      <section className="workspace-grid">
        <EmployeeForm
          key={selectedEmployee?._id ?? 'new-employee'}
          employee={selectedEmployee}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          pending={isSaving}
        />

        <EmployeeList
          employees={employees}
          isLoading={isLoading}
          deletingId={deletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
