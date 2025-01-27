import React, { useState } from 'react';
import { RequestStatus } from '../types';
import { CheckCircle, XCircle, Clock, ChevronRight, Shield, ChevronDown, ArrowRight } from 'lucide-react';

interface DashboardProps {
  requests: RequestStatus[];
}

export function Dashboard({ requests }: DashboardProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

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

  const getApprovalProgress = (request: RequestStatus) => {
    const stages = ['Business', 'Technical', 'AM Team'];
    const currentIndex = stages.indexOf(request.currentStage);
    
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new permission request.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
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
                              <div className="mt-6 border-t pt-4">
                                <div className="space-y-4">
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

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Requested Permissions</h4>
                                    <div className="mt-2 space-y-2">
                                      {request.permissions.map((permission) => (
                                        <div
                                          key={permission.permission}
                                          className="text-sm"
                                        >
                                          <p className="font-medium text-gray-900">
                                            {permission.permission}
                                          </p>
                                          <p className="text-gray-500">
                                            {permission.description}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}