import { useState } from 'react';
import { Camera, Settings, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import fetchProfile from '../api/pwAuthApi';
import '../assets/css/profile.css';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['user_profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) return <Loading />;
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Something went wrong!';
    return <Error message={message} />;
  }

  console.log(data);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-card__header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        {/* Avatar */}
        <div className="profile-card__avatar-wrapper">
          <img
            src={image || data.profile.avatar}
            alt="Profile"
            className="profile-card__avatar-img"
          />
          <label className="profile-card__avatar-upload">
            <Camera size={16} />
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Info Fields */}
        <div className="profile-card__info">
          <div className="profile-card__field">
            <label>Full Name</label>
            <input type="text" value={`${data.first_name} ${data.last_name}`} readOnly />
          </div>

          <div className="profile-card__field">
            <label>Email</label>
            <input type="email" value={data.email} readOnly />
          </div>

          <div className="profile-card__field">
            <label>Phone</label>
            <input type="text" defaultValue="+94 77 123 4567" />
          </div>

          <div className="profile-card__field">
            <label>Address</label>
            <input type="text" defaultValue="Colombo, Sri Lanka" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-card__actions">
          <button className="profile-card__btn-primary">
            <Settings size={18} /> Edit Profile
          </button>
          <button className="profile-card__btn-secondary">
            <Settings size={18} /> Change Password
          </button>
        </div>

        <button className="profile-card__btn-logout">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
