import { useState } from 'react';
import axios from 'axios';

const TOKEN_STORAGE_KEY = 'employee-tracker-token';
const USER_STORAGE_KEY = 'employee-tracker-user';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

function getErrorMessage(error) {
  const apiDetails = error.response?.data?.details;

  if (Array.isArray(apiDetails) && apiDetails.length > 0) {
    return apiDetails[0];
  }

  return error.response?.data?.message || 'Unable to sign in right now.';
}

export default function LoginPage({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email: email.trim(),
        password,
      });

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error('Authentication response was incomplete.');
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      onLoginSuccess({
        token,
        user,
      });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel auth-card">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Authentication</p>
          <h2>Login</h2>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="auth-footer">
        <p>Don&apos;t have an account?</p>
        <button
          className="button button--ghost button--compact"
          type="button"
          onClick={onSwitchToSignup}
        >
          Create account
        </button>
      </div>
    </section>
  );
}
