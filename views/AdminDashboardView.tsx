import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissions, updateSubmissionStatus } from '../services/submissionService';
import { Submission, SubmissionStatus, SubmissionType, ServiceType, ViewType } from '../types';
import { SubmissionCard } from '../components/SubmissionCard';
import AdminChatBot from '../components/AdminChatBot';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AdminDashboardViewProps {
  onLogout: () => void;
  adminEmail: string;
  navigateTo: (view: ViewType) => void;
}

const FILTERS: { label: string, type: SubmissionType | 'All', icon: string }[] = [
    { label: 'All', type: 'All', icon: '📊' },
    { label: 'Landing Leads', type: 'Landing Lead', icon: '🎯' },
    { label: 'Residential', type: ServiceType.Residential, icon: '🏠' },
    { label: 'Commercial', type: ServiceType.Commercial, icon: '🏢' },
    { label: 'Airbnb', type: ServiceType.Airbnb, icon: '🏨' },
    { label: 'Job Apps', type: ServiceType.Jobs, icon: '💼' },
];

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}> = ({ title, value, icon, trend, trendUp, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    gold: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trendUp ? '↗' : '↘'}</span>
              {trend}
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors] || colors.blue} flex items-center justify-center text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Mini Bar Chart Component
const MiniBarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-bold text-gray-900">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500`}
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onLogout, adminEmail, navigateTo }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeFilter, setActiveFilter] = useState<SubmissionType | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'chat'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSubmissions = async () => {
      const data = await getSubmissions();
      setSubmissions(data);
    };
    loadSubmissions();

    if (isSupabaseConfigured() && supabase) {
      const channel = supabase
        .channel('submissions-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'submissions'
          },
          async (payload) => {
            const updatedData = await getSubmissions();
            setSubmissions(updatedData);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    const updatedSubmissions = await updateSubmissionStatus(id, status);
    setSubmissions(updatedSubmissions);
  };

  const handleSubmissionsUpdate = (updatedSubmissions: Submission[]) => {
      setSubmissions(updatedSubmissions);
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === SubmissionStatus.Pending).length;
    const confirmed = submissions.filter(s => s.status === SubmissionStatus.Confirmed).length;

    // Calculate revenue estimate
    const revenue = submissions
      .filter(s => s.status === SubmissionStatus.Confirmed)
      .reduce((sum, s) => sum + ((s.data as any).priceEstimate || 0), 0);

    // Calculate average lead score
    const scoresWithValues = submissions.filter(s => s.leadScore);
    const avgLeadScore = scoresWithValues.length > 0
      ? (scoresWithValues.reduce((sum, s) => sum + (s.leadScore || 0), 0) / scoresWithValues.length).toFixed(1)
      : 0;

    // Conversion rate
    const conversionRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0;

    return { total, pending, confirmed, revenue, avgLeadScore, conversionRate };
  }, [submissions]);

  // Submissions by type for chart
  const submissionsByType = useMemo(() => {
    return FILTERS.filter(f => f.type !== 'All').map(filter => ({
      label: filter.label,
      value: submissions.filter(s => s.type === filter.type).length,
      color: filter.type === ServiceType.Residential ? '#3B82F6'
            : filter.type === ServiceType.Commercial ? '#10B981'
            : filter.type === ServiceType.Airbnb ? '#8B5CF6'
            : filter.type === ServiceType.Jobs ? '#F59E0B'
            : '#6B7280'
    }));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    let filtered = activeFilter === 'All'
      ? submissions
      : submissions.filter(s => s.type === activeFilter);

    if (searchQuery) {
      filtered = filtered.filter(s => {
        const data = s.data as any;
        const searchLower = searchQuery.toLowerCase();
        return (
          s.id.toLowerCase().includes(searchLower) ||
          (data.fullName && data.fullName.toLowerCase().includes(searchLower)) ||
          (data.email && data.email.toLowerCase().includes(searchLower)) ||
          (data.phone && data.phone.toLowerCase().includes(searchLower)) ||
          (data.suburb && data.suburb.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [submissions, activeFilter, searchQuery]);

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
        alert("No submissions to export in the current filter.");
        return;
    }

    const headers = [
        'ID', 'Timestamp', 'Type', 'Status', 'AI Summary', 'Lead Score', 'Price Estimate',
        'Full Name', 'Email', 'Phone', 'Suburb', 'Property Type', 'Bedrooms', 'Bathrooms',
        'Service Type', 'Frequency', 'Notes'
    ];

    const sanitizeCSVField = (field: any): string => {
        if (field === null || field === undefined) return '';
        if (Array.isArray(field)) field = field.join('; ');
        if (typeof field === 'boolean') field = field ? 'Yes' : 'No';
        let str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvRows = [headers.join(',')];

    filteredSubmissions.forEach(submission => {
        const data = submission.data as any;
        const row = [
            submission.id,
            new Date(submission.timestamp).toISOString(),
            submission.type,
            submission.status,
            submission.summary,
            submission.leadScore,
            data.priceEstimate,
            data.fullName || data.contactPerson || data.contactName,
            data.email,
            data.phone,
            data.suburb,
            data.propertyType,
            data.bedrooms,
            data.bathrooms,
            data.serviceType,
            data.frequency,
            data.notes
        ];
        csvRows.push(row.map(sanitizeCSVField).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const date = new Date().toISOString().split('T')[0];
    const filename = `clean_up_bros_submissions_${activeFilter.replace(/\s+/g, '_').toLowerCase()}_${date}.csv`;
    link.setAttribute('download', filename);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {adminEmail}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('AdminGiftCards')}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <span>🎁</span> Gift Cards
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
                disabled={filteredSubmissions.length === 0}
              >
                <span>📥</span> Export CSV
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-6 mt-4 border-b border-gray-200 -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-brand-gold text-brand-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-brand-gold text-brand-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-brand-gold text-brand-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Total Submissions"
                value={metrics.total}
                icon="📊"
                color="blue"
              />
              <MetricCard
                title="Pending Quotes"
                value={metrics.pending}
                icon="⏳"
                color="orange"
              />
              <MetricCard
                title="Confirmed"
                value={metrics.confirmed}
                icon="✅"
                trend="+12% vs last month"
                trendUp={true}
                color="green"
              />
              <MetricCard
                title="Est. Revenue"
                value={`$${metrics.revenue.toLocaleString()}`}
                icon="💰"
                trend="+8% vs last month"
                trendUp={true}
                color="gold"
              />
              <MetricCard
                title="Avg Lead Score"
                value={`${metrics.avgLeadScore}/10`}
                icon="⭐"
                color="purple"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submissions by Type */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Submissions by Type</h3>
                <MiniBarChart data={submissionsByType} />
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                    <span className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <span className="text-2xl font-bold text-blue-600">&lt;2h</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                    <span className="text-2xl font-bold text-purple-600">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Submissions Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-brand-gold hover:text-brand-gold/80 font-semibold text-sm"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {sub.type === ServiceType.Residential ? '🏠'
                          : sub.type === ServiceType.Commercial ? '🏢'
                          : sub.type === ServiceType.Airbnb ? '🏨'
                          : sub.type === ServiceType.Jobs ? '💼'
                          : '🎯'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{(sub.data as any).fullName || (sub.data as any).contactName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{sub.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sub.leadScore && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          ⭐ {sub.leadScore}/10
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sub.status === SubmissionStatus.Confirmed ? 'bg-green-100 text-green-800'
                        : sub.status === SubmissionStatus.Pending ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="animate-fade-in-up">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search by name, email, phone, or suburb..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map(filter => (
                    <button
                      key={filter.label}
                      onClick={() => setActiveFilter(filter.type)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        activeFilter === filter.type
                          ? 'bg-brand-gold text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.icon} {filter.label}
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {filter.type === 'All' ? submissions.length : submissions.filter(s => s.type === filter.type).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(sub => (
                  <SubmissionCard key={sub.id} submission={sub} onStatusChange={handleStatusChange} onSubmissionsUpdate={handleSubmissionsUpdate} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Submissions Found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try a different search term' : 'No submissions in this category yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in-up">
            <AdminChatBot adminEmail={adminEmail} activeFilter={activeFilter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardView;
