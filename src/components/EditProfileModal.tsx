import { useProfile } from '@/hooks/useProfile';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Button } from './Button';
import { Input } from './Input';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string };
}

// validation schema
const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  // states
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // profile hook
  const { updateProfile } = useProfile();

  // handle change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // validate form data
      await profileSchema.validate(formData, { abortEarly: false });

      // update profile
      updateProfile({ name: formData.name, email: formData.email });
      onClose();
    } catch (err) {
      // if validation error
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

  // if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        {/* heading  */}
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        {/* form  */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name  */}
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="p-3"
            error={errors.name}
          />
          {/* email  */}
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="p-3"
            error={errors.email}
          />
          {/* action buttons  */}
          <div className="flex justify-end gap-2">
            {/* cancel button  */}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {/* submit button  */}
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
