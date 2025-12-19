/**
 * Example authentication page demonstrating login functionality
 * 
 * This shows how to use authentication hooks and mutations.
 */

import { useState } from "react";
import { useLogin, useRegister } from "../../query";
import { useAuthContext } from "../../context";
import type { LoginRequest, RegisterRequest } from "../../types";

export default function ExampleAuthPage() {
  const { setUser, setToken } = useAuthContext();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Login mutation
  const loginMutation = useLogin();

  // Register mutation
  const registerMutation = useRegister();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const loginData: LoginRequest = {
      walletAddress: formData.get("walletAddress") as string,
    };

    try {
      const response = await loginMutation.mutateAsync(loginData);
      setUser(response.user);
      if (response.token) setToken(response.token);
      console.log("Login successful!", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const registerData: RegisterRequest = {
      walletAddress: formData.get("walletAddress") as string,
      email: formData.get("email") as string,
      fullname: formData.get("fullname") as string,
      role: formData.get("role") as "client" | "developer",
    };

    try {
      const response = await registerMutation.mutateAsync(registerData);
      setUser(response.user);
      if (response.token) setToken(response.token);
      console.log("Registration successful!", response);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <h1>{isLoginMode ? "Login" : "Register"}</h1>

      {isLoginMode ? (
        <form onSubmit={handleLogin}>
          <input type="text" name="walletAddress" placeholder="Wallet Address" required />
          <button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
          {loginMutation.error && (
            <p>Error: {loginMutation.error.message}</p>
          )}
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input type="text" name="walletAddress" placeholder="Wallet Address" required />
          <input type="text" name="fullname" placeholder="Full Name" />
          <input type="email" name="email" placeholder="Email" />
          <select name="role" required>
            <option value="client">Client</option>
            <option value="developer">Developer</option>
          </select>
          <button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
          {registerMutation.error && (
            <p>Error: {registerMutation.error.message}</p>
          )}
        </form>
      )}

      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
}
