import React, { useState } from 'react';
import { AgentProfile } from '../components/AgentProfile';
import { useSelector } from 'react-redux';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock data based on API structure
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

const Leads = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const userProfile = useSelector((state) => ({
    userName: state.business.businessName || 'User',
    businessType: state.business.businessType || 'Unknown Business',
    domain: state.business.domain || 'yourdomain.com',
    industry: state.business.industry || 'Tech',
    businessGoal: state.business.businessGoal || 'Growth',
  }));

  // Load answers from localStorage
  const answers = JSON.parse(localStorage.getItem('agentProfileAnswers')) || {};

  // Toggle conversation visibility
  const toggleRow = (leadId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format created_at
  const formatCreatedAt = (createdAt) => {
    const date = new Date(parseInt(createdAt.$date.$numberLong));
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-row items-start gap-6 p-6 bg-intercom-dark min-h-screen">
      <div className="w-full  bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-black mb-6">Leads</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Lead ID</th>
                <th className="px-4 py-3">Business ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Customer Email</th>
                <th className="px-4 py-3">Customer Phone</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {mockLeads.map((lead) => (
                <React.Fragment key={lead._id.$oid}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{lead._id.$oid.slice(-6)}</td>
                    <td className="px-4 py-3">{lead.business_id}</td>
                    <td className="px-4 py-3">{lead.customer_name || 'N/A'}</td>
                    <td className="px-4 py-3">{lead.customer_email || 'N/A'}</td>
                    <td className="px-4 py-3">{lead.customer_phone || 'N/A'}</td>
                    <td className="px-4 py-3">{formatCreatedAt(lead.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRow(lead._id.$oid)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label={expandedRows[lead._id.$oid] ? 'Collapse conversation' : 'Expand conversation'}
                      >
                        {expandedRows[lead._id.$oid] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[lead._id.$oid] && (
                    <tr>
                      <td colSpan="9" className="px-4 py-3 bg-gray-50">
                        <div className="text-sm text-gray-700">
                          <h3 className="font-semibold mb-2">Conversation History</h3>
                          <ul className="space-y-2">
                            {lead.conversation.map((msg, index) => (
                              <li
                                key={index}
                                className={`border-l-2 pl-4 ${
                                  msg.agent ? 'border-blue-300' : 'border-gray-300'
                                }`}
                              >
                                <p className={msg.agent ? 'text-blue-600' : ''}>
                                  {msg.agent ? 'Agent: ' : 'User: '}
                                  {msg.agent || msg.user}
                                </p>
                                <p className="text-xs text-gray-500">{formatTimestamp(msg.timestamp)}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;