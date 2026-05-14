import { useState } from 'react';

const PASS_KEY = 'dea_dash_auth';
const HASH = '8f14e45fceea167a5a36dedd4bea2543'; // md5 placeholder - we use simple comparison

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(PASS_KEY) === 'true';
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === 'AMZL123') {
      sessionStorage.setItem(PASS_KEY, 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) {
    return children;
  }

  return (
    <div className="password-gate">
      <div className="password-box">
        <h2>DEA Dashboard</h2>
        <p>Enter password to access</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          <button type="submit">Enter</button>
        </form>
        {error && <p className="password-error">Incorrect password</p>}
      </div>
    </div>
  );
}