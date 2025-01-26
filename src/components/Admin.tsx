import React, { useState } from 'react';
import { RequestStatus, ApprovalStage } from '../types';
import { CheckCircle, XCircle, Clock, ChevronDown, MessageSquare, Shield, AlertTriangle } from 'lucide-react';

interface AdminProps {
  requests: RequestStatus[];
  onApprove: (requestId: string, stage: ApprovalStage, comments: string) => void;
  onDeny: (requestId: string, stage: ApprovalStage, comments: string) => void;
}

export function Admin({ requests, onApprove, onDeny }: AdminProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [comments, setComments] = useState<string>('');

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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <React.Fragment key={request.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setExpandedRequest(
                                expandedRequest === request.id ? null : request.id
                              )}
                              className="flex items-center space-x-2 text-left"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transform transition-transform ${
                                  expandedRequest === request.id ? 'rotate-180' : ''
                                }`}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{request.id}</div>
                                <div className="text-sm text-gray-500">
                                  {request.permissions.length} permissions requested
                                </div>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex items-center space-x-1 text-sm leading-5 font-medium rounded-full ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              <span>{request.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.currentStage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.approver}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {request.status === 'Pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAction(request.id, 'approve', request.currentStage)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(request.id, 'deny', request.currentStage)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deny
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {expandedRequest === request.id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                                    Request Details
                                  </h4>
                                  
                                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-5 sm:p-6">
                                      <h5 className="text-sm font-medium text-gray-900 mb-4">
                                        Requested Permissions
                                      </h5>
                                      <div className="space-y-4">
                                        {request.permissions.map((permission) => (
                                          <div
                                            key={permission.permission}
                                            className="flex items-start space-x-3 text-sm"
                                          >
                                            {permission.glr || permission.apiScan ? (
                                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            ) : (
                                              <Shield className="h-4 w-4 text-blue-500" />
                                            )}
                                            <div>
                                              <p className="font-medium text-gray-900">
                                                {permission.permission}
                                              </p>
                                              <p className="text-gray-500">
                                                {permission.description}
                                              </p>
                                              {(permission.glr || permission.apiScan) && (
                                                <div className="mt-1 flex space-x-2">
                                                  {permission.glr && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                      Requires GLR
                                                    </span>
                                                  )}
                                                  {permission.apiScan && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                      Requires API Scan
                                                    </span>
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

                                <div>
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
                                              {history.date.toLocaleDateString()}
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
                                  <div>
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
                                  </div>
                                )}
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
        </div>
      </div>
    </div>
  );
}