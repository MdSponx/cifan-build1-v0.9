import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
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

const MyApplicationsPage = () => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'submissions'),
          where('userId', '==', user.uid),
          orderBy('lastModified', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const userApplications: ApplicationData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Validate required fields before adding
          if (data.filmTitle && data.competitionCategory && data.files) {
            userApplications.push({
              id: doc.id,
              ...data
            } as ApplicationData);
          } else {
            console.warn('Skipping document with missing required fields:', doc.id);
          }
        });

        setApplications(userApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        
        // If orderBy fails (e.g., missing index), try without it
        try {
          const simpleQuery = query(
            collection(db, 'submissions'),
            where('userId', '==', user.uid)
          );

          const querySnapshot = await getDocs(simpleQuery);
          const userApplications: ApplicationData[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            if (data.filmTitle && data.competitionCategory && data.files) {
              userApplications.push({
                id: doc.id,
                ...data
              } as ApplicationData);
            }
          });

          // Sort by lastModified in memory
          userApplications.sort((a, b) => {
            const aTime = a.lastModified?.toDate?.() || new Date(a.lastModified || 0);
            const bTime = b.lastModified?.toDate?.() || new Date(b.lastModified || 0);
            return bTime.getTime() - aTime.getTime();
          });

          setApplications(userApplications);
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const content = {
    th: {
      pageTitle: "ผลงานของฉัน",
      noApplications: "ยังไม่มีผลงานที่ส่งเข้าประกวด",
      noApplicationsDesc: "เริ่มส่งผลงานเข้าประกวดเพื่อดูรายการที่นี่",
      submitNow: "ส่งผลงานเลย",
      backToList: "กลับไปรายการ",
      loading: "กำลังโหลด...",
      draft: "ร่าง",
      submitted: "ส่งแล้ว",
      categories: {
        youth: "รางวัลหนังสั้นแฟนตาสติกเยาวชน",
        future: "รางวัลหนังสั้นแฟนตาสติกอนาคต",
        world: "รางวัลหนังสั้นแฟนตาสติกโลก"
      }
    },
    en: {
      pageTitle: "My Applications",
      noApplications: "No applications submitted yet",
      noApplicationsDesc: "Start submitting your films to see them listed here",
      submitNow: "Submit Now",
      backToList: "Back to List",
      loading: "Loading...",
      draft: "Draft",
      submitted: "Submitted",
      categories: {
        youth: "Youth Fantastic Short Film Award",
        future: "Future Fantastic Short Film Award",
        world: "World Fantastic Short Film Award"
      }
    }
  };

  const currentContent = content[currentLanguage];

  const getCategoryLogo = (category: string) => {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  };

  const getStatusColor = (status: string) => {
    return status === 'submitted' ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'submitted' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApplicationClick = (applicationId: string) => {
    window.location.hash = `#application-detail/${applicationId}`;
  };

  return (
    <div className="min-h-screen bg-[#110D16] text-white pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl ${getClass('header')} mb-6 text-white`}>
            {currentContent.pageTitle}
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
            <p className={`${getClass('body')} text-white/80`}>
              {currentContent.loading}
            </p>
          </div>
        )}

        {/* No Applications State */}
        {!loading && applications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
              {currentContent.noApplications}
            </h2>
            <p className={`${getClass('body')} text-white/80 mb-8 max-w-md mx-auto`}>
              {currentContent.noApplicationsDesc}
            </p>
            <AnimatedButton
              variant="primary"
              size="large"
              icon="📋"
              onClick={() => window.location.hash = '#competition'}
            >
              {currentContent.submitNow}
            </AnimatedButton>
          </div>
        )}

        {/* Applications Grid */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="glass-container rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[#FCB283]/20"
                onClick={() => handleApplicationClick(application.id)}
              >
                {/* Poster Image */}
                <div className="relative aspect-[4/5] bg-white/5">
                  <img
                    src={application.files.posterFile.url}
                    alt={`${application.filmTitle} Poster`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge Overlay */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusBadgeColor(application.status)}`}>
                      {application.status === 'submitted' ? currentContent.submitted : currentContent.draft}
                    </span>
                  </div>

                  {/* Category Logo Overlay */}
                  <div className="absolute top-2 left-2">
                    <img
                      src={getCategoryLogo(application.competitionCategory)}
                      alt={`${application.competitionCategory} logo`}
                      className="h-6 w-auto object-contain opacity-90"
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  {/* Film Title */}
                  <h3 className={`text-sm ${getClass('header')} text-white mb-1 line-clamp-2 leading-tight`}>
                    {currentLanguage === 'th' && application.filmTitleTh 
                      ? application.filmTitleTh 
                      : application.filmTitle}
                  </h3>

                  {/* Category */}
                  <p className={`${getClass('body')} text-[#FCB283] text-xs mb-2 line-clamp-1`}>
                    {currentContent.categories[application.competitionCategory as keyof typeof currentContent.categories]}
                  </p>

                  {/* Film Details */}
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">
                        {currentLanguage === 'th' ? 'ประเภท:' : 'Format:'}
                      </span>
                      <span className="text-white capitalize text-right">
                        {application.format.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">
                        {currentLanguage === 'th' ? 'ความยาว:' : 'Duration:'}
                      </span>
                      <span className="text-white">
                        {application.duration} {currentLanguage === 'th' ? 'นาที' : 'min'}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-white/60 text-center">
                      {application.status === 'submitted' 
                        ? (currentLanguage === 'th' ? 'ส่งเมื่อ: ' : 'Submitted: ') + formatDate(application.submittedAt)
                        : (currentLanguage === 'th' ? 'แก้ไขล่าสุด: ' : 'Last modified: ') + formatDate(application.lastModified)
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
