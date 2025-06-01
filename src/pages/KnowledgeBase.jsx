import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { AgentProfile } from '../components/AgentProfile';
import { knowledgeMockQuestions } from '../utils/constants';
import { useSelector } from 'react-redux';
import AnimatedSection from '../ui/animatedSection';
import { LuPlus } from "react-icons/lu";

// Typing effect component
const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <h1 className="text-5xl font-bold text-white">{displayedText}</h1>;
};

const KnowledgeBase = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [showInput, setShowInput] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [fileUploads, setFileUploads] = useState({});
  const [showSubheading, setShowSubheading] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const userProfile = useSelector((state) => ({
    userName: state.business.businessName || 'User',
    businessType: state.business.businessType || 'Unknown Business',
    domain: state.business.domain || 'yourdomain.com',
    industry: state.business.industry || 'Tech',
    businessGoal: state.business.businessGoal || 'Growth',
  }));
  const questionRefs = useRef([]);
  const greetingRef = useRef(null);
  const saveEditRef = useRef(null);
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Check if at least 4 answers are provided
  const hasMinimumAnswers = Object.keys(answers).length >= 4;

  // Load state from localStorage on mount
  useEffect(() => {
    const storedAnswers = localStorage.getItem('agentProfileAnswers');
    const storedSetupComplete = localStorage.getItem('knowledgeBaseSetupComplete');
    const storedFiles = localStorage.getItem('knowledgeBaseFiles');
    if (storedSetupComplete === 'true' && storedAnswers) {
      setIsSetupComplete(true);
      setIsFirstVisit(false);
      setCurrentQuestionIndex(knowledgeMockQuestions.length + 1);
      setAnswers(JSON.parse(storedAnswers));
      if (storedFiles) {
        setFileUploads(JSON.parse(storedFiles));
      }
    } else if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('knowledgeBaseSetupComplete', isSetupComplete);
    // Merge new answers with existing ones
    const storedAnswers = localStorage.getItem('agentProfileAnswers');
    const currentStored = storedAnswers ? JSON.parse(storedAnswers) : {};
    const updatedAnswers = { ...currentStored, ...answers };
    localStorage.setItem('agentProfileAnswers', JSON.stringify(updatedAnswers));
    localStorage.setItem('knowledgeBaseFiles', JSON.stringify(fileUploads));
  }, [isSetupComplete, answers, fileUploads]);

  // Replace placeholders in text
  const replacePlaceholders = useCallback((text) => {
    return text
      .replace(/{userName}/g, userProfile.userName)
      .replace(/{businessType}/g, userProfile.businessType)
      .replace(/{domain}/g, userProfile.domain)
      .replace(/{businessName}/g, userProfile.userName)
      .replace(/{industry}/g, userProfile.industry)
      .replace(/{businessGoal}/g, userProfile.businessGoal);
  }, [userProfile]);

  // Auto-scroll to section
  const scrollToSection = useCallback((index) => {
    setIsProgrammaticScroll(true);
    if (index === -1 && greetingRef.current) {
      greetingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (index >= 0 && index < knowledgeMockQuestions.length && questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (index === knowledgeMockQuestions.length && saveEditRef.current) {
      saveEditRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setIsProgrammaticScroll(false), 1000);
  }, []);

  // Handle wheel scrolling
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 300) return;
      lastScrollTime.current = now;

      const deltaY = event.deltaY;
      let nextIndex = currentQuestionIndex;

      if (deltaY > 0 && currentQuestionIndex < knowledgeMockQuestions.length) {
        nextIndex = currentQuestionIndex + 1;
      } else if (deltaY < 0 && currentQuestionIndex > -1) {
        nextIndex = currentQuestionIndex - 1;
      }

      if (nextIndex !== currentQuestionIndex) {
        setCurrentQuestionIndex(nextIndex);
        if (nextIndex === knowledgeMockQuestions.length && hasMinimumAnswers) {
          setIsSetupComplete(true);
          setIsFirstVisit(false);
        }
        scrollToSection(nextIndex);
      }
    };

    const container = containerRef.current;
    if (container && !isSetupComplete) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentQuestionIndex, scrollToSection, isSetupComplete, hasMinimumAnswers]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index === 'greeting' ? -1 :
                          entry.target.dataset.index === 'save-edit' ? knowledgeMockQuestions.length :
                          parseInt(entry.target.dataset.index, 10);
            if (index !== currentQuestionIndex) {
              setCurrentQuestionIndex(index);
              if (index === knowledgeMockQuestions.length && hasMinimumAnswers) {
                setIsSetupComplete(true);
                setIsFirstVisit(false);
              }
            }
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );

    if (greetingRef.current) observer.observe(greetingRef.current);
    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    if (saveEditRef.current) observer.observe(saveEditRef.current);

    return () => {
      if (greetingRef.current) observer.unobserve(greetingRef.current);
      questionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      if (saveEditRef.current) observer.unobserve(saveEditRef.current);
    };
  }, [currentQuestionIndex, isProgrammaticScroll, hasMinimumAnswers]);

  // Handle option selection
  const handleOptionClick = useCallback((questionId, option, response, question) => {
    if (option.isOther || option.value === 'file_upload' || option.value === 'web_crawl') {
      setShowInput(questionId);
      setCustomInput(answers[questionId] || '');
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: option.value,
      }));
      setShowInput(null);
      setCustomInput('');
      console.log('Submitting:', { questionId, answer: option.value, response });

      const nextIndex = currentQuestionIndex < knowledgeMockQuestions.length - 1
        ? currentQuestionIndex + 1
        : knowledgeMockQuestions.length;
      setCurrentQuestionIndex(nextIndex);
      if (nextIndex === knowledgeMockQuestions.length && hasMinimumAnswers) {
        setIsSetupComplete(true);
        setIsFirstVisit(false);
      }
      setTimeout(() => scrollToSection(nextIndex), 800);
    }
  }, [currentQuestionIndex, scrollToSection, hasMinimumAnswers, answers]);

  // Handle custom input submission
  const handleCustomSubmit = useCallback((questionId, question) => {
    if (customInput.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: customInput,
      }));
      console.log('Submitting:', { questionId, answer: customInput });
    }
    setShowInput(null);
    setCustomInput('');

    const nextIndex = currentQuestionIndex < knowledgeMockQuestions.length - 1
      ? currentQuestionIndex + 1
      : knowledgeMockQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    if (nextIndex === knowledgeMockQuestions.length && hasMinimumAnswers) {
      setIsSetupComplete(true);
      setIsFirstVisit(false);
    }
    setTimeout(() => scrollToSection(nextIndex), 0);
  }, [customInput, currentQuestionIndex, scrollToSection, hasMinimumAnswers]);

  // Handle file upload
  const handleFileUpload = useCallback((questionId, files) => {
    const fileNames = Array.from(files).map(file => file.name);
    setFileUploads((prev) => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), ...fileNames],
    }));
    setAnswers((prev) => ({
      ...prev,
      [questionId]: fileNames.join(', '),
    }));
    console.log('Uploaded files:', { questionId, files: fileNames });
    setShowInput(null);

    const nextIndex = currentQuestionIndex < knowledgeMockQuestions.length - 1
      ? currentQuestionIndex + 1
      : knowledgeMockQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    if (nextIndex === knowledgeMockQuestions.length && hasMinimumAnswers) {
      setIsSetupComplete(true);
      setIsFirstVisit(false);
    }
    setTimeout(() => scrollToSection(nextIndex), 0);
  }, [currentQuestionIndex, scrollToSection, hasMinimumAnswers]);

  // Handle skip
  const handleSkip = useCallback(() => {
    if (currentQuestionIndex < knowledgeMockQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setShowInput(null);
      setCustomInput('');
      scrollToSection(nextIndex);
    } else if (currentQuestionIndex === knowledgeMockQuestions.length - 1 && hasMinimumAnswers) {
      setCurrentQuestionIndex(knowledgeMockQuestions.length);
      setIsSetupComplete(true);
      setIsFirstVisit(false);
      scrollToSection(knowledgeMockQuestions.length);
    }
  }, [currentQuestionIndex, scrollToSection, hasMinimumAnswers]);

  // Handle save
  const handleSave = useCallback(() => {
    console.log('Final payload:', { answers, fileUploads });
  }, [answers, fileUploads]);

  // Handle go back
  const handleGoBack = useCallback(() => {
    if (currentQuestionIndex > -1 && !isSetupComplete) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setShowInput(null);
      setCustomInput('');
      scrollToSection(prevIndex);
    }
  }, [currentQuestionIndex, scrollToSection, isSetupComplete]);

  // Handle edit field
  const handleEditField = useCallback((questionId, option, question) => {
    if (option.value === 'file_upload' || option.value === 'web_crawl' || option.isOther) {
      setShowInput(questionId);
      setCustomInput(answers[questionId] || '');
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: prev[questionId] === option.value ? '' : option.value,
      }));
      setShowInput(null);
      setCustomInput('');
    }
  }, [answers]);

  // Render custom answer in edit mode
  const renderCustomOption = (questionId, answer) => {
    if (!answer) return null;
    const isSelected = answers[questionId] === answer;
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            setAnswers((prev) => ({
              ...prev,
              [questionId]: isSelected ? '' : answer,
            }));
            setShowInput(isSelected ? null : questionId);
            setCustomInput(isSelected ? '' : answer);
          }}
          className={`rounded-full px-3 py-3 text-sm transition-colors text-start max-w-[250px] ${
            isSelected
              ? 'bg-[#191919] text-white border border-[#191919] shadow-[0px_2px_8px_rgba(80,80,80,0.3)]'
              : 'bg-[#292928] text-white hover:bg-[#191919]'
          }`}
        >
          <span className="font-semibold">{answer}</span>
        </button>
      </div>
    );
  };

  // Greeting sequence
  const greetingHeading = "Welcome to Your Knowledge Base, {userName}! Let's Teach Turin About Your Business!";
  const greetingSubheading = [
    "I'm ready to learn everything about your business to become the ultimate AI employee!",
    "Let's add some knowledge—pick resources, verify details, and make me brilliant!",
  ];

  return (
    <div className='flex flex-row items-center gap-6'>
      <div className='w-full flex justify-center bg-intercom-dark rounded-xl'>
        <div
          ref={containerRef}
          className="p-6 max-w-4xl flex flex-col h-[830px] overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {currentQuestionIndex === -1 && !isSetupComplete && (
            <motion.div
              ref={greetingRef}
              data-index="greeting"
              animate={{
                opacity: currentQuestionIndex === -1 ? 1 : 0.5,
                y: currentQuestionIndex === -1 ? 0 : 10,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="min-h-[80vh] flex flex-col justify-center mb-12"
            >
              {!hasTyped ? (
                <TypingEffect
                  text={greetingHeading}
                  onComplete={() => {
                    setShowSubheading(true);
                    setHasTyped(true);
                    setTimeout(() => setShowStartButton(true), 0);
                  }}
                />
              ) : (
                <h1 className="text-5xl font-bold text-white">{replacePlaceholders(greetingHeading)}</h1>
              )}
              {showSubheading && (
                <AnimatedSection direction="up" delay={0.2}>
                  <div className="mt-4 space-y-2">
                    {greetingSubheading.map((text, idx) => (
                      <p key={idx} className="text-lg text-white">{text}</p>
                    ))}
                  </div>
                </AnimatedSection>
              )}
              {showStartButton && (
                <AnimatedSection direction="up" delay={0.4}>
                  <div className="mt-8">
                    <p className="text-xl text-white mb-4">Ready to teach me?</p>
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        scrollToSection(0);
                      }}
                      className="px-6 py-3 bg-[#292928] text-white rounded-full hover:bg-[#191919] text-sm"
                    >
                      Let's begin!
                    </button>
                  </div>
                </AnimatedSection>
              )}
            </motion.div>
          )}

          {currentQuestionIndex >= 0 && currentQuestionIndex < knowledgeMockQuestions.length && !isSetupComplete && (
            <>
              {knowledgeMockQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  ref={(el) => (questionRefs.current[index] = el)}
                  data-index={index}
                  animate={{
                    opacity: index === currentQuestionIndex ? 1 : 0.5,
                    y: index === currentQuestionIndex ? 0 : 10,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="min-h-[80vh] flex flex-col justify-center mb-12"
                >
                  <h2 className="text-4xl font-semibold text-white mb-4">{replacePlaceholders(question.text)}</h2>
                  <div className="flex flex-row flex-wrap gap-4 py-3">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.value;
                      return (
                        <div key={option.value} className={`${option.description ? '' : 'flex items-center justify-center'}`}>
                          <button
                            onClick={() => handleOptionClick(question.id, option, option.response, question)}
                            className={` ${option.description || option.value === "default" ? 'rounded-md h-full py-4 px-4' : 'rounded-full my-auto px-3 py-3'} text-sm transition-colors text-start max-w-[250px] ${
                              isSelected
                                ? 'bg-[#191919] text-white border border-[#191919] shadow-[0px_2px_8px_rgba(80,80,80,0.3)]'
                                : 'bg-[#292928] text-white hover:bg-[#191919]'
                            } ${index !== currentQuestionIndex ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={index !== currentQuestionIndex}
                          >
                            {option.isOther || option.value === 'file_upload' || option.value === 'web_crawl' ? (
                              <span className='font-semibold flex flex-row items-center gap-2'>
                                <LuPlus className='text-white'/>
                                {option.label}
                              </span>
                            ) : (
                              <span className='font-semibold'>{replacePlaceholders(option.label)}</span>
                            )}
                            {option.description && <p className='mt-4'>{option.description}</p>}
                          </button>
                        </div>
                      );
                    })}
                    {answers[question.id] && !question.options.some(opt => opt.value === answers[question.id]) && (
                      renderCustomOption(question.id, answers[question.id])
                    )}
                  </div>
                  {showInput === question.id && index === currentQuestionIndex && (
                    <div className="mt-4">
                      {question.id === 'gather_knowledge_resources' && showInput === question.id && answers[question.id] === 'file_upload' ? (
                        <>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(question.id, e.target.files)}
                            className="w-full px-3 py-3 border border-[#191919] rounded-full text-white text-sm bg-[#292928]"
                          />
                          {fileUploads[question.id] && (
                            <p className="mt-2 text-white text-sm">Uploaded: {fileUploads[question.id].join(', ')}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            className="w-full px-3 py-3 border border-[#191919] rounded-full text-black text-sm"
                            placeholder={question.id === 'gather_knowledge_resources' && answers[question.id] === 'web_crawl' ? 'Enter URLs to crawl' : 'Enter your answer'}
                          />
                          <button
                            onClick={() => handleCustomSubmit(question.id, question)}
                            className="mt-3 px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                          >
                            Submit
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {answers[question.id] && (
                    <AnimatedSection direction="up" delay={0.1}>
                      <p className="mt-4 text-white">
                        {question.options.find((opt) => opt.value === answers[question.id])?.response ||
                          'Thanks for your input!'}
                      </p>
                    </AnimatedSection>
                  )}
                </motion.div>
              ))}
              <div className="space-y-4">
                <button
                  onClick={handleGoBack}
                  className="fixed right-[480px] top-16 transform -translate-y-1 p-2 bg-white text-black rounded-full hover:bg-gray-200"
                  aria-label="Go to previous question or greeting"
                  disabled={currentQuestionIndex === -1}
                >
                  <FiArrowUp size={20} />
                </button>
                <button
                  onClick={handleSkip}
                  className="fixed right-[480px] bottom-16 transform -translate-y-1 p-2 bg-white text-black rounded-full hover:bg-gray-200"
                  aria-label="Skip question"
                  disabled={currentQuestionIndex === knowledgeMockQuestions.length}
                >
                  <FiArrowDown size={20} />
                </button>
              </div>
            </>
          )}

          {isSetupComplete && currentQuestionIndex === knowledgeMockQuestions.length && hasMinimumAnswers && (
            <motion.div
              ref={saveEditRef}
              data-index="save-edit"
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="min-h-[80vh] flex flex-col justify-center mb-12"
            >
              <AnimatedSection direction="up" delay={0.1}>
                <h2 className="text-4xl font-semibold text-white mb-4">
                  Awesome! Your Knowledge Base is Ready! Want to Fine-Tune It?
                </h2>
                <button
                  onClick={() => window.location.href = '/inbox'}
                  className="px-6 py-3 bg-[#292928] text-white rounded-full hover:bg-[#191919] text-sm"
                >
                  Go to Dashboard
                </button>
                <div className="flex flex-row flex-wrap gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(knowledgeMockQuestions.length + 1)}
                    className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                  >
                    Edit
                  </button>
                </div>
              </AnimatedSection>
            </motion.div>
          )}

          {currentQuestionIndex === knowledgeMockQuestions.length + 1 && (
            <div className="w-[800px] flex flex-col justify-center items-start mb-12">
              <h2 className="text-4xl font-semibold text-white mb-4">Edit Your Knowledge Base</h2>
              <div className="space-y-8 w-full">
                {knowledgeMockQuestions.map((question) => (
                  <div key={question.id} className="w-full p-4 rounded-lg">
                    <label className="block text-white text-sm font-medium mb-4">
                      {replacePlaceholders(question.text)}
                    </label>
                    <div className="flex flex-row flex-wrap gap-4 py-3">
                      {question.options.map((option) => {
                        const isSelected = answers[question.id] === option.value;
                        return (
                          <div key={option.value} className={`${option.description ? '' : 'flex items-center justify-center'}`}>
                            <button
                              onClick={() => handleEditField(question.id, option, question)}
                              className={` ${option.description || option.value === "default" ? 'rounded-md h-full py-4 px-4' : 'rounded-full my-auto px-3 py-3'} text-sm transition-colors text-start max-w-[250px] ${
                                isSelected
                                  ? 'bg-[#191919] text-white border border-[#191919] shadow-[0px_2px_8px_rgba(80,80,80,0.3)]'
                                  : 'bg-[#292928] text-white hover:bg-[#191919]'
                              }`}
                            >
                              {option.isOther || option.value === 'file_upload' || option.value === 'web_crawl' ? (
                                <span className='font-semibold flex flex-row items-center gap-2'>
                                  <LuPlus className='text-white'/>
                                  {option.label}
                                </span>
                              ) : (
                                <span className='font-semibold'>{replacePlaceholders(option.label)}</span>
                              )}
                              {option.description && <p className='mt-4'>{option.description}</p>}
                            </button>
                          </div>
                        );
                      })}
                      {answers[question.id] && !question.options.some(opt => opt.value === answers[question.id]) && (
                        renderCustomOption(question.id, answers[question.id])
                      )}
                    </div>
                    {showInput === question.id && (
                      <div className="mt-4">
                        {question.id === 'gather_knowledge_resources' && answers[question.id] === 'file_upload' ? (
                          <>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(question.id, e.target.files)}
                              className="w-full px-3 py-3 border border-[#191919] rounded-full text-white text-sm bg-[#292928]"
                            />
                            {fileUploads[question.id] && (
                              <p className="mt-2 text-white text-sm">Uploaded: {fileUploads[question.id].join(', ')}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={customInput}
                              onChange={(e) => setCustomInput(e.target.value)}
                              className="w-full px-3 py-3 border border-[#191919] rounded-full text-black text-sm"
                              placeholder={question.id === 'gather_knowledge_resources' && answers[question.id] === 'web_crawl' ? 'Enter URLs to crawl' : 'Enter your answer'}
                            />
                            <button
                              onClick={() => handleCustomSubmit(question.id, question)}
                              className="mt-3 px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                            >
                              Submit
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-row flex-wrap gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(knowledgeMockQuestions.length)}
                  className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-1/3 mt-6 h-full">
        <AgentProfile answers={answers} userProfile={userProfile} />
      </div>
    </div>
  );
};

export default KnowledgeBase;