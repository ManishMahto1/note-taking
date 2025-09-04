'use client';
import { Eye, EyeOff,CalendarDays  } from "lucide-react";
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  dob: z.string(),
  email: z.string().email('Invalid email address'),
  otp: z.string().optional(),
});

type FormData = z.infer<typeof signupSchema>;

const CustomSignUp: React.FC = () => {
  const [otpVisible, setOtpVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "Jonas Khanwald",
      dob: "1997-12-11",
      email: "jonas_kahnwald@gmail.com",
      otp: "",
    },
  });

  const dobValue = watch('dob');

  const handleGetOtp = async () => {
    const isValid = await trigger(['name', 'dob', 'email']);
    if (!isValid) return;

    const formData = watch();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          dob: format(new Date(formData.dob!), "dd MMMM yyyy"),
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

  const handleSignUp = async (data: FormData) => {
    if (!data.otp || data.otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to dashboard on successful verification
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'OTP verification failed');
      }
    } catch (error) {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (data: FormData) => {
    if (showOtpField) {
      handleSignUp(data);
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">Sign up</h2>
            <p className="text-gray-500 text-sm mb-8 select-none text-center md:text-left">Sign up to enjoy the features of HD</p>

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
              {/* Name with inline label */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label htmlFor="name" className="block text-xs font-medium text-gray-500 select-none">
                    Your Name
                  </label>
                </div>
                <input
                  id="name"
                  {...register('name')}
                  type="text"
                  placeholder="Jonas Khanwald"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={showOtpField}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              {/* DOB with inline label */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label
                    htmlFor="dob"
                    className="block text-xs font-medium text-gray-500 select-none"
                  >
                    Date of Birth
                  </label>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !showOtpField && dateInputRef.current?.showPicker()}
                    disabled={showOtpField}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white flex justify-between items-center cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className={
                        dobValue ? "text-black text-sm" : "text-gray-400 text-sm"
                      }
                    >
                      {dobValue
                        ? format(new Date(dobValue), "dd MMMM yyyy")
                        : "Select a date"}
                    </span>
                    <CalendarDays className="h-5 w-5 text-gray-400" />

                  </button>

                  {/* Actual date input (hidden but updates form) */}
                  <input
                    id="dob"
                    type="date"
                    {...register("dob")}
                    ref={dateInputRef}
                    className="absolute opacity-0 w-0 h-0"
                    disabled={showOtpField}
                    onChange={(e) => {
                      setValue("dob", e.target.value, { shouldValidate: true });
                    }}
                  />
                </div>
                {errors.dob && (
                  <p className="text-red-600 text-xs mt-1.5">{errors.dob.message}</p>
                )}
              </div>

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

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (showOtpField ? 'Verifying...' : 'Sending OTP...') : showOtpField ? 'Sign Up' : 'Get OTP'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-8 select-none">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/login';
                }}
              >
                Sign In
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

export default CustomSignUp;