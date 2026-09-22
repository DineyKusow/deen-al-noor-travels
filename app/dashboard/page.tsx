'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>Deen Al Noor Travels</h1>
        <p>Secure staff login</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input name="email" type="email" required placeholder="admin@deenalnoortravels.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" required placeholder="••••••••" />
          </label>
          {error && <div className="error-box">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className="demo-credentials">
          Demo accounts:
          <ul>
            <li>admin@deenalnoortravels.com / Admin@123</li>
            <li>finance@deenalnoortravels.com / Finance@123</li>
            <li>staff@deenalnoortravels.com / Staff@123</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
