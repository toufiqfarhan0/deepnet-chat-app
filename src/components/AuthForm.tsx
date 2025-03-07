import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

type AuthFormProps = {
  onSuccess: () => void;
};

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onSuccess();
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(err.message || "Failed to authenticate");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account to start chatting"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-4">
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin
                ? "Need an account ? Sign Up"
                : "Already have an account ? Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
