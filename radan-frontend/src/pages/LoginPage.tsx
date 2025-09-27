import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { Link } from "react-router";
import { loginUser, type LoginData } from "@/services/authService";
import axios from "axios";
import { navigateTo } from "@/utils/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      alert("Please fill out both fields.");
      return;
    }

    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);

      setMessage("Login successful!");
      setMessageType("success");

      setTimeout(() => {
        navigateTo("/");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Login failed. Please try again.";
        setMessage(errorMsg);
        setMessageType("error");
      } else if (error instanceof Error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="relative w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      {/* Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center py-12">
        <form onSubmit={handleSubmit} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {message && (
              <div
                className={`text-sm text-center px-4 py-2 rounded ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://placehold.co/1200x900/1a202c/4a5568?text=Radan+Movies"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
