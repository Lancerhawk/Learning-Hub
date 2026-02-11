import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);

  // Global click sound effect
  useEffect(() => {
    const handleGlobalClick = () => {
      playClickSound();
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedData = {};

    // Load each language's DSA and Dev progress
    Object.keys(languagesData).forEach(lang => {
      const dsaProgress = localStorage.getItem(`${lang}_dsa_progress`);
      const devProgress = localStorage.getItem(`${lang}_dev_progress`);

      if (dsaProgress) loadedData[`${lang}_dsa`] = JSON.parse(dsaProgress);
      if (devProgress) loadedData[`${lang}_dev`] = JSON.parse(devProgress);
    });

    // Load DSA topics progress
    const dsaProgress = localStorage.getItem('dsa_topics_progress');
    if (dsaProgress) loadedData.dsa = JSON.parse(dsaProgress);

    // Load examinations progress
    Object.keys(examinationsData).forEach(examId => {
      const examProgress = localStorage.getItem(`${examId}_progress`);
      if (examProgress) loadedData[examId] = JSON.parse(examProgress);
    });

    setCheckedItems(loadedData);

    // Initialize all sections as expanded
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
    // Initialize examination sections as expanded
    Object.values(examinationsData).forEach(exam => {
      exam.sections.forEach((_, idx) => {
        initialExpanded[`${exam.id}-${idx}`] = true;
      });
    });
    setExpandedSections(initialExpanded);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    Object.keys(checkedItems).forEach(key => {
      if (key.includes('_')) {
        // Language-specific progress
        localStorage.setItem(`${key}_progress`, JSON.stringify(checkedItems[key]));
      } else if (key === 'dsa') {
        // DSA topics progress
        localStorage.setItem('dsa_topics_progress', JSON.stringify(checkedItems[key]));
      } else {
        // Examination progress - save with both formats for compatibility
        localStorage.setItem(`${key}_progress`, JSON.stringify(checkedItems[key]));
        localStorage.setItem(`exam_progress_${key}`, JSON.stringify(checkedItems[key]));
      }
    });
  }, [checkedItems]);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleTopic = (topicKey) => {
    setExpandedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  const toggleItem = (item, language, sectionType, hasResources = false) => {
    const storageKey = sectionType ? `${language}_${sectionType}` : language;

    // Check if this is an examination (sectionType is null and language is an exam ID)
    const isExamination = sectionType === null && examinationsData[language];

    if (isExamination) {
      // EXAMINATION LOGIC
      const examData = examinationsData[language];

      // If item has resources and we're trying to check it, show confirmation
      if (hasResources && !checkedItems[storageKey]?.[item]) {
        setConfirmModal({ item, language, sectionType, isExamination, examData });
        return;
      }

      // If unchecking a topic with resources, also uncheck all its subtopics and resources
      if (hasResources && checkedItems[storageKey]?.[item]) {
        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === item);
        if (topic) {
          setCheckedItems(prev => {
            const newChecked = { ...prev[storageKey] };
            newChecked[item] = false;



            // Uncheck all resources
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

      // Simple toggle for examination items without resources
      setCheckedItems(prev => ({
        ...prev,
        [storageKey]: {
          ...prev[storageKey],
          [item]: !prev[storageKey]?.[item]
        }
      }));
      return;
    }

    // LANGUAGE CHECKLIST LOGIC (ORIGINAL - PRESERVED)
    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    // If item has resources and we're trying to check it, show confirmation
    if (hasResources && !checkedItems[storageKey]?.[item]) {
      setConfirmModal({ item, language, sectionType });
      return;
    }

    // If unchecking a topic with resources, also uncheck all its resources
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

    // Default toggle
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
      // EXAMINATION LOGIC
      if (markAllDone) {
        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === item);
        if (topic) {
          setCheckedItems(prev => {
            const newChecked = { ...prev[storageKey], [item]: true };


            // Mark all resources as done
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
        // Mark only the topic as done
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

    // LANGUAGE CHECKLIST LOGIC (ORIGINAL - PRESERVED)
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

    // Check if this is an examination
    const isExamination = sectionType === null && examinationsData[language];

    if (isExamination) {
      // EXAMINATION LOGIC
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

        // Check if all subtopics and resources are checked, then auto-check parent
        const topic = examData.sections.flatMap(s => s.topics).find(t => t.name === topicName);
        if (topic) {
          const allItems = [];


          // Add all resources
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

          // Check if all items are checked (only if there are resources to check)
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

    // LANGUAGE CHECKLIST LOGIC (ORIGINAL - PRESERVED)
    const currentData = sectionType
      ? (sectionType === 'dsa' ? languagesData[language].dsaMastery : languagesData[language].devMastery)
      : dsaTopicsData;

    setCheckedItems(prev => {
      const newChecked = {
        ...prev[storageKey],
        [resourceKey]: !prev[storageKey]?.[resourceKey]
      };

      // Check if all resources are checked
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

  const resetProgress = (identifier) => {
    if (identifier === 'dsa') {
      localStorage.removeItem('dsa_topics_progress');
      setCheckedItems(prev => ({ ...prev, dsa: {} }));
    } else if (identifier.startsWith('gate-') || examinationsData[identifier]) {
      // Reset examination progress
      localStorage.removeItem(`${identifier}_progress`);
      setCheckedItems(prev => ({ ...prev, [identifier]: {} }));
    } else {
      // Reset language progress
      localStorage.removeItem(`${identifier}_dsa_progress`);
      localStorage.removeItem(`${identifier}_dev_progress`);
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

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 lg:hidden bg-slate-900 border-2 border-green-500 p-2 rounded text-green-500 hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Email Verification Banner */}
          <EmailVerificationBanner />

          {/* Changelog Button */}
          <ChangelogButton />

          {/* Main Content */}
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
                      resetProgress={resetProgress}
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
                    resetProgress={resetProgress}
                  />
                }
              />

              {/* Examination Routes */}
              {getAllExams().map(exam => (
                <Route
                  key={exam.id}
                  path={`/examinations/${exam.id}`}
                  element={
                    <ExaminationsPage
                      examData={exam}
                      resetProgress={resetProgress}
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
