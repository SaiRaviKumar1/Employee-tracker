import { startTransition, useDeferredValue, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import StatCard from './components/StatCard';
import { useEmployees } from './hooks/useEmployees';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const statusOptions = ['all', 'Active', 'On Leave', 'Inactive'];
const TOKEN_STORAGE_KEY = 'employee-tracker-token';
const USER_STORAGE_KEY = 'employee-tracker-user';

function getStoredAuthState() {
  if (typeof window === 'undefined') {
    return {
      token: '',
      user: null,
    };
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  try {
    return {
      token,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  } catch {
    return {
      token,
      user: null,
    };
  }
}

function DashboardView({ authUser, onLogout }) {
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
          <p className="eyebrow">HR Dashboard</p>
          <h1>Employee Directory</h1>
          <p className="dashboard-header__text">
            Manage employee records, staffing status, and core team details in
            one place.
          </p>
        </div>
        <div className="dashboard-header__meta">
          <span className="header-chip">
            {authUser?.name ? `Signed in as ${authUser.name}` : 'People Operations'}
          </span>
          <p>{lastUpdated ? `Last synced at ${lastUpdated}` : 'Waiting for data'}</p>
          <button
            className="button button--ghost button--compact"
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
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

export default function App() {
  const [authState, setAuthState] = useState(getStoredAuthState);
  const [authView, setAuthView] = useState('login');
  const [authNotice, setAuthNotice] = useState('');

  const handleLoginSuccess = ({ token, user }) => {
    setAuthNotice('');
    setAuthState({
      token,
      user,
    });
  };

  const handleSignupSuccess = (message) => {
    setAuthNotice(message);
    setAuthView('login');
  };

  const handleSwitchToLogin = () => {
    setAuthNotice('');
    setAuthView('login');
  };

  const handleSwitchToSignup = () => {
    setAuthNotice('');
    setAuthView('signup');
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setAuthNotice('');
    setAuthState({
      token: '',
      user: null,
    });
    setAuthView('login');
  };

  if (!authState.token) {
    return (
      <main className="app-shell auth-shell">
        <section className="auth-header">
          <p className="eyebrow">Employee Tracker</p>
          <h1>Account Access</h1>
          <p className="dashboard-header__text">
            Sign in or create an account to access the employee dashboard.
          </p>
        </section>

        {authNotice ? <p className="banner banner--success">{authNotice}</p> : null}

        {authView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        ) : (
          <SignupPage
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </main>
    );
  }

  return <DashboardView authUser={authState.user} onLogout={handleLogout} />;
}
