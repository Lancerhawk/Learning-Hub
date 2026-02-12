import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LanguagePage from './components/LanguagePage';
import DSAPage from './components/DSAPage';
import CustomListsPage from './components/CustomListsPage';
import CustomListViewer from './components/CustomListViewer';
import ListBuilder from './components/ListBuilder';
import PublicListsPage from './components/PublicListsPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';
import ScrollToTop from './components/ScrollToTop';
import ChangelogButton from './components/ChangelogButton';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import { languagesData, dsaTopicsData } from './data/checklistData';
import { examinationsData, getAllExams } from './data/examinationsData';
import ExaminationsPage from './components/ExaminationsPage';
import { playClickSound } from './utils/sounds';
import { loadProgress, loadAllProgress, saveAllProgress, migrateLocalStorageToDb } from './utils/progressSync';

function AppContent() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const isVerified = user?.emailVerified === true; // Check if email is verified
  const canUseDatabase = isAuthenticated && isVerified; // Only verified users can use database
  const previousAuthRef = useRef(isAuthenticated);
  const hasMigratedRef = useRef(false); // Track if migration has been done

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const handleGlobalClick = () => {
      playClickSound();
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Initialize expanded sections once on mount
  useEffect(() => {
    const initialExpanded = {};
    Object.keys(languagesData).forEach(lang => {
      languagesData[lang].dsaMastery.forEach((_, idx) => {
        initialExpanded[`${lang}-dsa-${idx}`] = true;
      });
      languagesData[lang].devMastery.forEach((_, idx) => {
        initialExpanded[`${lang}-dev-${idx}`] = true;
      });
    });
    dsaTopicsData.forEach((_, idx) => {
      initialExpanded[`dsa-${idx}`] = true;
    });
    Object.values(examinationsData).forEach(exam => {
      exam.sections.forEach((_, idx) => {
        initialExpanded[`${exam.id}-${idx}`] = true;
      });
    });
    setExpandedSections(initialExpanded);
  }, []); // Only run once on mount

  // Load all progress on mount or auth change (OPTIMIZED - single request!)
  useEffect(() => {
    const loadAll = async () => {
      setIsLoadingProgress(true);

      try {
        // Load ALL progress in a single request (17 requests → 1 request!)
        const allProgress = await loadAllProgress(canUseDatabase);

        // Convert from API format to app format
        const loadedData = {};

        // Languages
        Object.keys(languagesData).forEach(lang => {
          loadedData[`${lang}_dsa`] = allProgress.language_dsa?.[lang] || {};
          loadedData[`${lang}_dev`] = allProgress.language_dev?.[lang] || {};
        });

        // DSA Topics
        loadedData.dsa = allProgress.dsa_topics?.dsa || {};

        // Examinations
        Object.keys(examinationsData).forEach(examId => {
          loadedData[examId] = allProgress.examination?.[examId] || {};
        });

        setCheckedItems(loadedData);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadAll();
  }, [canUseDatabase]); // Re-load when database access changes (login/verification)

  // Migrate localStorage to database on login
  // Runs whenever user logs in AND has localStorage data to migrate
  useEffect(() => {
    const wasAuthenticated = previousAuthRef.current;

    if (canUseDatabase && !wasAuthenticated) {
      // User just logged in AND is verified - check if there's localStorage data to migrate
      console.log('🔍 Checking for localStorage data to migrate...');

      // IMPORTANT: Check ownership to prevent cross-user contamination
      const progressOwnerId = localStorage.getItem('progress_owner_id');

      if (progressOwnerId && progressOwnerId !== user?.id) {
        // Data belongs to different user - clear it, don't migrate!
        console.log(`🚫 Found progress from different user (${progressOwnerId}). Clearing...`);

        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith('_progress')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem('progress_owner_id');

        console.log(`🧹 Cleared ${keysToRemove.length} items to prevent cross-user contamination`);
        previousAuthRef.current = isAuthenticated;
        return; // Don't migrate
      }

      // Check if there's any progress in localStorage
      let hasLocalStorageData = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('_progress')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (Object.keys(parsed).length > 0) {
                hasLocalStorageData = true;
                break;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      if (hasLocalStorageData) {
        console.log('🔄 Found localStorage data - migrating to database...');

        migrateLocalStorageToDb().then(async () => {
          console.log('✅ Migration complete! Reloading progress from database...');

          // IMPORTANT: Reload progress from database after migration
          setIsLoadingProgress(true);
          try {
            const allProgress = await loadAllProgress(canUseDatabase);

            const loadedData = {};
            Object.keys(languagesData).forEach(lang => {
              loadedData[`${lang}_dsa`] = allProgress.language_dsa?.[lang] || {};
              loadedData[`${lang}_dev`] = allProgress.language_dev?.[lang] || {};
            });
            loadedData.dsa = allProgress.dsa_topics?.dsa || {};
            Object.keys(examinationsData).forEach(examId => {
              loadedData[examId] = allProgress.examination?.[examId] || {};
            });

            setCheckedItems(loadedData);
            console.log('✅ Progress reloaded from database after migration!');
          } catch (error) {
            console.error('Failed to reload progress after migration:', error);
          } finally {
            setIsLoadingProgress(false);
          }
        }).catch(error => {
          console.error('❌ Migration failed:', error);
        });
      } else {
        console.log('ℹ️ No localStorage data to migrate');
      }
    }

    previousAuthRef.current = isAuthenticated;
  }, [canUseDatabase, isAuthenticated, user?.id]);

  // Save progress whenever checkedItems changes (debounced)
  useEffect(() => {
    if (isLoadingProgress) return; // Don't save during initial load
    if (Object.keys(checkedItems).length === 0) return; // Don't save empty state

    const timeoutId = setTimeout(() => {
      // OPTIMIZED: Save all checklists in ONE request instead of 17+
      saveAllProgress(checkedItems, canUseDatabase, user?.id);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [checkedItems, isLoadingProgress]); // Removed isAuthenticated from deps to prevent re-save on auth change

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleTopic = (topicKey) => {
    setExpandedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  const toggleItem = (item, language, sectionType, hasResources = false) => {
    const storageKey = sectionType ? `${language}_${sectionType}` : language;

    const isExamination = sectionType === null && examinationsData[language];

    if (isExamination) {
      const examData = examinationsData[language];

      if (hasResources && !checkedItems[storageKey]?.[item]) {
        setConfirmModal({ item, language, sectionType, isExamination, examData });
        return;
      }

      if (hasResources && checkedItems[storageKey]?.[item]) {
        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === item);
        if (topic) {
          setCheckedItems(prev => {
            const newChecked = { ...prev[storageKey] };
            newChecked[item] = false;



            if (topic.resources) {
              if (topic.resources.videos) {
                topic.resources.videos.forEach(v => delete newChecked[`${item}__videos__${v.title}`]);
              }
              if (topic.resources.practice) {
                topic.resources.practice.forEach(p => delete newChecked[`${item}__practice__${p.title}`]);
              }
              if (topic.resources.references) {
                topic.resources.references.forEach(r => delete newChecked[`${item}__references__${r.title}`]);
              }
            }

            return { ...prev, [storageKey]: newChecked };
          });
          return;
        }
      }

      setCheckedItems(prev => ({
        ...prev,
        [storageKey]: {
          ...prev[storageKey],
          [item]: !prev[storageKey]?.[item]
        }
      }));
      return;
    }

    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    if (hasResources && !checkedItems[storageKey]?.[item]) {
      setConfirmModal({ item, language, sectionType });
      return;
    }

    if (hasResources && checkedItems[storageKey]?.[item]) {
      const topic = currentData.flatMap(s => s.items).find(t => typeof t === 'object' && t.name === item);
      if (topic && topic.resources) {
        const allResources = [
          ...(topic.resources.videos || []).map(v => `${item}__videos__${v.title}`),
          ...(topic.resources.practice || []).map(p => `${item}__practice__${p.title}`)
        ];

        setCheckedItems(prev => {
          const newChecked = { ...prev[storageKey] };
          newChecked[item] = false;
          allResources.forEach(r => {
            delete newChecked[r];
          });
          return {
            ...prev,
            [storageKey]: newChecked
          };
        });
        return;
      }
    }

    setCheckedItems(prev => ({
      ...prev,
      [storageKey]: {
        ...prev[storageKey],
        [item]: !prev[storageKey]?.[item]
      }
    }));
  };

  const confirmTopicCompletion = (markAllDone) => {
    if (!confirmModal) return;

    const { item, language, sectionType, isExamination, examData } = confirmModal;
    const storageKey = sectionType ? `${language}_${sectionType}` : language;

    if (isExamination) {
      if (markAllDone) {
        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === item);
        if (topic) {
          setCheckedItems(prev => {
            const newChecked = { ...prev[storageKey], [item]: true };


            if (topic.resources) {
              if (topic.resources.videos) {
                topic.resources.videos.forEach(v => {
                  newChecked[`${item}__videos__${v.title}`] = true;
                });
              }
              if (topic.resources.practice) {
                topic.resources.practice.forEach(p => {
                  newChecked[`${item}__practice__${p.title}`] = true;
                });
              }
              if (topic.resources.references) {
                topic.resources.references.forEach(r => {
                  newChecked[`${item}__references__${r.title}`] = true;
                });
              }
            }

            return { ...prev, [storageKey]: newChecked };
          });
        }
      } else {
        setCheckedItems(prev => ({
          ...prev,
          [storageKey]: {
            ...prev[storageKey],
            [item]: true
          }
        }));
      }

      setConfirmModal(null);
      return;
    }

    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    if (markAllDone) {
      const topic = currentData.flatMap(s => s.items).find(t => typeof t === 'object' && t.name === item);
      if (topic && topic.resources) {
        const allResources = [
          ...(topic.resources.videos || []).map(v => `${item}__videos__${v.title}`),
          ...(topic.resources.practice || []).map(p => `${item}__practice__${p.title}`)
        ];

        setCheckedItems(prev => {
          const newChecked = { ...prev[storageKey], [item]: true };
          allResources.forEach(r => {
            newChecked[r] = true;
          });
          return {
            ...prev,
            [storageKey]: newChecked
          };
        });
      }
    } else {
      setCheckedItems(prev => ({
        ...prev,
        [storageKey]: {
          ...prev[storageKey],
          [item]: true
        }
      }));
    }

    setConfirmModal(null);
  };

  const toggleResourceItem = (topicName, resourceType, resourceTitle, language, sectionType) => {
    const storageKey = sectionType ? `${language}_${sectionType}` : language;
    const resourceKey = `${topicName}__${resourceType}__${resourceTitle}`;

    const isExamination = sectionType === null && examinationsData[language];

    if (isExamination) {
      const examData = examinationsData[language];

      console.log('=== TOGGLE RESOURCE ITEM ===');
      console.log('Topic:', topicName);
      console.log('Resource:', resourceType, resourceTitle);
      console.log('Exam ID:', language);
      console.log('Is Examination:', isExamination);

      setCheckedItems(prev => {
        const newChecked = {
          ...prev[storageKey],
          [resourceKey]: !prev[storageKey]?.[resourceKey]
        };

        console.log('Storage Key:', storageKey);
        console.log('Resource Key:', resourceKey);
        console.log('New value:', newChecked[resourceKey]);

        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === topicName);
        if (topic) {
          const allItems = [];


          if (topic.resources) {
            if (topic.resources.videos) {
              topic.resources.videos.forEach(v => allItems.push(`${topicName}__videos__${v.title}`));
            }
            if (topic.resources.practice) {
              topic.resources.practice.forEach(p => allItems.push(`${topicName}__practice__${p.title}`));
            }
            if (topic.resources.references) {
              topic.resources.references.forEach(r => allItems.push(`${topicName}__references__${r.title}`));
            }
          }

          console.log('All resource keys:', allItems);
          console.log('Checked states:', allItems.map(key => ({ key, checked: !!newChecked[key] })));

          const allChecked = allItems.length > 0 && allItems.every(item => newChecked[item]);
          newChecked[topicName] = allChecked;

          console.log('All checked?', allChecked);
          console.log('Setting parent topic to:', allChecked);
        }

        console.log('===========================');

        return {
          ...prev,
          [storageKey]: newChecked
        };
      });
      return;
    }

    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    setCheckedItems(prev => {
      const newChecked = {
        ...prev[storageKey],
        [resourceKey]: !prev[storageKey]?.[resourceKey]
      };

      const topic = currentData.flatMap(s => s.items).find(t => typeof t === 'object' && t.name === topicName);
      if (topic && topic.resources) {
        const allResources = [
          ...(topic.resources.videos || []).map(v => `${topicName}__videos__${v.title}`),
          ...(topic.resources.practice || []).map(p => `${topicName}__practice__${p.title}`)
        ];

        const allChecked = allResources.every(r => newChecked[r]);
        newChecked[topicName] = allChecked;
      }

      return {
        ...prev,
        [storageKey]: newChecked
      };
    });
  };

  const calculateSectionProgress = (items, language, sectionType) => {
    const storageKey = sectionType ? `${language}_${sectionType}` : language;
    if (!items || items.length === 0) return 0;

    const completed = items.filter(item => {
      const itemName = typeof item === 'string' ? item : item.name;
      return checkedItems[storageKey]?.[itemName];
    }).length;

    return Math.round((completed / items.length) * 100);
  };

  const getTopicResourceProgress = (topicName, language, sectionType) => {
    const storageKey = sectionType ? `${language}_${sectionType}` : language;
    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    const topic = currentData.flatMap(s => s.items).find(t => typeof t === 'object' && t.name === topicName);
    if (!topic || !topic.resources) return 0;

    const allResources = [
      ...(topic.resources.videos || []).map(v => `${topicName}__videos__${v.title}`),
      ...(topic.resources.practice || []).map(p => `${topicName}__practice__${p.title}`)
    ];

    if (allResources.length === 0) return 0;

    const completed = allResources.filter(r => checkedItems[storageKey]?.[r]).length;
    return Math.round((completed / allResources.length) * 100);
  };

  const calculateLanguageProgress = (language) => {
    const dsaKey = `${language}_dsa`;
    const devKey = `${language}_dev`;

    const dsaItems = languagesData[language].dsaMastery.flatMap(s => s.items);
    const devItems = languagesData[language].devMastery.flatMap(s => s.items);

    const dsaCompleted = dsaItems.filter(item => {
      const itemName = typeof item === 'string' ? item : item.name;
      return checkedItems[dsaKey]?.[itemName];
    }).length;

    const devCompleted = devItems.filter(item => {
      const itemName = typeof item === 'string' ? item : item.name;
      return checkedItems[devKey]?.[itemName];
    }).length;

    return {
      dsa: dsaItems.length > 0 ? Math.round((dsaCompleted / dsaItems.length) * 100) : 0,
      dev: devItems.length > 0 ? Math.round((devCompleted / devItems.length) * 100) : 0
    };
  };

  const handleResetProgress = async (identifier) => {
    if (identifier === 'dsa') {
      await saveProgress('dsa_topics', 'dsa', {}, isAuthenticated);
      setCheckedItems(prev => ({ ...prev, dsa: {} }));
    } else if (identifier.startsWith('gate-') || examinationsData[identifier]) {
      await saveProgress('examination', identifier, {}, isAuthenticated);
      setCheckedItems(prev => ({ ...prev, [identifier]: {} }));
    } else {
      await saveProgress('language_dsa', identifier, {}, isAuthenticated);
      await saveProgress('language_dev', identifier, {}, isAuthenticated);
      setCheckedItems(prev => ({
        ...prev,
        [`${identifier}_dsa`]: {},
        [`${identifier}_dev`]: {}
      }));
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex min-h-screen bg-slate-950">
          <style>{`
            @keyframes glow {
              0%, 100% { text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41; }
              50% { text-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41; }
            }
            .terminal-glow {
              animation: glow 2s ease-in-out infinite;
            }
            .dropdown-content {
              display: grid;
              grid-template-rows: 1fr;
              transition: grid-template-rows 0.3s ease-out, opacity 0.3s ease-out, margin 0.3s ease-out;
              opacity: 1;
            }
            .dropdown-content-hidden {
              grid-template-rows: 0fr;
              opacity: 0;
              margin-top: 0;
              margin-bottom: 0;
            }
            .dropdown-inner {
              overflow: hidden;
            }
          `}</style>

          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 lg:hidden bg-slate-900 border-2 border-green-500 p-2 rounded text-green-500 hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          <EmailVerificationBanner />

          <ChangelogButton />

          <div className="flex-1 lg:ml-0">
            <Routes>
              <Route path="/" element={<HomePage calculateLanguageProgress={calculateLanguageProgress} checkedItems={checkedItems} />} />

              {Object.keys(languagesData).map(lang => (
                <Route
                  key={lang}
                  path={`/${lang}`}
                  element={
                    <LanguagePage
                      language={lang}
                      data={languagesData[lang]}
                      checkedItems={{
                        ...checkedItems[`${lang}_dsa`],
                        ...checkedItems[`${lang}_dev`]
                      }}
                      expandedSections={expandedSections}
                      expandedTopics={expandedTopics}
                      toggleSection={toggleSection}
                      toggleTopic={toggleTopic}
                      toggleItem={toggleItem}
                      toggleResourceItem={toggleResourceItem}
                      calculateSectionProgress={calculateSectionProgress}
                      getTopicResourceProgress={getTopicResourceProgress}
                      confirmModal={confirmModal}
                      setConfirmModal={setConfirmModal}
                      confirmTopicCompletion={confirmTopicCompletion}
                      resetProgress={handleResetProgress}
                    />
                  }
                />
              ))}

              <Route
                path="/dsa"
                element={
                  <DSAPage
                    data={dsaTopicsData}
                    checkedItems={checkedItems.dsa || {}}
                    expandedSections={expandedSections}
                    expandedTopics={expandedTopics}
                    toggleSection={toggleSection}
                    toggleTopic={toggleTopic}
                    toggleItem={toggleItem}
                    toggleResourceItem={toggleResourceItem}
                    calculateSectionProgress={calculateSectionProgress}
                    getTopicResourceProgress={getTopicResourceProgress}
                    confirmModal={confirmModal}
                    setConfirmModal={setConfirmModal}
                    confirmTopicCompletion={confirmTopicCompletion}
                    resetProgress={handleResetProgress}
                  />
                }
              />

              {getAllExams().map(exam => (
                <Route
                  key={exam.id}
                  path={`/examinations/${exam.id}`}
                  element={
                    <ExaminationsPage
                      examData={exam}
                      resetProgress={handleResetProgress}
                      checkedItems={checkedItems}
                      setCheckedItems={setCheckedItems}
                    />
                  }
                />
              ))}


              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route path="/explore" element={<ProtectedRoute requireVerification={true}><PublicListsPage /></ProtectedRoute>} />
              <Route path="/explore/:id" element={<ProtectedRoute requireVerification={true}><CustomListViewer isPublicView={true} /></ProtectedRoute>} />

              <Route path="/custom-lists" element={<ProtectedRoute requireVerification={true}><CustomListsPage /></ProtectedRoute>} />
              <Route path="/custom-lists/new" element={<ProtectedRoute requireVerification={true}><ListBuilder /></ProtectedRoute>} />
              <Route path="/custom-lists/:id/edit" element={<ProtectedRoute requireVerification={true}><ListBuilder /></ProtectedRoute>} />
              <Route path="/custom-lists/:id" element={<ProtectedRoute requireVerification={true}><CustomListViewer /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}