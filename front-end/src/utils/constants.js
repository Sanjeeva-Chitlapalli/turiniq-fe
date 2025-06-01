export const mockQuestions = [
  {
    id: 'business_type',
    text: "Hey {userName}, I think you're rocking a {businessType} vibe—am I spot on? Let's confirm!",
    heading:'Business Type',
    options: [
      { value: 'yes', label: 'Yes', response: "Awesome! I'm learning your style already!" },
      { value: 'no', label: 'No', response: "Oops, my bad! Tell me your real business type, like Retail or Tech, and I'll grow into it!", isOther: true },
    ],
  },
  {
    id: 'domain',
    text: 'Sweet! Where should I shine for you? Pick the playground for your AI!',
    heading:'Domain of interest',
    options: [
      { value: 'customer_support', label: 'Customer Support', response: "Cool choice! Let's move forward! "},
      { value: 'sales', label: 'Sales', response: "Great pick! I'm on it!" },
      { value: 'marketing', label: 'Marketing', response: "Awesome! Let's keep going!" },
      { value: 'technical_assistance', label: 'Technical Assistance', response: "Nice one! Let's proceed!" },
      { value: 'other', label: 'Other', response: "Oh, a custom spot! Type it in, and I'll adapt!", isOther: true },
    ],
  },
  {
    id: 'agent_goal',
    text: "Cool choice! What's my big mission? Help me figure out what to master!",
    heading:'Goal',
    options: [
      { value: 'provide_support', label: 'Provide Customer Support', response: "Nice! I'm ready to help!" },
      { value: 'generate_leads', label: 'Generate Sales Leads', response: "Got it! Lead generation mode on!" },
      { value: 'answer_faqs', label: 'Answer FAQs', response: "Perfect! I'll tackle those FAQs!" },
      { value: 'troubleshoot', label: 'Troubleshoot Issues', response: "Alright! I'm your troubleshooter!" },
      { value: 'other', label: 'Other', response: "Nice twist! Tell me your goal, and I'll shape up!", isOther: true },
    ],
  },
  {
    id: 'tonality',
    text: 'Time to get my personality popping! How should I chat with your crew? Pick my vibe!',
    heading:'Tone of Voice',
    options: [
      { value: 'friendly', label: 'Friendly', description: 'Enthusiastic, upbeat, encouraging. Keeps it warm!', response: "Yay! I'm getting warm and fuzzy—watch me grow!" },
      { value: 'neutral', label: 'Neutral', description : 'Casual, respectful, objective. Keeps it neutral!', response: "Cool, I'm leveling up to chill and clear!" },
      { value: 'matter_of_fact', label: 'Matter-of-fact', description : 'Plainspoken, direct, frank. Keeps it clear-cut!', response: "Straight to the point! I'm building that now!" },
      { value: 'professional', label: 'Professional', description : 'Informative, confident, empathetic. Keeps it businesslike!', response: "Pro mode activated! I'm shaping up smart!" },
      { value: 'humorous', label: 'Humorous', description: 'Lighthearted, playful, irreverent. Keeps it entertaining!', response: "Ha! I'm adding some fun—let's build that laugh!" },
    ],
  },
  {
    id: 'communication_style',
    text: 'Awesome tone! How should I talk the talk? Pick styles to mold me into the perfect chat buddy!',
    heading:'Communication Style',
    options: [
      { value: 'simple_language', label: 'Use simple language', description : 'Use clear, straightforward language, avoiding jargon (e.g., ‘easy’ instead of ‘frictionless’)', response: "Got it! Keeping it clear and simple!" },
      { value: 'greeting', label: 'Introduce with a greeting', description : 'Start with a friendly intro as ‘Turin’ with a personalized touch.', response: "Got it! I'll start with a friendly hello!" },
      { value: 'concise', label: 'Keep answers concise', description : 'Use short sentences, limit to 1-2 per paragraph, under 100 words unless needed', response: "Got it! Short and sweet it is!" },
      { value: 'other', label: 'Add Custom Style', response: "Ooh, a personal touch! Type your style, and I'll adapt!", isOther: true },
    ],
    multiSelect: true,
  },
  {
    id: 'clarification',
    text: "Getting smarter! When I'm puzzled, what should I ask? Help me dig deeper!",
    heading:'Context & Clarification',
    options: [
      { value: 'clarify_brief', label: 'Clarify brief messages', description : 'Ask for details if the query is vague (e.g., 1-2 words).', response: "Got it! I'll ask for details if it's vague!" },
      { value: 'clarify_location', label: 'Clarify geographical location', description : 'Ask the user’s country for location-specific info.', response: "Got it! I'll check their location!" },
      { value: 'clarify_product_type', label: 'Clarify product type', description : 'Confirm the product model for accurate support.', response: "Got it! I'll ask for details of the product!" },
      { value: 'clarify_platform', label: 'Clarify platform for troubleshooting', description : 'Ask platform (e.g., iOS) and version.', response: "Got it! I'll ask for the platform to troubleshoot platform specific issue!" },
      { value: 'other', label: 'Add Custom Clarification', response: "Genius! Tell me what to ask, and I'll evolve!", isOther: true },
    ],
    multiSelect: true,
  },
  {
    id: 'handover',
    text: "I'm growing strong! When should I tag in a human hero? Pick my handover moments!",
    heading:'Handover & Escalation',
    options: [
      { value: 'escalate_refunds', label: 'Escalate refund requests', description: 'Hand over refund requests beyond policy or special cases.', response: "Got it! I'll pass refunds to humans!" },
      { value: 'escalate_urgent', label: 'Escalate frustrated or urgent cases', description: 'Route if user is angry or issue is urgent (e.g., all-caps).', response: "Got it! I'll hand over the tough ones!" },
      { value: 'escalate_medical_advice', label: 'Escalate medical advice requests', description: 'Never advise medically, route to humans.', response: "Got it! I'll hand over the tough ones!" },
      { value: 'escalate_email_change', label: 'Escalate email change requests',description: 'Route for security verification.', response: "Got it! I'll hand over the tough ones!" },
      { value: 'other', label: 'Add Custom Description', response: "Smart move! Tell me when to hand over, and I'll adjust!", isOther: true },
    ],
    multiSelect: true,
  },
  {
    id: 'user_data',
    text: "I'm almost there! What details should I ask your users for? Let's build that in!",
    heading:'Data Collection',
    options: [
      { value: 'name', label: 'User Name', response: "Got it! I'll ask for their name!" },
      { value: 'email', label: 'Contact Email', response: "Got it! I'll grab their email!" },
      { value: 'phone', label: 'Phone Number', response: "Got it! I'll grab their email!" },
      { value: 'company', label: 'Company Name', response: "Got it! I'll grab their email!" },
      { value: 'other', label: 'Other', response: "Ooh, extra flair! Type your custom field, and I'll learn it!", isOther: true },
    ],
    multiSelect: true,
  },
  {
    id: 'opening_message',
    text: 'Final touch! How should I wow your customers with a greeting? Give me a fun one to start with!',
    heading:'Opening Message',
    options: [
      { value: 'default', label: "Hey {user}! I'm Turin, your chat buddy—let's get started!", response: "Love it! I'm crafting that welcome!"},
      { value: 'other', label: 'Custom Greeting', response: "Love it! I'm crafting that custom welcome—watch me shine!", isOther: true },
    ],
  },
];

export const knowledgeMockQuestions = [
  {
    id: 'reverify_business_details',
    heading: 'Reverify Business Details',
    text: "Hey boss! I’ve got some details about your biz—let’s double-check! Is this right: {domain}, {businessName}, {industry}, and {businessGoal}? Tell me if I’m on track!",
    options: [
      { value: 'yes', label: 'Yes', response: "Sweet! I’m soaking that in—let’s build on it!" },
      {
        value: 'no',
        label: 'No',
        response: "Oops, let’s fix that! Tell me the Domain, Business Name, Industry, or Goal I missed, and I’ll learn it fast!",
        isOther: true,
      },
    ],
  },
  {
    id: 'gather_knowledge_resources',
    value:'file_upload',
    heading: 'Gather Knowledge Resources',
    text: "Awesome start! Now, help me get smart about your business. What can I learn from to nail my role? Pick your resources!",
    options: [
      {
        id: 'gather_knowledge_resources',
        value: 'file_upload',
        label: 'Upload files to teach me!',
        response: "Yum! I’m munching on those files—learning mode on!",
      },
      {
        id:'web_crawl',
        value: 'web_crawl',
        label: 'Let me explore your websites! Paste URLs to crawl (like ChatGPT or Grok style).',
        response: "Off I go! Crawling those pages—watch me grow!",
        isOther: true,
      },
    ],
  },
  // {
  //   id: 'knowledge_summary',
  //   heading: 'Preview Summary',
  //   text: "Check it out! Here’s what I’ve learned so far—a quick peek!",
  //   options: [
  //     {
  //       value: 'summary_display',
  //       label: 'Display summary',
  //       response: "I’m digesting this—getting smarter by the second!",
  //     },
  //   ],
  // },
  {
    id: 'add_specific_insights',
    heading: 'Add Specific Insights',
    text: "I’m getting the hang of it! As your star employee, what should I know about what your business does (and doesn’t)? Spill the beans!",
    options: [
      {
        value: 'what_i_do',
        label: 'What I Do',
        response: "Got it! I’m memorizing my duties—awesome stuff!",
        isOther: true,
      },
      {
        value: 'what_i_do_not_do',
        label: 'What I Do Not Do',
        response: "Noted! I’ll steer clear of those—learning boundaries!",
        isOther: true,
      },
    ],
  },
  {
    id: 'continuous_learning',
    heading: 'Enable Continuous Learning',
    text: "My knowledge base is shaping up! Should I keep learning from chats and ping you if I hit a knowledge gap? Let’s level up!",
    options: [
      {
        value: 'yes',
        label: 'Yes',
        response: "Yes! I’ll grow with every chat and alert you if I’m stumped—smart move!",
      },
      {
        value: 'no',
        label: 'No',
        response: "Cool! I’ll stick with what I’ve got—ready to roll!",
      },
    ],
  },
  {
    id: 'finalize_knowledge_base',
    heading: 'Finalize Knowledge Base',
    text: "Ta-da! I’m packed with your biz know-how! Ready to save and let me shine as your employee?",
    options: [
      {
        value: 'save',
        label: 'Save',
        response: "Yay! I’m live and learning—thanks for teaching me!",
      },
      {
        value: 'edit',
        label: 'Edit',
        response: "Oops, let’s tweak! Back to where you want!",
      },
    ],
  },
];

const mockTickets = [
  {
    _id: { $oid: "683c783d5fb2b0a58185c1d0" },
    business_id: "BusinessType.TECH_turiniq.com",
    customer_id: null,
    customer_name: null,
    customer_email: null,
    customer_phone: null,
    conversation: [
      { user: "I want a refund.", timestamp: "2025-06-01T15:56:16.756738" },
      { user: "Please process it quickly.", timestamp: "2025-06-01T15:56:44.718660" },
    ],
    reason: "Refund request received. This requires immediate escalation to my supervisor as per company policy.",
    status: "open",
    created_at: { $date: { $numberLong: "1748793372721" } },
  },
  {
    _id: { $oid: "683c783d5fb2b0a58185c1d1" },
    business_id: "BusinessType.RETAIL_example.com",
    customer_id: "cust_123",
    customer_name: "John Doe",
    customer_email: "john.doe@example.com",
    customer_phone: "+1234567890",
    conversation: [
      { user: "My order hasn't arrived.", timestamp: "2025-06-01T10:30:00.123456" },
      { user: "Can you track it?", timestamp: "2025-06-01T10:32:15.654321" },
    ],
    reason: "Non-delivered order. Tracking information to be verified.",
    status: "in_progress",
    created_at: { $date: { $numberLong: "1748785000000" } },
  },
  {
    _id: { $oid: "683c783d5fb2b0a58185c1d2" },
    business_id: "BusinessType.SERVICES_abc.com",
    customer_id: "cust_456",
    customer_name: "Jane Smith",
    customer_email: "jane.smith@example.com",
    customer_phone: "+0987654321",
    conversation: [
      { user: "Issue with billing.", timestamp: "2025-06-01T12:45:00.987654" },
    ],
    reason: "Billing dispute. Awaiting clarification from the billing team.",
    status: "closed",
    created_at: { $date: { $numberLong: "1748788000000" } },
  },
];

const mockLeads = [
  {
    _id: { $oid: "683c7ae9541bde534aa876a8" },
    business_id: "BusinessType.TECH_turiniq.com",
    customer_name: "Test User",
    customer_email: "test_user@gmail.com",
    customer_phone: "+910980099090",
    conversation: [
      { user: "I want a refund.", timestamp: "2025-06-01T16:06:04.303007" },
      { user: "I want a refund.", timestamp: "2025-06-01T16:07:04.346687" },
      { agent: "Please provide your name to proceed.", timestamp: "2025-06-01T16:07:05.013503" },
      { user: "My name is Test User", timestamp: "2025-06-01T16:07:23.518898" },
      { agent: "Please provide your email to proceed.", timestamp: "2025-06-01T16:07:25.912237" },
      { user: "My email is test_user@gmail.com", timestamp: "2025-06-01T16:07:45.187347" },
      { agent: "Please provide your phone to proceed.", timestamp: "2025-06-01T16:07:45.807876" },
      { user: "My phone is +91 0980099090", timestamp: "2025-06-01T16:08:06.354094" },
    ],
    reason: "Refund request escalation",
    status: "open",
    created_at: { $date: { $numberLong: "1748793942085" } },
  },
  {
    _id: { $oid: "683c7ae9541bde534aa876a9" },
    business_id: "BusinessType.RETAIL_example.com",
    customer_name: "Alice Brown",
    customer_email: "alice.brown@example.com",
    customer_phone: "+1234567890",
    conversation: [
      { user: "Interested in your product.", timestamp: "2025-06-01T09:15:00.123456" },
      { agent: "Great! Can you share your contact details?", timestamp: "2025-06-01T09:16:00.654321" },
      { user: "Name: Alice Brown, Email: alice.brown@example.com", timestamp: "2025-06-01T09:17:30.987654" },
    ],
    reason: "Product inquiry",
    status: "in_progress",
    created_at: { $date: { $numberLong: "1748782500000" } },
  },
  {
    _id: { $oid: "683c7ae9541bde534aa876aa" },
    business_id: "BusinessType.SERVICES_abc.com",
    customer_name: "Unknown",
    customer_email: "bob.smith@example.com",
    customer_phone: "Unknown",
    conversation: [
      { user: "Can you help with a subscription issue?", timestamp: "2025-06-01T14:30:00.456789" },
      { agent: "Please provide your email for verification.", timestamp: "2025-06-01T14:31:00.789123" },
    ],
    reason: "Subscription issue",
    status: "closed",
    created_at: { $date: { $numberLong: "1748790000000" } },
  },
];