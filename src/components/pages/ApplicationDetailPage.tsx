import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ApplicationLayout from '../applications/ApplicationLayout';
import AnimatedButton from '../ui/AnimatedButton';

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

interface ApplicationDetailPageProps {
  applicationId: string;
}

const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({ applicationId }) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      if (!user || !applicationId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'submissions', applicationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Verify that this application belongs to the current user
          if (data.userId !== user.uid) {
            setError(currentLanguage === 'th' ? 'คุณไม่มีสิทธิ์เข้าถึงใบสมัครนี้' : 'You do not have permission to access this application');
            return;
          }

          // Set application data with proper structure
          setApplication({
            id: docSnap.id,
            userId: data.userId,
            applicationId: data.applicationId || docSnap.id,
            competitionCategory: data.competitionCategory || data.category,
            status: data.status || 'draft',
            filmTitle: data.filmTitle,
            filmTitleTh: data.filmTitleTh,
            genres: data.genres || [],
            format: data.format,
            duration: data.duration,
            synopsis: data.synopsis,
            files: {
              filmFile: data.files?.filmFile || {
                url: '',
                name: '',
                size: 0
              },
              posterFile: data.files?.posterFile || {
                url: '',
                name: '',
                size: 0
              }
            },
            submittedAt: data.submittedAt,
            createdAt: data.createdAt,
            lastModified: data.lastModified
          } as ApplicationData);
        } else {
          setError(currentLanguage === 'th' ? 'ไม่พบใบสมัครที่ระบุ' : 'Application not found');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user, applicationId, currentLanguage]);

  const content = {
    th: {
      backToApplications: "กลับไปรายการใบสมัคร",
      loading: "กำลังโหลด...",
      applicationDetails: "รายละเอียดใบสมัคร"
    },
    en: {
      backToApplications: "Back to Applications",
      loading: "Loading...",
      applicationDetails: "Application Details"
    }
  };

  const currentContent = content[currentLanguage];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
            <p className={`${getClass('body')} text-white/80`}>
              {currentContent.loading}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8">
            <AnimatedButton
              variant="outline"
              size="medium"
              icon="←"
              onClick={() => window.location.hash = '#my-applications'}
            >
              {currentContent.backToApplications}
            </AnimatedButton>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
              {error}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // No Application State
  if (!application) {
    return (
      <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8">
            <AnimatedButton
              variant="outline"
              size="medium"
              icon="←"
              onClick={() => window.location.hash = '#my-applications'}
            >
              {currentContent.backToApplications}
            </AnimatedButton>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📄</div>
            <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
              {currentLanguage === 'th' ? 'ไม่พบใบสมัคร' : 'Application Not Found'}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <AnimatedButton
            variant="outline"
            size="medium"
            icon="←"
            onClick={() => window.location.hash = '#my-applications'}
          >
            {currentContent.backToApplications}
          </AnimatedButton>
          
          <h1 className={`text-2xl sm:text-3xl ${getClass('header')} text-white`}>
            {currentContent.applicationDetails}
          </h1>
          
          <div></div> {/* Spacer for flex layout */}
        </div>

        {/* Application Layout */}
        <ApplicationLayout application={application} />
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
