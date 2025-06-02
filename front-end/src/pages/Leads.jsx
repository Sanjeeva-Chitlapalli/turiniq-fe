import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSelector } from "react-redux";

const Leads = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userProfile = useSelector((state) => ({
    userName: state.business.businessName || "User",
    businessType: state.business.businessType || "Unknown Business",
    domain: state.business.domain || "yourdomain.com",
    industry: state.business.industry || "Tech",
    businessGoal: state.business.businessGoal || "Growth",
  }));

  // Load answers from localStorage
  const answers = JSON.parse(localStorage.getItem("agentProfileAnswers")) || {};

  // Get businessId from localStorage
  const businessId = `BusinessType.${answers.business_type.toUpperCase()}_${
    answers.domain
  }`;

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.BACKEND_URL}/leads/${encodeURIComponent(businessId)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeads(data.leads || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [businessId]);

  // Toggle conversation visibility
  const toggleRow = (leadId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format created_at
  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt); // API returns ISO string, no $date.$numberLong
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-row items-start gap-6 p-6 bg-intercom-dark min-h-screen">
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-black mb-6">Leads</h1>
        {loading ? (
          <p className="text-gray-600">Loading leads...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-600">No leads found for this business.</p>
        ) : (
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
                {leads.map((lead) => (
                  <React.Fragment key={lead._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{lead.business_id}</td>
                      <td className="px-4 py-3">
                        {lead.customer_name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {lead.customer_email || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {lead.customer_phone || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {formatCreatedAt(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRow(lead._id)}
                          className="text-gray-600 hover:text-gray-900"
                          aria-label={
                            expandedRows[lead._id]
                              ? "Collapse conversation"
                              : "Expand conversation"
                          }
                        >
                          {expandedRows[lead._id] ? (
                            <FiChevronUp size={20} />
                          ) : (
                            <FiChevronDown size={20} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[lead._id] && (
                      <tr>
                        <td colSpan="7" className="px-4 py-3 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            <h3 className="font-semibold mb-2">
                              Conversation History
                            </h3>
                            <ul className="space-y-2">
                              {lead.conversation.map((msg, index) => (
                                <li
                                  key={index}
                                  className={`border-l-2 pl-4 ${
                                    msg.agent
                                      ? "border-blue-300"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <p
                                    className={msg.agent ? "text-blue-600" : ""}
                                  >
                                    {msg.agent ? "Agent: " : "User: "}
                                    {msg.agent || msg.user}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTimestamp(msg.timestamp)}
                                  </p>
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
        )}
      </div>
    </div>
  );
};

export default Leads;
