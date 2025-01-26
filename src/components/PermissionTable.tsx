import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, HelpCircle, Upload, Link as LinkIcon, MapPin } from 'lucide-react';
import { Permission } from '../types';

interface PermissionTableProps {
  permissions: Permission[];
  selectedTypes: Record<string, 'Application' | 'Delegated' | 'Both'>;
  justifications: Record<string, string>;
  onTypeChange: (permission: string, type: 'Application' | 'Delegated' | 'Both') => void;
  onJustificationChange: (permission: string, justification: string) => void;
}

interface AdditionalFields {
  attachments: string[];
  links: string[];
  sites: string[];
}

export function PermissionTable({
  permissions,
  selectedTypes,
  justifications,
  onTypeChange,
  onJustificationChange,
}: PermissionTableProps) {
  const [additionalFields, setAdditionalFields] = useState<Record<string, AdditionalFields>>({});
  const [deniedHistory] = useState<Record<string, { date: string }>>({
    'User.ReadWrite': { date: '12/01/2024' },
    'Application.Read.All': { date: '11/15/2024' },
  });

  const handleFieldChange = (
    permission: string,
    fieldType: 'attachments' | 'links' | 'sites',
    value: string
  ) => {
    setAdditionalFields((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [fieldType]: [...(prev[permission]?.[fieldType] || []), value],
      },
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Help
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Justification
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requirements
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Additional Fields
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permissions.map((permission) => {
            const isConflict = selectedTypes[permission.permission] === 'Both';
            const deniedInfo = deniedHistory[permission.permission];

            return (
              <tr key={permission.permission} className={isConflict ? 'bg-amber-50' : ''}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {permission.permission}
                  </div>
                  <div className="text-sm text-gray-500">{permission.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <a
                      href={`https://learn.microsoft.com/en-us/graph/permissions-reference`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span>What this does?</span>
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={['Application', 'Both'].includes(selectedTypes[permission.permission] || '')}
                        onChange={(e) => {
                          const current = selectedTypes[permission.permission];
                          if (current === 'Delegated') {
                            onTypeChange(permission.permission, e.target.checked ? 'Both' : 'Delegated');
                          } else if (current === 'Both') {
                            onTypeChange(permission.permission, e.target.checked ? 'Both' : 'Delegated');
                          } else {
                            onTypeChange(permission.permission, e.target.checked ? 'Application' : 'None');
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Application</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={['Delegated', 'Both'].includes(selectedTypes[permission.permission] || '')}
                        onChange={(e) => {
                          const current = selectedTypes[permission.permission];
                          if (current === 'Application') {
                            onTypeChange(permission.permission, e.target.checked ? 'Both' : 'Application');
                          } else if (current === 'Both') {
                            onTypeChange(permission.permission, e.target.checked ? 'Both' : 'Application');
                          } else {
                            onTypeChange(permission.permission, e.target.checked ? 'Delegated' : 'None');
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Delegated</span>
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <textarea
                    value={justifications[permission.permission] || ''}
                    onChange={(e) => onJustificationChange(permission.permission, e.target.value)}
                    placeholder="Enter justification..."
                    className="w-full p-2 border rounded-md text-sm"
                    rows={3}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {permission.glr && (
                      <div className="text-amber-600 font-medium">Requires GLR</div>
                    )}
                    {permission.apiScan && (
                      <div className="text-amber-600 font-medium">Requires API Scan</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(permission.glr || permission.apiScan) && (
                    <div className="space-y-2">
                      <div>
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                          <Upload className="h-4 w-4" />
                          <span>Attachments</span>
                        </label>
                        <input
                          type="file"
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                          multiple
                        />
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                          <LinkIcon className="h-4 w-4" />
                          <span>Links</span>
                        </label>
                        <input
                          type="url"
                          placeholder="Add link"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              handleFieldChange(permission.permission, 'links', input.value);
                              input.value = '';
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>Sites</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Add site"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              handleFieldChange(permission.permission, 'sites', input.value);
                              input.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isConflict && (
                    <div className="text-amber-600 flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Why selecting both?
                    </div>
                  )}
                  {deniedInfo && (
                    <div className="text-red-600 text-sm">
                      Denied earlier on {deniedInfo.date}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}