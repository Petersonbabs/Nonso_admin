"use client"
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [formData, setFormData] = useState<LoginSchema>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginSchema>>({});
  const {login, loading} = useAuthContext()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email ? fieldErrors.email[0] : undefined,
        password: fieldErrors.password ? fieldErrors.password[0] : undefined,
      });
    } else {
      login(result.data)
    }
  };

  return (
    <div className="max-w-md w-[90vw] translate-y-[50%] mx-auto mt-20">
      <h2 className="text-2xl font-semibold text-center text-black">Nonso Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <Label className="text-gray-700">Email</Label>
          <div>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="text-gray-700"
            />
          </div>
          <div>
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-gray-700">Password</Label>
          <div>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="text-gray-700"
            />
          </div>
          <div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {
            loading ?
            <Loader className="animate-spin"/> :
            <span>Login</span>
          }
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
