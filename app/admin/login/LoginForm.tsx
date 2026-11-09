'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="admin">
      <form action={action} className="admin-card narrow">
        <h1>Admin</h1>
        <label className="field">
          <span>Лозинка</span>
          <input name="password" type="password" autoComplete="current-password" autoFocus required />
        </label>
        {state?.error && <p className="ferr" role="alert">{state.error}</p>}
        <button className="btn primary" disabled={pending}>Најава</button>
      </form>
    </main>
  );
}
