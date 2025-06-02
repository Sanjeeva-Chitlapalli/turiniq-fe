import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { useSelector } from "react-redux";
import { AgentProfile } from "../components/AgentProfile";
import AnimatedSection from "../ui/animatedSection";
import { mockQuestions } from "../utils/constants";

const backend_url = import.meta.env.VITE_BACKEND_URL || "";

// Typing effect component
const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
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

const TurinAgent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [showInput, setShowInput] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [showSubheading, setShowSubheading] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [files, setFiles] = useState([]);
  const userProfile = useSelector((state) => ({
    userName: state.business.businessName || "User",
    businessType: state.business.businessType || "Unknown Business",
  }));
  const questionRefs = useRef([]);
  const greetingRef = useRef(null);
  const saveEditRef = useRef(null);
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);

  const hasMinimumAnswers = Object.keys(answers).length >= 4;

  useEffect(() => {
    const storedAnswers = localStorage.getItem("agentProfileAnswers");
    const storedSetupComplete = localStorage.getItem("turinAgentSetupComplete");
    if (storedSetupComplete === "true" && storedAnswers) {
      setIsSetupComplete(true);
      setIsFirstVisit(false);
      setCurrentQuestionIndex(mockQuestions.length + 1);
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("turinAgentSetupComplete", isSetupComplete);
    const storedAnswers = localStorage.getItem("agentProfileAnswers");
    const currentStored = storedAnswers ? JSON.parse(storedAnswers) : {};
    const updatedAnswers = { ...currentStored, ...answers };
    localStorage.setItem("agentProfileAnswers", JSON.stringify(updatedAnswers));
  }, [isSetupComplete, answers]);

  const replacePlaceholders = useCallback(
    (text) => {
      return text
        .replace(/{userName}/g, userProfile.userName)
        .replace(/{businessType}/g, userProfile.businessType);
    },
    [userProfile]
  );

  const scrollToSection = useCallback((index) => {
    setIsProgrammaticScroll(true);
    if (index === -1 && greetingRef.current) {
      greetingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (
      index >= 0 &&
      index < mockQuestions.length &&
      questionRefs.current[index]
    ) {
      questionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (index === mockQuestions.length && saveEditRef.current) {
      saveEditRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    setTimeout(() => setIsProgrammaticScroll(false), 1000);
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 300) return;
      lastScrollTime.current = now;

      const deltaY = event.deltaY;
      let nextIndex = currentQuestionIndex;

      if (deltaY > 0 && currentQuestionIndex < mockQuestions.length) {
        nextIndex = currentQuestionIndex + 1;
      } else if (deltaY < 0 && currentQuestionIndex > -1) {
        nextIndex = currentQuestionIndex - 1;
      }

      if (nextIndex !== currentQuestionIndex) {
        setCurrentQuestionIndex(nextIndex);
        if (nextIndex === mockQuestions.length && hasMinimumAnswers) {
          setIsSetupComplete(true);
          setIsFirstVisit(false);
        }
        scrollToSection(nextIndex);
      }
    };

    const container = containerRef.current;
    if (container && !isSetupComplete) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [
    currentQuestionIndex,
    scrollToSection,
    isSetupComplete,
    hasMinimumAnswers,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index =
              entry.target.dataset.index === "greeting"
                ? -1
                : entry.target.dataset.index === "save-edit"
                ? mockQuestions.length
                : parseInt(entry.target.dataset.index, 10);
            if (index !== currentQuestionIndex) {
              setCurrentQuestionIndex(index);
              if (index === mockQuestions.length && hasMinimumAnswers) {
                setIsSetupComplete(true);
                setIsFirstVisit(false);
              }
            }
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );

    if (greetingRef.current) {
      observer.observe(greetingRef.current);
    }
    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    if (saveEditRef.current) {
      observer.observe(saveEditRef.current);
    }

    return () => {
      if (greetingRef.current) {
        observer.unobserve(greetingRef.current);
      }
      questionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      if (saveEditRef.current) {
        observer.unobserve(saveEditRef.current);
      }
    };
  }, [currentQuestionIndex, isProgrammaticScroll, hasMinimumAnswers]);

  const handleOptionClick = useCallback(
    (questionId, option, response, question) => {
      if (option.isOther) {
        setShowInput(questionId);
      } else {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: question.multiSelect
            ? [...(prev[questionId] || []), option.value]
            : option.value,
        }));
        setShowInput(null);
        setCustomInput("");
        console.log("Submitting to /api/turin-agent/setup:", {
          questionId,
          answer: option.value,
          response,
        });

        const nextIndex =
          currentQuestionIndex < mockQuestions.length - 1
            ? currentQuestionIndex + 1
            : mockQuestions.length;
        setCurrentQuestionIndex(nextIndex);
        if (nextIndex === mockQuestions.length && hasMinimumAnswers) {
          setIsSetupComplete(true);
          setIsFirstVisit(false);
        }
        setTimeout(() => {
          scrollToSection(nextIndex);
        }, 800);
      }
    },
    [currentQuestionIndex, scrollToSection, hasMinimumAnswers]
  );

  const handleCustomSubmit = useCallback(
    (questionId, question) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: question.multiSelect
          ? [...(prev[questionId] || []), customInput]
          : customInput,
      }));
      console.log("Submitting to /api/turin-agent/setup:", {
        questionId,
        answer: customInput,
      });
      setShowInput(null);
      setCustomInput("");

      const nextIndex =
        currentQuestionIndex < mockQuestions.length - 1
          ? currentQuestionIndex + 1
          : mockQuestions.length;
      setCurrentQuestionIndex(nextIndex);
      if (nextIndex === mockQuestions.length && hasMinimumAnswers) {
        setIsSetupComplete(true);
        setIsFirstVisit(false);
      }
      setTimeout(() => {
        scrollToSection(nextIndex);
      }, 0);
    },
    [customInput, currentQuestionIndex, scrollToSection, hasMinimumAnswers]
  );

  const handleSkip = useCallback(() => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setShowInput(null);
      setCustomInput("");
      scrollToSection(nextIndex);
    } else if (
      currentQuestionIndex === mockQuestions.length - 1 &&
      hasMinimumAnswers
    ) {
      setCurrentQuestionIndex(mockQuestions.length);
      setIsSetupComplete(true);
      setIsFirstVisit(false);
      scrollToSection(mockQuestions.length);
    }
  }, [currentQuestionIndex, scrollToSection, hasMinimumAnswers]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSave = useCallback(async () => {
    console.log("Preparing payload for /configure-agent:", answers);

    const formData = new FormData();
    formData.append(
      "business_type",
      answers["business_type"] || userProfile.businessType.toLowerCase()
    );
    formData.append("domain", answers["domain"] || "https://example.com");
    formData.append(
      "agent_goal",
      answers["agent_goal"] || "Provide Customer Support"
    );
    formData.append("agent_goal_other", answers["agent_goal_other"] || "");
    formData.append("tonality", answers["tonality"] || "professional");
    formData.append(
      "communication_style",
      Array.isArray(answers["communication_style"])
        ? answers["communication_style"].join(",")
        : answers["communication_style"] ||
            "Use simple language,Introduce yourself with a greeting"
    );
    formData.append(
      "communication_style_custom",
      answers["communication_style_custom"] || ""
    );
    formData.append(
      "context_clarity",
      Array.isArray(answers["context_clarity"])
        ? answers["context_clarity"].join(",")
        : answers["context_clarity"] || "Clarify brief messages"
    );
    formData.append(
      "context_clarity_custom",
      answers["context_clarity_custom"] || ""
    );
    formData.append(
      "handover_escalation",
      Array.isArray(answers["handover_escalation"])
        ? answers["handover_escalation"].join(",")
        : answers["handover_escalation"] || "Escalate refund requests"
    );
    formData.append(
      "handover_escalation_custom",
      answers["handover_escalation_custom"] || ""
    );
    formData.append(
      "data_to_capture",
      Array.isArray(answers["data_to_capture"])
        ? answers["data_to_capture"].join(",")
        : answers["data_to_capture"] || "name,email"
    );
    formData.append(
      "data_to_capture_other",
      answers["data_to_capture_other"] || ""
    );
    formData.append(
      "custom_opening_message",
      answers["custom_opening_message"] ||
        `Hello, I'm your ${userProfile.businessType} assistant! How can I help you today?`
    );
    formData.append(
      "custom_instructions",
      answers["custom_instructions"] || ""
    );

    for (const file of files) {
      formData.append("files", file);
    }
    console.log("FormData prepared:", formData);
    console.log(backend_url);

    try {
      const response = await fetch(`${backend_url}/configure-agent`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);
      localStorage.setItem("agentProfileAnswers", JSON.stringify(answers));
      localStorage.setItem("turinAgentSetupComplete", "true");
      localStorage.setItem(
        "businessId",
        `BusinessType.${userProfile.businessType.toUpperCase()}_${
          userProfile.domain
        }`
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to configure agent:", error);
      alert("Failed to save agent configuration. Please try again.");
    }
  }, [answers, files, userProfile]);

  const handleGoBack = useCallback(() => {
    if (currentQuestionIndex > -1 && !isSetupComplete) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setShowInput(null);
      setCustomInput("");
      scrollToSection(prevIndex);
    }
  }, [currentQuestionIndex, scrollToSection, isSetupComplete]);

  const handleEditField = useCallback((questionId, option, question) => {
    setAnswers((prev) => {
      if (question.multiSelect) {
        const currentAnswers = Array.isArray(prev[questionId])
          ? prev[questionId]
          : [];
        if (currentAnswers.includes(option.value)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((val) => val !== option.value),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, option.value],
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: prev[questionId] === option.value ? "" : option.value,
        };
      }
    });
  }, []);

  const greetingHeading =
    "Hey there! I'm Turin, your TurinIQ buddy! I'm here to build your dream AI employee—tailored just for you!";
  const greetingSubheading = [
    "Let's create it together! Pick your vibe, goals, and style, and I'll shape myself into your perfect teammate—step by step!",
    "Ready to mold me? Let's get started—I'll learn from you and grow into the ideal helper you need!",
  ];

  const handleTestAgent = () => {
    const businessData =
      JSON.parse(localStorage.getItem("agentProfileAnswers")) || {};
    console.log("Testing agent with business data:", businessData);
    const businessId = `BusinessType.${businessData.business_type?.toUpperCase()}_${
      businessData.domain || "example.com"
    }`;
    console.log("Business ID for testing:", businessId);
    window.open(`${backend_url}/${encodeURIComponent(businessId)}`, "_blank");
  };

  return (
    <div className="flex flex-row items-center gap-6">
      <div className="w-full flex justify-center bg-intercom-dark rounded-xl">
        <div
          ref={containerRef}
          className="p-6 max-w-4xl flex flex-col h-[830px] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
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
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-[80vh] flex flex-col justify-center mb-12"
            >
              {!hasTyped ? (
                <TypingEffect
                  text={greetingHeading}
                  onComplete={() => {
                    setShowSubheading(true);
                    setHasTyped(true);
                    setTimeout(() => setShowStartButton(true), 500);
                  }}
                />
              ) : (
                <h1 className="text-5xl font-bold text-white">
                  {greetingHeading}
                </h1>
              )}
              {showSubheading && (
                <AnimatedSection direction="up" delay={0.2}>
                  <div className="mt-4 space-y-2">
                    {greetingSubheading.map((text, index) => (
                      <p key={index} className="text-lg text-white">
                        {text}
                      </p>
                    ))}
                  </div>
                </AnimatedSection>
              )}
              {showStartButton && (
                <AnimatedSection direction="up" delay={0.4}>
                  <div className="mt-8">
                    <p className="text-xl text-white mb-4">
                      Shall we build your ideal employee now?
                    </p>
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        scrollToSection(0);
                      }}
                      className="px-6 py-3 bg-[#292928] text-white rounded-full hover:bg-[#191919] transition-colors text-sm"
                    >
                      Yes, let's go!
                    </button>
                  </div>
                </AnimatedSection>
              )}
            </motion.div>
          )}

          {currentQuestionIndex >= 0 &&
            currentQuestionIndex < mockQuestions.length &&
            !isSetupComplete && (
              <>
                {mockQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    ref={(el) => (questionRefs.current[index] = el)}
                    data-index={index}
                    animate={{
                      opacity: index === currentQuestionIndex ? 1 : 0.5,
                      y: index === currentQuestionIndex ? 0 : 10,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="min-h-[80vh] flex flex-col justify-center mb-12"
                  >
                    <h2 className="text-4xl font-semibold text-white mb-4">
                      {replacePlaceholders(question.text)}
                    </h2>
                    <div className="flex flex-row flex-wrap gap-4 py-3">
                      {question.options.map((option) => {
                        const isSelected = question.multiSelect
                          ? Array.isArray(answers[question.id]) &&
                            answers[question.id].includes(option.value)
                          : answers[question.id] === option.value;
                        return (
                          <div
                            key={option.value}
                            className={`${
                              option.description
                                ? ""
                                : "flex items-center justify-center"
                            }`}
                          >
                            <button
                              onClick={() =>
                                handleOptionClick(
                                  question.id,
                                  option,
                                  option.response,
                                  question
                                )
                              }
                              className={` ${
                                option.description || option.value === "default"
                                  ? "rounded-md h-full py-4 px-4"
                                  : "rounded-full my-auto px-3 py-3"
                              } text-sm transition-colors text-start max-w-[250px] ${
                                isSelected
                                  ? "bg-[#191919] text-white border border-[#191919] shadow-[0px_2px_8px_rgba(80,80,80,0.3)]"
                                  : "bg-[#292928] text-white hover:bg-[#191919]"
                              } ${
                                index !== currentQuestionIndex
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={index !== currentQuestionIndex}
                            >
                              {option.isOther ? (
                                <span className="font-semibold flex flex-row items-center gap-2">
                                  {option.isOther && (
                                    <LuPlus className="text-white" />
                                  )}
                                  {option.label}
                                </span>
                              ) : (
                                <span className="font-semibold">
                                  {replacePlaceholders(option.label)}
                                </span>
                              )}
                              {option.description && (
                                <p className="mt-4">{option.description}</p>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {showInput === question.id &&
                      index === currentQuestionIndex && (
                        <div className="mt-4">
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            className="w-full px-3 py-3 border border-[#191919] rounded-full text-black text-sm"
                            placeholder="Enter your custom answer"
                          />
                          <button
                            onClick={() =>
                              handleCustomSubmit(question.id, question)
                            }
                            className="mt-3 px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    {answers[question.id] && (
                      <AnimatedSection direction="up" delay={0.1}>
                        <p className="mt-4 text-white">
                          {question.options.find(
                            (opt) => opt.value === answers[question.id]
                          )?.response || "Thanks for your input!"}
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
                    disabled={currentQuestionIndex === mockQuestions.length}
                  >
                    <FiArrowDown size={20} />
                  </button>
                </div>
              </>
            )}

          {isSetupComplete &&
            currentQuestionIndex === mockQuestions.length &&
            hasMinimumAnswers && (
              <motion.div
                ref={saveEditRef}
                data-index="save-edit"
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="min-h-[80vh] flex flex-col justify-center mb-12"
              >
                <AnimatedSection direction="up" delay={0.1}>
                  <h2 className="text-4xl font-semibold text-white mb-4">
                    Yay! I’m live and learning—thanks for shaping me! Want to
                    teach me about your business next?
                  </h2>
                  <div className="mt-4">
                    <label className="block text-white text-sm font-medium mb-2">
                      Upload business documents (PDFs, text files, etc.)
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full px-3 py-3 border border-[#191919] rounded-full text-white text-sm bg-[#292928]"
                      accept=".pdf,.txt"
                    />
                  </div>
                  <button
                    onClick={() => (window.location.href = "/knowledge-base")}
                    className="mt-4 px-6 py-3 bg-[#292928] text-white rounded-full hover:bg-[#191919] transition-colors text-sm"
                  >
                    Jump to Knowledge Base
                  </button>
                  <div className="flex flex-row flex-wrap gap-4 mt-6">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex(mockQuestions.length + 1)
                      }
                      className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </AnimatedSection>
              </motion.div>
            )}

          {currentQuestionIndex === mockQuestions.length + 1 && (
            <div className="w-[800px] flex flex-col justify-center items-start mb-12">
              <div className="flex w-full justify-between items-center">
                <h2 className="text-4xl font-semibold text-white mb-4">
                  Edit Your Agent Profile
                </h2>
                <button
                  className="px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                  onClick={handleTestAgent}
                >
                  {" "}
                  Test Agent
                </button>
              </div>

              <div className="space-y-8 w-full">
                {mockQuestions.map((question) => (
                  <div key={question.id} className="w-full p-4 rounded-lg">
                    <label className="block text-white text-sm font-medium mb-4">
                      {replacePlaceholders(question.text)}
                    </label>
                    <div className="flex flex-row flex-wrap gap-4 py-3">
                      {question.options.map((option) => {
                        const isSelected = question.multiSelect
                          ? Array.isArray(answers[question.id]) &&
                            answers[question.id].includes(option.value)
                          : answers[question.id] === option.value;
                        return (
                          <div
                            key={option.value}
                            className={`${
                              option.description
                                ? ""
                                : "flex items-center justify-center"
                            }`}
                          >
                            <button
                              onClick={() =>
                                handleEditField(question.id, option, question)
                              }
                              className={` ${
                                option.description || option.value === "default"
                                  ? "rounded-md h-full py-4 px-4"
                                  : "rounded-full my-auto px-3 py-3"
                              } text-sm transition-colors text-start max-w-[250px] ${
                                isSelected
                                  ? "bg-[#191919] text-white border border-[#191919] shadow-[0px_2px_8px_rgba(80,80,80,0.3)]"
                                  : "bg-[#292928] text-white hover:bg-[#191919]"
                              }`}
                            >
                              {option.isOther ? (
                                <span className="font-semibold flex flex-row items-center gap-2">
                                  {option.isOther && (
                                    <LuPlus className="text-white" />
                                  )}
                                  {option.label}
                                </span>
                              ) : (
                                <span className="font-semibold">
                                  {replacePlaceholders(option.label)}
                                </span>
                              )}
                              {option.description && (
                                <p className="mt-4">{option.description}</p>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {showInput === question.id && (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="w-full px-3 py-3 border border-[#191919] rounded-full text-black text-sm"
                          placeholder="Enter your custom answer"
                        />
                        <button
                          onClick={() =>
                            handleCustomSubmit(question.id, question)
                          }
                          className="mt-3 px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 text-sm"
                        >
                          Submit
                        </button>
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
                  onClick={() => setCurrentQuestionIndex(mockQuestions.length)}
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

export default TurinAgent;
