import { useState } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

function getErrorMessage(error) {
  const apiDetails = error.response?.data?.details;

  if (Array.isArray(apiDetails) && apiDetails.length > 0) {
    return apiDetails[0];
  }

  return error.response?.data?.message || 'Unable to create the account right now.';
}

export default function SignupPage({ onSignupSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      setError('');
    }

    if (success) {
      setSuccess('');
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const message =
        response.data?.message || 'Account created successfully. Please sign in.';

      setSuccess(message);
      setForm({
        name: '',
        email: '',
        password: '',
      });
      onSignupSuccess(message);
    } catch (signupError) {
      setError(getErrorMessage(signupError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel auth-card">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Authentication</p>
          <h2>Sign up</h2>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
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

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}
        {success ? <p className="form-success">{success}</p> : null}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="auth-footer">
        <p>Already have an account?</p>
        <button
          className="button button--ghost button--compact"
          type="button"
          onClick={onSwitchToLogin}
        >
          Back to login
        </button>
      </div>
    </section>
  );
}
