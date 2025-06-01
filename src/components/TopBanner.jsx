import React from 'react';

const TopBanner = () => {
  return (
    <div className="bg-slate-700 border-b border-intercom-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-intercom-text text-sm">
            You have <span className="font-semibold">14 days</span> left in your Expert trial
          </span>
          <button className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
            Buy Intercom
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-intercom-textMuted text-sm">Need help onboarding?</span>
          <button className="text-intercom-blue text-sm font-medium hover:underline">
            Talk to Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
