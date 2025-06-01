import React from 'react';
import MessengerPreview from './MessengerPreview';

const ChecklistItem = ({
  title,
  description,
  buttonText,
  isCompleted = false,
  showArrow = true
}) => (
  <div className="flex items-center justify-between py-6 border-b border-intercom-border group">
    <div className="flex items-start space-x-4">
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
        isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500'
      }`}>
        {isCompleted && <span className="text-white text-xs">✓</span>}
      </div>
      <div className="flex-1">
        <h3 className="text-intercom-text font-medium mb-2">{title}</h3>
        {description && (
          <p className="text-intercom-textMuted text-sm mb-3 leading-relaxed">
            {description}
          </p>
        )}
        {buttonText && (
          <button className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
            {buttonText}
          </button>
        )}
      </div>
    </div>
    {showArrow && (
      <div className="text-intercom-textMuted group-hover:text-white transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3l5 5-5 5V3z"/>
        </svg>
      </div>
    )}
  </div>
);

const MainContent = () => {
  return (
    <div className="flex w-full gap-10 ">
      {/* Left content area */}
      <div className=" p-4">
        <div className="max-w-4xl p-4">
          <h1 className="text-3xl font-normal text-white mb-8">
            Get started with AI-first customer support
          </h1>

          {/* Progress indicator */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center">
              <span className="text-white text-xs">○</span>
            </div>
            <span className="text-intercom-textMuted text-sm">Get set up</span>
            <span className="text-intercom-textMuted text-sm">•</span>
            <span className="text-intercom-textMuted text-sm">0 / 6 steps</span>
          </div>

          {/* Checklist */}
          <div className="bg-intercom-darker rounded-lg border border-intercom-border p-6">
            <ChecklistItem
              title="Install the Messenger to connect with your customers"
              description="Start speaking to your customers across channels, like email and phone, in real-time. You can also set up Fin AI Agent to solve queries in the Messenger or hand them off to your team. More about Messenger."
              buttonText="Install Messenger"
              showArrow={false}
            />

            <ChecklistItem
              title="Invite your teammates to collaborate faster"
            />

            <ChecklistItem
              title="Add content to power your AI and Help Center"
            />

            <ChecklistItem
              title="Set Fin AI Agent live, to resolve issues instantly"
            />

            <ChecklistItem
              title="Ask Copilot to find an answer instantly"
            />

            <ChecklistItem
              title="Set an Outbound message live"
              showArrow={false}
            />
          </div>

          {/* Explore more section */}
          {/* <div className="mt-12">
            <h2 className="text-xl text-white font-medium">Explore more</h2>
          </div> */}
        </div>
      </div>

      {/* Right side - Messenger Preview */}
      <div className="w-[500px] p-4 ">
        <MessengerPreview />
      </div>
    </div>
  );
};

export default MainContent;
