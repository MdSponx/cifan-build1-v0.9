import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { profileService } from '../../services/profileService';
import { ProfileFormData, UserProfile } from '../../types/profile.types';
import ProfileForm from '../profile/ProfileForm';
import { CheckCircle, User, ArrowLeft } from 'lucide-react';

const ProfileEditPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getClass } = useTypography();
  const { userProfile, refreshUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    if (userProfile) {
      setInitialData({
        fullNameEN: userProfile.fullNameEN,
        fullNameTH: userProfile.fullNameTH,
        birthDate: userProfile.birthDate.toISOString().split('T')[0],
        phoneNumber: userProfile.phoneNumber
      });
    }
  }, [userProfile]);

  const handleSubmit = async (formData: ProfileFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await profileService.updateProfileFromForm(formData);
      await refreshUserProfile();
      setIsComplete(true);
      
      // Redirect back after a short delay
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || t('profile.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#110D16] flex items-center justify-center px-4">
        <div className="glass-container rounded-2xl p-8 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-2xl ${getClass('header')} text-white mb-4`}>
            {t('profile.updateComplete')}
          </h2>
          <p className={`text-white/80 ${getClass('body')} mb-6`}>
            {t('profile.updateCompleteMessage')}
          </p>
          <div className="loading-spinner mx-auto"></div>
          <p className={`text-sm text-white/60 mt-2 ${getClass('menu')}`}>
            {t('profile.redirecting')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cifan-dark pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 text-white/80 hover:text-white transition-colors mr-4 ${getClass('menu')}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className={`text-3xl ${getClass('header')} text-white mb-2`}>
              Profile
            </h1>
            <p className={`text-white/80 ${getClass('subtitle')}`}>
              Edit your profile information
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-container rounded-2xl p-8 max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className={`text-red-400 text-center ${getClass('body')}`}>{error}</p>
            </div>
          )}

          <ProfileForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Current Profile Info */}
        {userProfile && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="glass-container rounded-xl p-6">
              <h3 className={`text-lg ${getClass('header')} text-white mb-4`}>
                {t('profile.currentInfo')}
              </h3>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${getClass('body')}`}>
                <div>
                  <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.fullNameEN')}:</span>
                  <p className="text-white font-medium">{userProfile.fullNameEN}</p>
                </div>
                {userProfile.fullNameTH && (
                  <div>
                    <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.fullNameTH')}:</span>
                    <p className="text-white font-medium">{userProfile.fullNameTH}</p>
                  </div>
                )}
                <div>
                  <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.age')}:</span>
                  <p className="text-white font-medium">{userProfile.age} {t('profile.yearsOld')}</p>
                </div>
                <div>
                  <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.phoneNumber')}:</span>
                  <p className="text-white font-medium">{userProfile.phoneNumber}</p>
                </div>
                <div>
                  <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.email')}:</span>
                  <p className="text-white font-medium">{userProfile.email}</p>
                </div>
                <div>
                  <span className={`text-white/60 ${getClass('menu')}`}>{t('profile.lastUpdated')}:</span>
                  <p className="text-white font-medium">
                    {userProfile.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditPage;
