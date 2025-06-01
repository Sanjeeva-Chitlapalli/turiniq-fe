import { mockQuestions, knowledgeMockQuestions } from "../utils/constants";

export const AgentProfile = ({ answers, userProfile }) => {
  const formatOptionLabel = (questionId, value, questionSet = mockQuestions) => {
    const question = questionSet.find((q) => q.id === questionId);
    if (!question) return value;
    const option = question.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getRole = () => {
    if (answers.domain) {
      const domain = formatOptionLabel('domain', answers.domain);
      return `${domain} Specialist`;
    }
    return 'AI Assistant';
  };

  const getSkills = () => {
    const skills = [];
    if (answers.agent_goal) {
      if (Array.isArray(answers.agent_goal)) {
        skills.push(...answers.agent_goal.map((val) => formatOptionLabel('agent_goal', val)));
      } else {
        skills.push(formatOptionLabel('agent_goal', answers.agent_goal));
      }
    }
    if (answers.communication_style) {
      if (Array.isArray(answers.communication_style)) {
        skills.push(...answers.communication_style.map((val) => formatOptionLabel('communication_style', val)));
      } else {
        skills.push(formatOptionLabel('communication_style', answers.communication_style));
      }
    }
    if (answers.continuous_learning) {
      skills.push(formatOptionLabel('continuous_learning', answers.continuous_learning, knowledgeMockQuestions));
    }
    return skills.length > 0 ? skills : ['Customizing skills...'];
  };

  const getAbout = () => {
    const parts = [];
    if (answers.tonality) {
      parts.push(`I communicate in a ${formatOptionLabel('tonality', answers.tonality).toLowerCase()} tone.`);
    }
    if (answers.clarification) {
      const clarifications = Array.isArray(answers.clarification)
        ? answers.clarification.map((val) => formatOptionLabel('clarification', val)).join(', ')
        : formatOptionLabel('clarification', answers.clarification);
      parts.push(`I focus on clarifying ${clarifications.toLowerCase()}.`);
    }
    if (answers.handover) {
      const handovers = Array.isArray(answers.handover)
        ? answers.handover.map((val) => formatOptionLabel('handover', val)).join(', ')
        : formatOptionLabel('handover', answers.handover);
      parts.push(`I hand over cases involving ${handovers.toLowerCase()}.`);
    }
    if (answers.add_specific_insights) {
      parts.push(`I know: ${formatOptionLabel('add_specific_insights', answers.add_specific_insights, knowledgeMockQuestions).toLowerCase()}`);
    }
    return parts.length > 0 ? parts.join(' ') : 'Building my profile to serve you better!';
  };

  const getKnowledgeBase = () => {
    const details = [];
    if (answers.reverify_business_details) {
      if (answers.reverify_business_details === 'yes') {
        details.push(`Verified: ${userProfile.domain}, ${userProfile.userName}, ${userProfile.industry}, Goal: ${userProfile.businessGoal}`);
      } else {
        details.push(`Custom: ${answers.reverify_business_details}`);
      }
    }
    if (answers.gather_knowledge_resources) {
      details.push(`Resources: ${answers.gather_knowledge_resources}`);
    }
    return details.length > 0 ? details.join('; ') : 'Customizing knowledge base...';
  };

  return (
    <div className="bg-[#F4F2EE] text-black pb-3 rounded-xl shadow-lg w-full max-w-sm">
      <div className="relative bg-white rounded-t-xl">
        <div
          className="w-full h-32 rounded-t-xl bg-cover bg-center"
          style={{ backgroundImage: 'url("/profile-bg.svg")' }}
        ></div>
        <div className="relative flex flex-col items-start px-6 pt-0 pb-4">
          <img
            src="/profile-img.svg"
            className="w-24 h-24 rounded-full border-4 border-white -mt-12 z-10"
            alt="Profile"
          />
          <h2 className="text-xl font-semibold mt-2">Turin AI</h2>
          <p className="text-md text-black">{getRole()}</p>
        </div>
      </div>
      <div className="mt-2 bg-white px-6 py-4">
        <h3 className="text-md font-semibold mb-2">About</h3>
        <p className="text-sm">{getAbout()}</p>
      </div>
      <div className="mt-2 bg-white px-6 py-4">
        <h3 className="text-md font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside text-sm">
          {getSkills().map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2 bg-white px-6 py-4">
        <h3 className="text-md font-semibold mb-2">Business</h3>
        <p className="text-sm">
          {answers.business_type === 'yes'
            ? userProfile.businessType
            : answers.business_type || 'Customizing business type...'}
        </p>
      </div>
      <div className="mt-2 bg-white px-6 py-4">
        <h3 className="text-md font-semibold mb-2">User Data Collection</h3>
        <p className="text-sm">
          {answers.user_data
            ? Array.isArray(answers.user_data)
              ? answers.user_data.map((val) => formatOptionLabel('user_data', val)).join(', ')
              : formatOptionLabel('user_data', answers.user_data)
            : 'Defining data collection...'}
        </p>
      </div>
      <div className="mt-2 bg-white px-6 py-4">
        <h3 className="text-md font-semibold mb-2">Knowledge Base</h3>
        <p className="text-sm">{getKnowledgeBase()}</p>
      </div>
      <div className="mt-2 bg-white px-6 py-4 rounded-b-xl">
        <h3 className="text-md font-semibold mb-2">Greeting</h3>
        <p className="text-sm">
          {answers.opening_message === 'default'
            ? `Hey ${userProfile.userName}! I'm Turin, your chat buddy—let's get started!`
            : answers.opening_message || 'Crafting a personalized greeting...'}
        </p>
      </div>
    </div>
  );
};