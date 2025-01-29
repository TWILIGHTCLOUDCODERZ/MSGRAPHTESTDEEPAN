import { useState } from 'react';
import { RequestStatus, ApprovalStage } from '../types';
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  MessageSquare,
  Shield,
  AlertTriangle,
  ArrowRight,
  Upload,
  Link as LinkIcon,
  MapPin,
  CheckSquare,
  BarChart3,
  Users
} from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import DateFilter from './DateFilter';
import { Fragment } from 'react';
import { saveAs } from 'file-saver';

interface AdminProps {
  requests: RequestStatus[];
  onApprove: (requestId: string, stage: ApprovalStage, comments: string) => void;
  onDeny: (requestId: string, stage: ApprovalStage, comments: string) => void;
}

const APPROVERS = {
  'Business': 'John Doe',
  'Technical': 'Jane Smith',
  'AM Team': 'Mike Johnson'
};

export function Admin({ requests, onApprove, onDeny }: AdminProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [comments, setComments] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedApprovers, setExpandedApprovers] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredRequests = requests.filter(request => {
    const createdAt = new Date(request.createdAt);
    const matchesDateRange = (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
    const matchesSearchTerm = request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || request.status === selectedStatus;
    return matchesDateRange && matchesSearchTerm && matchesStatus;
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

  const handleAction = (
    requestId: string,
    action: 'approve' | 'deny',
    stage: ApprovalStage
  ) => {
    if (comments.trim() === '') {
      alert('Please provide comments before taking action');
      return;
    }

    if (action === 'approve') {
      onApprove(requestId, stage, comments);
    } else {
      onDeny(requestId, stage, comments);
    }

    setComments('');
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
              <Fragment key={stage}>
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
                  <span className="text-xs mt-1 font-medium text-gray-600">
                    {stage}
                    <br />
                    <span className="text-xs text-gray-500">({APPROVERS[stage as keyof typeof APPROVERS]})</span>
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className={`w-4 h-4 ${
                    isCompleted ? 'text-green-500' : 'text-gray-300'
                  }`} />
                )}
              </Fragment>
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className="mt-1 text-purple-100">
              Manage and approve Graph permission requests.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          downloadCSV={downloadCSV}
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
            <BarChart3 className="h-8 w-8 text-purple-600" />
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

      {/* Approvers Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Approvers</h3>
          </div>
          <button
            onClick={() => setExpandedApprovers(!expandedApprovers)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {expandedApprovers ? 'Hide Approvers' : 'Show Approvers'}
            <ChevronDown
              className={`ml-1 h-4 w-4 transform transition-transform ${
                expandedApprovers ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
        {expandedApprovers && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Object.entries(APPROVERS).map(([stage, approver], index) => (
              <div key={stage} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">{index + 1}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{stage}</p>
                  <p className="text-sm text-gray-500">{approver}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
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
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {getApprovalProgress(request)}

                  {expandedRequest === request.id && (
                    <div className="mt-6 space-y-6">
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          Requested Permissions
                        </h4>
                        <div className="space-y-4">
                          {request.permissions.map((permission) => (
                            <div
                              key={permission.permission}
                              className="bg-gray-50 rounded-lg p-4"
                            >
                              <div className="flex items-start space-x-3">
                                {permission.glr || permission.apiScan ? (
                                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                ) : (
                                  <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                                )}
                                <div className="flex-1">
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
                                  <div className="mt-2 flex flex-wrap gap-2">
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
                                  {(permission.glr || permission.apiScan) && (
                                    <div className="mt-3 space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <Upload className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          {request.attachments[permission.permission]?.length || 0} Attachments
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <LinkIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          {request.links[permission.permission]?.length || 0} Links
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          {request.sites[permission.permission]?.length || 0} Sites
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          Approval History
                        </h4>
                        <div className="space-y-4">
                          {request.approvalHistory.map((history, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg border border-gray-200 p-4"
                            >
                              <div className="flex items-start space-x-3">
                                {getStatusIcon(history.status)}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {history.stage} - {history.status}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {history.approver} on{' '}
                                    {history.date.toLocaleString()}
                                  </p>
                                  {history.comments && (
                                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                                      "{history.comments}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {request.status === 'Pending' && (
                        <div className="border-t pt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <label
                              htmlFor="comments"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Approval Comments
                            </label>
                          </div>
                          <textarea
                            id="comments"
                            rows={3}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Add your comments..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                          />
                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={() => handleAction(request.id, 'approve', request.currentStage)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(request.id, 'deny', request.currentStage)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Deny
                            </button>
                          </div>
                        </div>
                      )}

                      {request.status === 'Approved' && (
                        <div className="border-t pt-4">
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Implement Permissions
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

