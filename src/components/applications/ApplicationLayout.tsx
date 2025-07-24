import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import VideoSection from './VideoSection';
import DetailsSection from './DetailsSection';
import ActionSection from './ActionSection';
import GenreSelector from '../forms/GenreSelector';

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

  const handleApplicationUpdated = () => {
    // TODO: Implement application update callback
    console.log('Application updated');
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Poster + Film Title */}
      <div className="glass-container rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Poster - Left Side */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 max-w-sm mx-auto lg:mx-0">
              <img
                src={application.files.posterFile.url}
                alt={`${application.filmTitle} Poster`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Film Title and Details - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Competition Category Logo */}
            <div className="flex items-center space-x-4">
              <img
                src={getCategoryLogo(application.competitionCategory)}
                alt={`${application.competitionCategory} competition logo`}
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className={`text-lg ${getClass('subtitle')} text-[#FCB283]`}>
                  {application.competitionCategory === 'youth' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกเยาวชน' : 'Youth Fantastic Short Film Award')}
                  {application.competitionCategory === 'future' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกอนาคต' : 'Future Fantastic Short Film Award')}
                  {application.competitionCategory === 'world' && (currentLanguage === 'th' ? 'รางวัลหนังสั้นแฟนตาสติกโลก' : 'World Fantastic Short Film Award')}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(application.status)}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  {getStatusText(application.status)}
                </span>
              </div>
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

            {/* Quick Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">
                  {application.format === 'live-action' ? '🎬' : '🎨'}
                </div>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-1`}>
                  {currentLanguage === 'th' ? 'รูปแบบ' : 'Format'}
                </p>
                <p className={`text-sm ${getClass('body')} text-[#FCB283] capitalize`}>
                  {application.format.replace('-', ' ')}
                </p>
              </div>

              <div className="glass-card p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-1`}>
                  {currentLanguage === 'th' ? 'ความยาว' : 'Duration'}
                </p>
                <p className={`text-sm ${getClass('body')} text-[#FCB283]`}>
                  {application.duration} {currentLanguage === 'th' ? 'นาที' : 'min'}
                </p>
              </div>

              <div className="glass-card p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🎭</div>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-1`}>
                  {currentLanguage === 'th' ? 'แนว' : 'Genres'}
                </p>
                <p className={`text-sm ${getClass('body')} text-[#FCB283]`}>
                  {application.genres.length} {currentLanguage === 'th' ? 'แนว' : 'genres'}
                </p>
              </div>

              <div className="glass-card p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">📄</div>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-1`}>
                  {currentLanguage === 'th' ? 'รหัส' : 'ID'}
                </p>
                <p className={`text-xs ${getClass('body')} text-[#FCB283] font-mono`}>
                  {application.id.slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Video + Details */}
      <VideoSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
      />

      <DetailsSection 
        application={application}
        isEditMode={isEditMode}
        onSave={handleSave}
      />

      <ActionSection 
        application={application}
        isEditMode={isEditMode}
        canEdit={canEdit}
        onEditToggle={handleEditToggle}
        onSave={() => handleSave({})}
        onApplicationUpdated={handleApplicationUpdated}
      />
    </div>
  );

  function getCategoryLogo(category: string) {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  }

  function getStatusBadgeColor(status: string) {
    return status === 'submitted' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }

  function getStatusText(status: string) {
    return status === 'submitted' 
      ? (currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted')
      : (currentLanguage === 'th' ? 'ร่าง' : 'Draft');
  }
};

export default ApplicationLayout;