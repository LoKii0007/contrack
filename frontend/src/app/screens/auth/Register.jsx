import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, User, Phone } from "lucide-react";
import { useRegisterTenant } from "@/components/react-queries/authQueries";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegisterTenant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      return;
    }
    
    if (!name || !email || !phone || !password) {
      return;
    }

    registerMutation.mutate({
      name,
      email,
      phone: Number(phone),
      password,
    });
  };

  return (
    <div className="min-h-screen z-10 flex items-center justify-center p-4 bg-[#ffffff]">
      <div className="w-full max-w-md">
        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-xl shadow-primary/20 border border-black/20 p-8 bg-gradient-to-b from-primary/20 to-white">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-gray-700" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Create Admin Account
            </h1>
          </div>

          {/* Sign In Fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              {/* Name Input */}
              <div className="relative bg-[#FFFFFF] rounded-xl mb-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full z-20 pl-12 pr-4 py-[10px] border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>

              {/* Email Input */}
              <div className="relative bg-[#FFFFFF] rounded-xl mb-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full z-20 pl-12 pr-4 py-[10px] border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>

              {/* Phone Input */}
              <div className="relative bg-[#FFFFFF] rounded-xl mb-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full z-20 pl-12 pr-4 py-[10px] border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </div>

              {/* Password Input */}
              <div className="relative bg-[#FFFFFF] rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-[10px] border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative bg-[#FFFFFF] rounded-xl mt-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-[10px] border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Match Validation */}
              {password && confirmPassword && password !== confirmPassword && (
                <div className="text-sm text-red-500 mt-1">
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending || (password !== confirmPassword && confirmPassword)}
              className="w-full bg-primary text-secondary hover:bg-primary/90 font-medium py-[10px] rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
