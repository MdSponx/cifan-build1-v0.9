import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import PosterSection from './PosterSection';
import TitleSection from './TitleSection';
import VideoSection from './VideoSection';
import DetailsSection from './DetailsSection';
import ActionSection from './ActionSection';

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

  return (
    <div className="space-y-8">
      {/* Section 1: Large Poster + Status Badge */}
      <PosterSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
      />

      {/* Section 2: Film Title as H1 Heading */}
      <TitleSection 
        application={application}
        isEditMode={isEditMode}
        onSave={handleSave}
      />

      {/* Section 3: Custom Video Player */}
      <VideoSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
      />

      {/* Section 4: Editable Application Form */}
      <DetailsSection 
        application={application}
        isEditMode={isEditMode}
        onSave={handleSave}
      />

      {/* Section 5: Action Buttons */}
      <ActionSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
        onEditToggle={handleEditToggle}
        onSave={() => handleSave({})}
      />
    </div>
  );
};

export default ApplicationLayout;
