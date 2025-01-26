import React from 'react';
import { RequestStatus } from '../types';
import { CheckCircle, XCircle, Clock, ChevronRight, Shield } from 'lucide-react';

interface DashboardProps {
  requests: RequestStatus[];
}

export function Dashboard({ requests }: DashboardProps) {
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
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {requests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(request.status)}
                                <h3 className="text-lg font-medium text-gray-900">
                                  {request.id}
                                </h3>
                              </div>
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  request.status
                                )}`}
                              >
                                {request.status}
                              </span>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Stage</span>
                                <span className="font-medium text-gray-900">
                                  {request.currentStage}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Approver</span>
                                <span className="font-medium text-gray-900">
                                  {request.approver}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Submitted</span>
                                <span className="font-medium text-gray-900">
                                  {request.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                {request.permissions.length} permissions
                              </span>
                              <button className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                View details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </button>
                            </div>
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