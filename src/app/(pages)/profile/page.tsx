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
  const { getProfile } = useProfile();
  const { isAuthenticated } = useAuthRedirect();
  const { data: user, isLoading } = getProfile;
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  if (isLoading) return <Loader className="w-full h-screen" />;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <Pencil />
            Edit Profile
          </Button>
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
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Name</h2>
          <p>{user?.data?.name}</p>
        </span>

        <span className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Email</h2>
          <p>{user?.data?.email}</p>
        </span>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user?.data}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </Container>
  );
};

export default ProfilePage;
