import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LanguagePage from './components/LanguagePage';
import DSAPage from './components/DSAPage';
import { languagesData, dsaTopicsData } from './data/checklistData';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);

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

    const { item, language, sectionType } = confirmModal;
    const storageKey = sectionType ? `${language}_${sectionType}` : language;
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

  const resetProgress = (language) => {
    if (language === 'dsa') {
      localStorage.removeItem('dsa_topics_progress');
      setCheckedItems(prev => ({ ...prev, dsa: {} }));
    } else {
      localStorage.removeItem(`${language}_dsa_progress`);
      localStorage.removeItem(`${language}_dev_progress`);
      setCheckedItems(prev => ({
        ...prev,
        [`${language}_dsa`]: {},
        [`${language}_dev`]: {}
      }));
    }
  };

  return (
    <BrowserRouter>
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

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <Routes>
            <Route path="/" element={<HomePage calculateLanguageProgress={calculateLanguageProgress} />} />

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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
