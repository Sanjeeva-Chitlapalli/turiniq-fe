import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setBusinessData } from '../store/businessSlice';
import { useNavigate } from 'react-router-dom';

const InitialData = () => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [agentType, setAgentType] = useState('');
  const [business, setBusiness] = useState('');
  const [goal, setGoal] = useState('');

  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);

  const agentBlankRef = useRef(null);
  const businessBlankRef = useRef(null);
  const goalBlankRef = useRef(null);
  const navigate = useNavigate(); // ✅ Step 2

  const agentTypes = ['Sales Executive', 'Support Executive'];
  const businesses = ['Tech', 'Retail', 'Finance', 'Healthcare', 'Education', 'Other'];
  const goals = ['Increase Sales', 'Improve Customer Support', 'Generate Leads', 'Enhance User Experience', 'Reduce Response Time'];

  const sentenceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  useEffect(() => {
    if (step === 1 && agentBlankRef.current) agentBlankRef.current.focus();
    if (step === 2 && businessBlankRef.current) businessBlankRef.current.focus();
    if (step === 3 && goalBlankRef.current) goalBlankRef.current.focus();
  }, [step]);

useEffect(() => {
  if (step === 4) {
    dispatch(setBusinessData({ agentType, business, goal }));
    // ✅ Step 3: Navigate to Tuin Agent page after short delay (optional)
    const timeout = setTimeout(() => {
      navigate('/turin-agent'); // Replace with actual route path
    }, 1000); // Optional 1s delay to show the "Preferences saved!" message

    return () => clearTimeout(timeout);
  }
}, [step, agentType, business, goal, dispatch, navigate]);

  const handleSelect = (type, value) => {
    if (type === 'agent') {
      setAgentType(value);
      setShowAgentDropdown(false);
      setStep(2);
    } else if (type === 'business') {
      setBusiness(value);
      setShowBusinessDropdown(false);
      setStep(3);
    } else if (type === 'goal') {
      setGoal(value);
      setShowGoalDropdown(false);
      setStep(4);
    }
  };

  const getFilteredOptions = (inputValue, options) => {
    const filtered = options.filter(opt =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filtered.length > 0 ? filtered : [];
  };

  return (
    <div className="flex items-center justify-start min-h-screen bg-white pl-64">
      <div className="text-start text-black gap-10 space-y-6">

        {/* Step 1: Agent Type */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sentenceVariants}
          className="text-5xl font-normal relative mb-2 flex items-center gap-4"
        >
          I want a{' '}
          <span className="relative inline-block">
            <input
              ref={agentBlankRef}
              value={agentType}
              onFocus={() => setShowAgentDropdown(true)}
              onChange={(e) => {
                setAgentType(e.target.value);
                setShowAgentDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowAgentDropdown(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSelect('agent', agentType);
                }
              }}
              className="inline-block border-b-2 border-black cursor-pointer focus:outline-none focus:border-gray-500 min-w-[200px] bg-transparent text-gray-400 italic"
            />
            {showAgentDropdown && getFilteredOptions(agentType, agentTypes).length > 0 && (
              <div className="absolute left-0 mt-2 min-w-[200px] bg-gray-100 rounded-lg shadow-lg z-10">
                {getFilteredOptions(agentType, agentTypes).map((type) => (
                  <div
                    key={type}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect('agent', type);
                    }}
                    className="px-4 py-4 text-black text-[16px] hover:bg-gray-200 cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </span>
        </motion.div>

        {/* Step 2: Business */}
        {step >= 2 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sentenceVariants}
            className="text-5xl font-normal relative mb-2 flex items-center gap-4"
          >
            for my{' '}
            <span className="inline-flex items-center gap-2">
              <span className="relative">
                <input
                  ref={businessBlankRef}
                  value={business}
                  onFocus={() => setShowBusinessDropdown(true)}
                  onChange={(e) => {
                    setBusiness(e.target.value);
                    setShowBusinessDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowBusinessDropdown(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelect('business', business);
                    }
                  }}
                  className="inline-block border-b-2 border-black cursor-pointer focus:outline-none focus:border-gray-500 min-w-[200px] bg-transparent text-gray-400 italic"
                />
                {showBusinessDropdown && getFilteredOptions(business, businesses).length > 0 && (
                  <div className="absolute left-0 mt-2 min-w-[200px] bg-gray-100 rounded-lg shadow-lg z-10">
                    {getFilteredOptions(business, businesses).map((biz) => (
                      <div
                        key={biz}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect('business', biz);
                        }}
                        className="px-4 py-4 text-black text-[16px] hover:bg-gray-200 cursor-pointer"
                      >
                        {biz}
                      </div>
                    ))}
                  </div>
                )}
              </span>
              <span className="ml-4">business,</span>
            </span>
          </motion.div>
        )}

        {/* Step 3: Goal */}
        {step >= 3 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sentenceVariants}
            className="text-5xl font-normal relative mb-2 flex items-center gap-4"
          >
            with main objective to{' '}
            <span className="inline-flex items-center gap-2">
              <span className="relative">
                <input
                  ref={goalBlankRef}
                  value={goal}
                  onFocus={() => setShowGoalDropdown(true)}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setShowGoalDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowGoalDropdown(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelect('goal', goal);
                    }
                  }}
                  className="inline-block border-b-2 border-black cursor-pointer focus:outline-none focus:border-gray-500 min-w-[250px] bg-transparent text-gray-400 italic"
                />
                {showGoalDropdown && getFilteredOptions(goal, goals).length > 0 && (
                  <div className="absolute left-0 mt-2 min-w-[200px] bg-gray-100 rounded-lg shadow-lg z-10">
                    {getFilteredOptions(goal, goals).map((g) => (
                      <div
                        key={g}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect('goal', g);
                        }}
                        className="px-4 py-4 text-black text-[16px] hover:bg-gray-200 cursor-pointer"
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </span>
              <span className="ml-4">goal</span>
            </span>
          </motion.div>
        )}

        {/* Final Message */}
        {step === 4 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sentenceVariants}
            className="mt-4 text-lg text-gray-300"
          >
            Preferences saved! Your agent setup is ready.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InitialData;
