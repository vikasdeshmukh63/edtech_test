import { usePassword } from '@/hooks/usePassword';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Button } from './Button';
import { Input } from './Input';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// validation schema
const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
});

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  // states
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // password hook
  const { resetPassword } = usePassword();

  // handle change funtion
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
      await passwordSchema.validate(formData, { abortEarly: false });

      // reset password
      resetPassword({
        oldPassword: '',
        newPassword: '',
      });
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
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        {/* form  */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* old password  */}
          <Input
            label="Old Password"
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            error={errors.oldPassword}
            placeholder="Enter your old password"
            className="p-3"
          />
          {/* new password  */}
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="Enter your new password"
            className="p-3"
          />
          {/* action buttons  */}
          <div className="flex justify-end gap-2">
            {/* cancel button  */}
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  oldPassword: '',
                  newPassword: '',
                });
                onClose();
              }}
            >
              Cancel
            </Button>
            {/* submit button  */}
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
