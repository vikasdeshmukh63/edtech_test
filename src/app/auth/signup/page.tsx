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

const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();

  const { isAuthenticated } = useAuthRedirect();

  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      await signUpSchema.validate(formData, { abortEarly: false });

      signup(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            router.push('/auth/signin');
          },
          onError: (error: AuthError) => {
            setErrors({});
            toast.error(error.message || 'An error occurred during signup');
          },
        }
      );
    } catch (err: unknown) {
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

  if (isAuthenticated) {
    router.push('/dashboard');
  }

  return (
    <Container className="flex items-center justify-center h-screen w-full">
      <Card className="flex justify-between items-center gap-2 flex-col">
        <h1 className="text-center text-2xl font-bold">Sign up</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            label="Name"
            value={formData.name}
            className="p-2"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isLoading}
            placeholder="Enter your name"
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            className="p-2"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
            error={errors.email}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            className="p-2"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
            error={errors.password}
            placeholder="Enter your password"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign up
          </Button>

          <div className="flex items-center gap-2 justify-center my-4">
            <hr className="w-full border-gray-300 dark:border-gray-600" />
            <span className="text-gray-500 dark:text-gray-400">OR</span>
            <hr className="w-full border-gray-300 dark:border-gray-600" />
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Already have an account? <b className="text-blue-500">Sign in</b>
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}
