import React, { useState } from 'react';
import { RequestStatus } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  Shield, 
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import DateFilter from './DateFilter';
import { saveAs } from 'file-saver';

interface DashboardProps {
  requests: RequestStatus[];
}

export function Dashboard({ requests }: DashboardProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getStatusIcon = (status: 'Pending' | 'Approved' | 'Denied') => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'Pending' | 'Approved' | 'Denied') => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesDateRange = (!startDate || request.createdAt >= startDate) && (!endDate || request.createdAt <= endDate);
    const matchesSearchQuery = searchQuery
      ? request.id.includes(searchQuery) || request.status.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus = !selectedStatus || request.status === selectedStatus;
    return matchesDateRange && matchesSearchQuery && matchesStatus;
  });

  const metrics = {
    total: requests.filter(request => {
      const createdAt = new Date(request.createdAt);
      return (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
    }).length,
    pending: requests.filter(request => {
      const createdAt = new Date(request.createdAt);
      return request.status === 'Pending' && (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
    }).length,
    approved: requests.filter(request => {
      const createdAt = new Date(request.createdAt);
      return request.status === 'Approved' && (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
    }).length,
    denied: requests.filter(request => {
      const createdAt = new Date(request.createdAt);
      return request.status === 'Denied' && (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
    }).length
  };

  const getApprovalProgress = (request: RequestStatus) => {
    const stages = ['Business', 'Technical', 'AM Team'];
    
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          {stages.map((stage, index) => {
            const isCompleted = request.approvalHistory.some(h => h.stage === stage);
            const isCurrent = request.currentStage === stage;
            const isDenied = request.approvalHistory.some(h => h.stage === stage && h.status === 'Denied');
            
            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDenied
                        ? 'bg-red-100'
                        : isCompleted
                        ? 'bg-green-100'
                        : isCurrent
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {isDenied ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium text-gray-600">{stage}</span>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className={`w-4 h-4 ${
                    isCompleted ? 'text-green-500' : 'text-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Status', 'Current Stage', 'Submitted'];
    const rows = requests.map(request => [
      request.id,
      request.status,
      request.currentStage,
      new Date(request.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'requests.csv');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Request Dashboard</h2>
            <p className="mt-1 text-emerald-100">
              Track your Graph permission requests.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter</h3>
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          downloadCSV={downloadCSV}
          // isAdmin={true} // or set this based on your logic
        />
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={() => setSelectedStatus(null)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={() => setSelectedStatus('Pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">{metrics.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={() => setSelectedStatus('Approved')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-green-600">{metrics.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={() => setSelectedStatus('Denied')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Denied</p>
              <p className="text-2xl font-semibold text-red-600">{metrics.denied}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {startDate || endDate ? 'Try selecting a different date range' : 'Get started by creating a new permission request'}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.id}
                        </h3>
                      </div>
                      <button
                        onClick={() => setExpandedRequest(
                          expandedRequest === request.id ? null : request.id
                        )}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {expandedRequest === request.id ? 'Hide details' : 'View details'}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transform transition-transform ${
                            expandedRequest === request.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <span
                          className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Current Stage</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {request.currentStage}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Submitted</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {request.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {getApprovalProgress(request)}

                    {expandedRequest === request.id && (
                      <div className="mt-6 space-y-6 border-t pt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Requested Permissions</h4>
                          <div className="mt-2 space-y-4">
                            {request.permissions.map((permission) => (
                              <div
                                key={permission.permission}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <h5 className="text-sm font-medium text-gray-900">
                                  {permission.permission}
                                </h5>
                                <p className="mt-1 text-sm text-gray-500">
                                  {permission.description}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                  <strong>Justification:</strong>{' '}
                                  {request.justifications[permission.permission]}
                                </p>
                                {(permission.glr || permission.apiScan) && (
                                  <div className="mt-2 space-y-2">
                                    {permission.glr && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                        Requires GLR
                                      </span>
                                    )}
                                    {permission.apiScan && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Requires API Scan
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Approval History</h4>
                          <div className="mt-2 space-y-3">
                            {request.approvalHistory.map((history, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 text-sm"
                              >
                                {getStatusIcon(history.status)}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {history.stage} - {history.status}
                                  </p>
                                  <p className="text-gray-500">
                                    {history.approver} on{' '}
                                    {history.date.toLocaleString()}
                                  </p>
                                  {history.comments && (
                                    <p className="mt-1 text-gray-600 bg-gray-50 rounded p-2">
                                      "{history.comments}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {request.status === 'Pending' && (
                              <div className="flex items-start space-x-3 text-sm">
                                <Clock className="h-5 w-5 text-yellow-500" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Pending {request.currentStage} Approval
                                  </p>
                                  <p className="text-gray-500">
                                    Waiting for {request.approver}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}