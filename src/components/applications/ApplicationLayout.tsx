import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import VideoSection from './VideoSection';
import DetailsSection from './DetailsSection';
import AnimatedButton from '../ui/AnimatedButton';
import SubmissionConfirm from './SubmissionConfirm';
import { ApplicationService, FilmApplication } from '../../services/applicationService';

interface ApplicationData {
  id: string;
  userId: string;
  applicationId: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted';
  filmTitle: string;
  filmTitleTh?: string;
  genres: string[];
  format: string;
  duration: number;
  synopsis: string;
  files: {
    filmFile: {
      url: string;
      name: string;
      size: number;
    };
    posterFile: {
      url: string;
      name: string;
      size: number;
    };
    proofFile?: {
      url: string;
      name: string;
      size: number;
    };
  };
  submittedAt: any;
  createdAt: any;
  lastModified: any;
}

interface ApplicationLayoutProps {
  application: ApplicationData;
}

const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({ application }) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [isEditMode, setIsEditMode] = useState(false);
  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine if application can be edited (only drafts can be edited)
  const canEdit = application.status === 'draft';

  const handleEditToggle = () => {
    if (canEdit) {
      setIsEditMode(!isEditMode);
    }
  };

  const handleSave = async (updatedData: Partial<ApplicationData>) => {
    // TODO: Implement save functionality
    console.log('Saving updated data:', updatedData);
    setIsEditMode(false);
  };

  const handleSaveDraft = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // TODO: Implement save draft functionality
      console.log('Saving draft...');
      alert(currentLanguage === 'th' ? 'บันทึกร่างเรียบร้อย' : 'Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitApplication = () => {
    setShowSubmissionConfirm(true);
  };

  const handleDeleteApplication = async () => {
    if (isProcessing) return;
    
    const confirmed = window.confirm(
      currentLanguage === 'th' 
        ? 'คุณแน่ใจหรือไม่ที่จะลบใบสมัครนี้? การกระทำนี้ไม่สามารถยกเลิกได้'
        : 'Are you sure you want to delete this application? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const applicationService = new ApplicationService();
      await applicationService.deleteApplication(application.id);
      
      // Redirect back to applications list
      window.location.hash = '#my-applications';
    } catch (error) {
      console.error('Error deleting application:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmissionComplete = () => {
    // Refresh the page or redirect
    window.location.reload();
  };

  const getCategoryLogo = (category: string) => {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      youth: {
        th: 'รางวัลหนังสั้นแฟนตาสติกเยาวชน',
        en: 'Youth Fantastic Short Film Award'
      },
      future: {
        th: 'รางวัลหนังสั้นแฟนตาสติกอนาคต',
        en: 'Future Fantastic Short Film Award'
      },
      world: {
        th: 'รางวัลหนังสั้นแฟนตาสติกโลก',
        en: 'World Fantastic Short Film Award'
      }
    };
    return titles[category as keyof typeof titles]?.[currentLanguage] || category;
  };

  return (
    <div className="space-y-8">
      
      {/* Section 1: Film Info Container */}
      <div className="glass-container rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Poster - Left Side (1/3) */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 max-w-sm mx-auto lg:mx-0">
              <img
                src={application.files.posterFile.url}
                alt={`${application.filmTitle} Poster`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Film Info - Right Side (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Competition Category */}
            <div className="flex items-center space-x-4">
              <img
                src={getCategoryLogo(application.competitionCategory)}
                alt={`${application.competitionCategory} competition logo`}
                className="h-12 w-auto object-contain"
              />
              <h3 className={`text-lg ${getClass('subtitle')} text-[#FCB283]`}>
                {getCategoryTitle(application.competitionCategory)}
              </h3>
            </div>

            {/* Film Title */}
            <div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl ${getClass('header')} mb-2 text-white leading-tight`}>
                {currentLanguage === 'th' && application.filmTitleTh 
                  ? application.filmTitleTh 
                  : application.filmTitle}
              </h1>
              {((currentLanguage === 'th' && application.filmTitleTh) || (currentLanguage === 'en' && application.filmTitleTh)) && (
                <h2 className={`text-xl sm:text-2xl ${getClass('subtitle')} text-[#FCB283] opacity-80`}>
                  {currentLanguage === 'th' ? application.filmTitle : application.filmTitleTh}
                </h2>
              )}
            </div>

            {/* Compact Film Details */}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-sm border border-[#FCB283]/30">
                {application.format === 'live-action' ? '🎬 Live Action' : '🎨 Animation'}
              </span>
              <span className="px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-sm border border-[#FCB283]/30">
                ⏱️ {application.duration} {currentLanguage === 'th' ? 'นาที' : 'min'}
              </span>
              <span className="px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-sm border border-[#FCB283]/30">
                🎭 {application.genres.join(', ')}
              </span>
            </div>

            {/* Synopsis */}
            <div>
              <h4 className={`text-lg ${getClass('subtitle')} text-white mb-3`}>
                {currentLanguage === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
              </h4>
              <p className={`${getClass('body')} text-white/90 leading-relaxed`}>
                {application.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Video Only */}
      <VideoSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
      />

      {/* Edit Mode: Form-style Layout */}
      {isEditMode && (
        <DetailsSection 
          application={application}
          isEditMode={isEditMode}
          onSave={handleSave}
        />
      )}

      {/* Bottom Action Buttons */}
      <div className="flex justify-between items-center">
        
        {/* Delete Button - Bottom Left */}
        {canEdit && (
          <AnimatedButton
            variant="outline"
            size="medium"
            icon="🗑️"
            onClick={handleDeleteApplication}
            className={isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentLanguage === 'th' ? 'ลบ' : 'Delete'}
          </AnimatedButton>
        )}

        {/* Spacer for non-editable applications */}
        {!canEdit && <div></div>}

        {/* Submit + Save Draft Buttons - Bottom Right */}
        {canEdit && (
          <div className="flex gap-4">
            <AnimatedButton
              variant="secondary"
              size="medium"
              icon="💾"
              onClick={handleSaveDraft}
              className={isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {currentLanguage === 'th' ? 'บันทึกร่าง' : 'Save Draft'}
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="medium"
              icon="📤"
              onClick={handleSubmitApplication}
              className={isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {currentLanguage === 'th' ? 'ส่งใบสมัคร' : 'Submit'}
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Submission Confirmation Modal */}
      <SubmissionConfirm
        application={application as FilmApplication}
        isOpen={showSubmissionConfirm}
        onClose={() => setShowSubmissionConfirm(false)}
        onSubmitted={handleSubmissionComplete}
      />
    </div>
  );
};

export default ApplicationLayout;