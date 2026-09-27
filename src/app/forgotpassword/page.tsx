"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const forgotPassword = async () => {
    try {
      await axios.post("/api/users/forgotpassword", {
        email,
      });

      setSuccess(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data);
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      setSuccess(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {!token ? (
        <>
          <h1 className="text-4xl">Forgot Password</h1>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mt-5"
          />
          <button
            onClick={forgotPassword}
            className="bg-orange-500 text-white p-2 mt-3 rounded-md"
          >
            Submit
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl">New Password</h1>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mt-5"
          />

          <button
            onClick={resetPassword}
            className="bg-green-500 text-white p-2 mt-3"
          >
            Change Password
          </button>
        </>
      )}

      {success && <p className="text-green-500 mt-3">Success</p>}

      {error && <p className="text-red-500 mt-3">Something went wrong</p>}
      <Link className="mt-2 bg-green-500 px-2 py-1 rounded-md" href="/login">Login</Link>
    </div>
  );
}
