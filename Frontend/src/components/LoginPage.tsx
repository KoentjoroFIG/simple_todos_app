import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // try to parse error message
        let msg = `Request failed: ${res.status}`;
        try {
          const body = await res.json();
          if (body?.detail) msg = body.detail;
          else if (body?.message) msg = body.message;
          else if (body?.error) msg = body.error;
        } catch (_) {
          // ignore JSON parse error
        }
        setError(msg);
        return;
      }

      const data = await res.json();
      const token = data?.access_token;

      if (token) {
        // Get user info after successful login
        const userRes = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          login(token, userData);
          navigate("/todos");
        } else {
          setError("Failed to get user information");
        }
      } else {
        setError("Login succeeded but no token was returned");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
        aria-label="login-form"
      >
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>

        <label className="block mb-2 text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
        />

        <label
          className="block mt-4 mb-2 text-sm font-medium"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
        />

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
