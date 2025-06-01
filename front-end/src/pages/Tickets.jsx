import React, { useState } from 'react';
import { AgentProfile } from '../components/AgentProfile';
import { useSelector } from 'react-redux';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock data based on API structure
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

const Tickets = () => {
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
  const toggleRow = (ticketId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
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
    <div className="flex flex-row items-start gap-6 p-6 bg-intercom-dark min-h-screen ">
      <div className="w-full  bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-black mb-6">Tickets</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Business ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Customer Email</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket) => (
                <React.Fragment key={ticket._id.$oid}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{ticket._id.$oid.slice(-6)}</td>
                    <td className="px-4 py-3">{ticket.business_id}</td>
                    <td className="px-4 py-3">{ticket.customer_name || 'N/A'}</td>
                    <td className="px-4 py-3">{ticket.customer_email || 'N/A'}</td>
                    <td className="px-4 py-3">{ticket.reason}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatCreatedAt(ticket.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRow(ticket._id.$oid)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label={expandedRows[ticket._id.$oid] ? 'Collapse conversation' : 'Expand conversation'}
                      >
                        {expandedRows[ticket._id.$oid] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[ticket._id.$oid] && (
                    <tr>
                      <td colSpan="8" className="px-4 py-3 bg-gray-50">
                        <div className="text-sm text-gray-700">
                          <h3 className="font-semibold mb-2">Conversation History</h3>
                          <ul className="space-y-2">
                            {ticket.conversation.map((msg, index) => (
                              <li key={index} className="border-l-2 border-gray-300 pl-4">
                                <p>{msg.user}</p>
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

export default Tickets;