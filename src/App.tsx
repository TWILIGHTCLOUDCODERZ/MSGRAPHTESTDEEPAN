import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PermissionSelect } from './components/PermissionSelect';
import { PermissionTable } from './components/PermissionTable';
import { Dashboard } from './components/Dashboard';
import { Help } from './components/Help';
import { Admin } from './components/Admin';
import { permissions } from './data/permissions';
import { Permission, RequestStatus, ApprovalStage, APPROVAL_FLOW, ApprovalHistory } from './types';
import { validatePermissionRequest } from './utils/validation';
import { generateRequestId } from './utils/requestId';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

// Mock approvers data - in a real app, this would come from your auth system
const APPROVERS: Record<ApprovalStage, string> = {
  'Business': 'Deepan Vampire',
  'Technical': 'Tessa Smith',
  'AM Team': 'Mike Tyson'
};

function App() {
  const [activeTab, setActiveTab] = useState('request');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Record<string, 'Application' | 'Delegated' | 'Both'>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<RequestStatus[]>([
    {
      id: 'REQ-001',
      status: 'Pending',
      currentStage: 'Business',
      approver: APPROVERS['Business'],
      permissions: [],
      justifications: {},
      attachments: {},
      links: {},
      sites: {},
      createdAt: new Date('2024-03-10'),
      approvalHistory: []
    }
  ]);

  const handleTypeChange = (permission: string, type: 'Application' | 'Delegated' | 'Both') => {
    setSelectedTypes((prev) => ({
      ...prev,
      [permission]: type
    }));
    setValidationErrors([]);
  };

  const handleJustificationChange = (permission: string, justification: string) => {
    setJustifications((prev) => ({
      ...prev,
      [permission]: justification
    }));
    setValidationErrors([]);
  };

  const handleApprove = (requestId: string, stage: ApprovalStage, comments: string) => {
    setRequests((prevRequests) => {
      return prevRequests.map((request) => {
        if (request.id === requestId) {
          const currentStageIndex = APPROVAL_FLOW.indexOf(stage);
          const nextStage = APPROVAL_FLOW[currentStageIndex + 1];
          
          const approvalHistory: ApprovalHistory = {
            stage,
            status: 'Approved',
            approver: APPROVERS[stage],
            date: new Date(),
            comments
          };

          if (!nextStage) {
            return {
              ...request,
              status: 'Approved',
              approvalHistory: [...request.approvalHistory, approvalHistory]
            };
          }

          return {
            ...request,
            currentStage: nextStage,
            approver: APPROVERS[nextStage],
            approvalHistory: [...request.approvalHistory, approvalHistory]
          };
        }
        return request;
      });
    });
  };

  const handleDeny = (requestId: string, stage: ApprovalStage, comments: string) => {
    setRequests((prevRequests) => {
      return prevRequests.map((request) => {
        if (request.id === requestId) {
          const approvalHistory: ApprovalHistory = {
            stage,
            status: 'Denied',
            approver: APPROVERS[stage],
            date: new Date(),
            comments
          };

          return {
            ...request,
            status: 'Denied',
            approvalHistory: [...request.approvalHistory, approvalHistory]
          };
        }
        return request;
      });
    });
  };

  const handleSubmit = async () => {
    const validation = validatePermissionRequest(
      selectedPermissions.map(p => p.permission),
      selectedTypes,
      justifications
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const requestId = generateRequestId();
      const newRequest: RequestStatus = {
        id: requestId,
        status: 'Pending',
        currentStage: 'Business',
        approver: APPROVERS['Business'],
        permissions: selectedPermissions,
        justifications,
        attachments: {},
        links: {},
        sites: {},
        createdAt: new Date(),
        approvalHistory: []
      };

      setRequests(prev => [newRequest, ...prev]);
      setSelectedPermissions([]);
      setSelectedTypes({});
      setJustifications({});
      setValidationErrors([]);
      setActiveTab('dashboard');
    } catch (error) {
      setValidationErrors(['An error occurred while submitting the request. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'request':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center space-x-4">
                <ShieldCheck className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">Request Graph Permissions</h2>
                  <p className="mt-1 text-blue-100">
                    Select and configure the permissions you need for your application.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Permissions</h3>
              <PermissionSelect
                permissions={permissions}
                selectedPermissions={selectedPermissions}
                onPermissionChange={setSelectedPermissions}
              />
            </div>
            
            {selectedPermissions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configure Permissions</h3>
                <PermissionTable
                  permissions={selectedPermissions}
                  selectedTypes={selectedTypes}
                  justifications={justifications}
                  onTypeChange={handleTypeChange}
                  onJustificationChange={handleJustificationChange}
                />

                {validationErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Please fix the following errors:
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white
                      ${isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'help':
        return <Help />;
      case 'dashboard':
        return <Dashboard requests={requests} />;
      case 'admin':
        return (
          <Admin
            requests={requests}
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;