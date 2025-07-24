import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../auth/AuthContext';

interface ApplicationEditPageProps {
  applicationId: string;
}

const ApplicationEditPage: React.FC<ApplicationEditPageProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId || !user) return;

      try {
        const docRef = doc(db, 'submissions', applicationId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setApplication({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, user]);

  const handleBack = () => {
    window.location.hash = `application-detail/${applicationId}`;
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Application not found</p>
          <button
            onClick={() => { window.location.hash = 'my-applications'; }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Application
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
        </div>

        {/* Edit Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Application Edit Form
            </h2>
            <p className="text-gray-600 mb-8">
              Edit form functionality will be implemented here
            </p>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors">
                Delete Application
              </button>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationEditPage;