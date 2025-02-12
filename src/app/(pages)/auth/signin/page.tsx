'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

type AuthError = {
  message: string;
};

// validation scema
const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SignIn() {
  // redirecting to dashboard if user is authenticated
  const { isAuthenticated } = useAuthRedirect();

  // states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // router
  const router = useRouter();

  // auth hok
  const { signin, isLoading } = useAuth();

  // to handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // validating the form data
      await signInSchema.validate(formData, { abortEarly: false });

      // signin function to signin the user
      signin(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            router.replace('/dashboard');
            setFormData({
              email: '',
              password: '',
            });
          },
          onError: (error: AuthError) => {
            setErrors({});
            toast.error(error.message || 'An error occurred during signin');
          },
        }
      );
    } catch (err: unknown) {
      // if validation error is there
      if (err instanceof yup.ValidationError) {
        const fieldErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // if authencated user
  if (isAuthenticated) {
    return null;
  }

  return (
    <Container className="flex items-center justify-center h-screen w-full">
      <Card className="flex justify-between items-center gap-2 flex-col">
        {/* heading  */}
        <h1 className="text-center text-2xl font-bold">Signin</h1>
        {/* form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* email  */}
          <Input
            label="Email"
            value={formData.email}
            className="p-2"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
            disabled={isLoading}
            error={errors.email}
          />
          {/* password  */}
          <Input
            label="Password"
            type="password"
            value={formData.password}
            className="p-2"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter your password"
            disabled={isLoading}
            error={errors.password}
          />
          {/* submit button  */}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
          {/* hrozontal rule */}
          <div className="flex items-center gap-2 justify-center my-4">
            <hr className="w-full border-gray-300 dark:border-gray-600" />
            <span className="text-gray-500 dark:text-gray-400">OR</span>
            <hr className="w-full border-gray-300 dark:border-gray-600" />
          </div>

          {/* redicret to signup section  */}
          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Dont have an account? <b className="text-blue-500">Sign up</b>
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}
