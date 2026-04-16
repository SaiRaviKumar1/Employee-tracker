import { useState } from 'react';

const emptyForm = {
  name: '',
  email: '',
  department: '',
  position: '',
  status: 'Active',
  salary: '',
  joinedOn: '',
};

function mapEmployeeToForm(employee) {
  if (!employee) {
    return emptyForm;
  }

  return {
    name: employee.name ?? '',
    email: employee.email ?? '',
    department: employee.department ?? '',
    position: employee.position ?? '',
    status: employee.status ?? 'Active',
    salary: employee.salary?.toString() ?? '',
    joinedOn: employee.joinedOn?.slice(0, 10) ?? '',
  };
}

function validate(form) {
  if (!form.name.trim()) return 'Name is required.';
  if (!form.email.trim()) return 'Email is required.';
  if (!form.department.trim()) return 'Department is required.';
  if (!form.position.trim()) return 'Position is required.';
  if (form.salary === '') return 'Salary is required.';

  const parsedSalary = Number(form.salary);
  if (Number.isNaN(parsedSalary) || parsedSalary < 0) {
    return 'Salary must be a non-negative number.';
  }

  if (!form.joinedOn) return 'Join date is required.';

  return '';
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  pending,
}) {
  const [form, setForm] = useState(() => mapEmployeeToForm(employee));
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (submitError) {
      setSubmitError('');
    }

    if (submitSuccess) {
      setSubmitSuccess('');
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validate(form);
    if (validationMessage) {
      setSubmitSuccess('');
      setSubmitError(validationMessage);
      return;
    }

    const result = await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
      status: form.status,
      salary: Number(form.salary),
      joinedOn: form.joinedOn,
    });

    if (!result.success) {
      setSubmitSuccess('');
      setSubmitError(result.message);
      return;
    }

    setSubmitError('');
    setSubmitSuccess(result.message || 'Employee created successfully.');

    if (!employee) {
      setForm(emptyForm);
    }
  };

  return (
    <section className="panel form-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Employee Details</p>
          <h2>{employee ? 'Edit employee' : 'Add employee'}</h2>
        </div>
        {employee ? (
          <button
            className="button button--ghost"
            type="button"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
          />
        </label>

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
          />
        </label>

        <div className="employee-form__grid">
          <label>
            <span>Department</span>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
            />
          </label>

          <label>
            <span>Position</span>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Job title"
            />
          </label>
        </div>

        <div className="employee-form__grid">
          <label>
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label>
            <span>Salary</span>
            <input
              name="salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={handleChange}
              placeholder="Annual salary"
            />
          </label>
        </div>

        <label>
          <span>Joined on</span>
          <input
            name="joinedOn"
            type="date"
            value={form.joinedOn}
            onChange={handleChange}
          />
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}
        {submitSuccess ? (
          <p className="form-success" role="status">
            {submitSuccess}
          </p>
        ) : null}

        <button className="button button--primary" type="submit" disabled={pending}>
          {pending ? 'Saving...' : employee ? 'Update employee' : 'Create employee'}
        </button>
      </form>
    </section>
  );
}
