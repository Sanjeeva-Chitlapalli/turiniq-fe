import React from 'react';

const MessengerPreview = () => {
  return (
    <div className="w-full h-full relative">
      {/* Messenger container with background image */}
      <div
        className="w-full h-full rounded-xl overflow-hidden relative"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e0f2fe"/><stop offset="50%" style="stop-color:%2381d4fa"/><stop offset="100%" style="stop-color:%2329b6f6"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium text-gray-800">Example</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Chat content */}
        <div className="absolute top-16 left-4 right-4 bottom-16">
          {/* Welcome message */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  I
                </div>
                <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Hey there!</h3>
                  <h3 className="text-lg font-semibold text-gray-800">We're here to help</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I'm Fin, I can answer most of your questions and if I need to hand it available as well.
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                  <span>4 hours • Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-white rounded-full px-4 py-3 shadow-sm flex items-center">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
            />
            <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M8 0l8 8-8 8V0z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 right-8 w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        <div className="absolute top-32 left-8 w-1 h-1 bg-white bg-opacity-30 rounded-full"></div>
        <div className="absolute bottom-24 right-12 w-3 h-3 bg-white bg-opacity-40 rounded-full"></div>
      </div>
    </div>
  );
};

export default MessengerPreview;
