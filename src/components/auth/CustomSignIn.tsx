'use client';
import { Eye, EyeOff } from "lucide-react";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema
const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().optional(),
});

type FormData = z.infer<typeof signinSchema>;

const CustomSignIn: React.FC = () => {
  const router = useRouter();
  const [otpVisible, setOtpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "jonas_kahnwald@gmail.com",
      otp: "",
    },
  });

  const handleGetOtp = async () => {
    const isValid = await trigger(['email']);
    if (!isValid) return;

    const formData = watch();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/request-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setShowOtpField(true);
        setValue('otp', '');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: FormData) => {
    if (!data.otp || data.otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
          rememberMe: keepLoggedIn
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (data: FormData) => {
    if (showOtpField) {
      handleSignIn(data);
    } else {
      handleGetOtp();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: watch('email') }),
      });

      const result = await response.json();

      if (response.ok) {
        setError('');
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center ">
      <div className="flex w-full py-1 h-auto md:h-auto rounded-l overflow-hidden bg-white">
        {/* Left side: Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 py-10 w-full md:w-1/2 relative">

          {/* Logo positioned top-left on desktop, centered on mobile */}
          <div className="flex items-center space-x-2 mb-12 md:absolute md:top-10 md:left-10 justify-center md:justify-start">
            <img
              src="assets/logo.svg"
              alt="HD Logo"
              className="w-10 h-7"
              width={28}
              height={28}
            />
            <span className="text-black font-semibold text-xl select-none">HD</span>
          </div>

          <div className="mt-8 md:mt-0">
            {/* Left-aligned heading on desktop, centered on mobile */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">Sign in</h2>
            <p className="text-gray-500 text-sm mb-8 select-none text-center md:text-left">Please login to continue to your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form
              autoComplete="off"
              className="space-y-5"
              onSubmit={handleSubmit(onFormSubmit)}
              noValidate
            >
              {/* Email with inline label */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-500 select-none">
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={showOtpField}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              {/* OTP with inline label */}
              {showOtpField && (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    
                  </div>
                  <div className="relative">
                    <input
                      id="otp"
                      {...register('otp')}
                      type={otpVisible ? "text" : "password"}
                      placeholder="OTP"
                      maxLength={6}
                      className="w-full rounded-lg border border-blue-500 px-4 py-2.5 text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setOtpVisible(!otpVisible)}
                    >
                      {otpVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>

                  </div>
                  {errors.otp && <p className="text-red-600 text-xs mt-1.5">{errors.otp.message}</p>}
                  {isOtpSent && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-blue-600 text-xs mt-2 hover:underline disabled:opacity-50 font-medium underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              )}

              {/* Remember me checkbox - only show when OTP field is visible */}
              {showOtpField && (
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 select-none">
                    Keep me logged in
                  </label>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (showOtpField ? 'Signing in...' : 'Sending OTP...') : showOtpField ? 'Sign In' : 'Get OTP'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-8 select-none">
              Need an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 font-semibold hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/signup');
                }}
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="hidden md:block flex-1">
          <img
            src="/assets/waves.png"
            alt="Blue abstract waves with dark background, smooth flowing shapes resembling fabric or liquid folds"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSignIn;