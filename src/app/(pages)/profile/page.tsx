'use client';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import EditProfileModal from '@/components/EditProfileModal';
import Loader from '@/components/Loader';
import ResetPasswordModal from '@/components/ResetPasswordModal';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useProfile } from '@/hooks/useProfile';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

const ProfilePage = () => {
  // check if user is authenticated
  const { isAuthenticated } = useAuthRedirect();

  // profile hook
  const { getProfile } = useProfile();
  const { data: user, isLoading } = getProfile;

  // states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // if loading
  if (isLoading) return <Loader className="w-full h-screen" />;

  // if  not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        {/* heading  */}
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          {/* edit profile button  */}
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <Pencil />
            Edit Profile
          </Button>
          {/* reset password button  */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsResetPasswordOpen(true)}
          >
            <Pencil />
            Reset Password
          </Button>
        </div>
      </div>
      {/* profile details  */}
      <div className="flex flex-col gap-2">
        {/* name  */}
        <span className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Name</h2>
          <p>{user?.data?.name}</p>
        </span>

        <span className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Email</h2>
          <p>{user?.data?.email}</p>
        </span>
      </div>

      {/* edit profile modal  */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user?.data}
      />

      {/* reset password modal  */}
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </Container>
  );
};

export default ProfilePage;
