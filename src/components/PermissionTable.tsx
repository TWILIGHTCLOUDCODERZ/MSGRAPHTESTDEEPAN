import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Permission } from '../types';

interface PermissionTableProps {
  permissions: Permission[];
  selectedTypes: Record<string, 'Application' | 'Delegated' | 'Both' | 'None'>;
  justifications: Record<string, string>;
  onTypeChange: (permission: string, type: 'Application' | 'Delegated' | 'Both' | 'None') => void;
  onJustificationChange: (permission: string, justification: string) => void;
  onSubmit: () => void;
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
  const [errors] = useState<string[]>([]);

  const handleFieldChange = (
    permission: string,
    fieldType: 'attachments' | 'links' | 'sites',
    value: string
  ) => {
    setAdditionalFields((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [fieldType]: value,
      },
    }));
  };

  const handleTypeChange = (permission: string, type: 'Application' | 'Delegated') => {
    const currentType = selectedTypes[permission];
    let newType: 'Application' | 'Delegated' | 'Both' | 'None';

    if (currentType === type) {
      newType = 'None';
    } else if (currentType === 'None' || !currentType) {
      newType = type;
    } else if (currentType === 'Both') {
      newType = type === 'Application' ? 'Delegated' : 'Application';
    } else {
      newType = 'Both';
    }

    onTypeChange(permission, newType);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600">{error}</div>
          ))}
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Help/New Tab
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Application
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Delegated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Justification
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notice
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
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Documentation
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTypes[permission.permission] === 'Application' || selectedTypes[permission.permission] === 'Both'}
                    onChange={() => handleTypeChange(permission.permission, 'Application')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTypes[permission.permission] === 'Delegated' || selectedTypes[permission.permission] === 'Both'}
                    onChange={() => handleTypeChange(permission.permission, 'Delegated')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <textarea
                    value={justifications[permission.permission] || ''}
                    onChange={(e) => onJustificationChange(permission.permission, e.target.value)}
                    className={`w-full p-2 border rounded ${isConflict ? 'border-red-500' : ''}`}
                    placeholder={isConflict ? 'Why selecting both Application and Delegated?' : ''}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isConflict && <div className="text-sm text-red-600">Why selecting both Application and Delegated?</div>}
                  {deniedInfo && <div className="text-sm text-red-600">Denied earlier on {deniedInfo.date}</div>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {permissions.some((permission) => permission.glr || permission.apiScan) && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Fields</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Needs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  List of Sites
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission) => {
                if (!permission.glr && !permission.apiScan) return null;

                const fields = additionalFields[permission.permission] || {};

                return (
                  <tr key={permission.permission}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.permission}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {permission.glr && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          GLR
                        </span>
                      )}
                      {permission.apiScan && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          API Scan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="file"
                        onChange={(e) => handleFieldChange(permission.permission, 'attachments', e.target.value)}
                        className={`p-2 border rounded ${errors.includes(`Attachment is required for: ${permission.permission}`) ? 'border-red-500' : ''}`}
                      />
                      {errors.includes(`Attachment is required for: ${permission.permission}`) && (
                        <div className="text-sm text-red-600">Attachment is required</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add Link"
                        value={fields.links || ''}
                        onChange={(e) => handleFieldChange(permission.permission, 'links', e.target.value)}
                        className={`p-2 border rounded ${errors.includes(`Link is required for: ${permission.permission}`) ? 'border-red-500' : ''}`}
                      />
                      {errors.includes(`Link is required for: ${permission.permission}`) && (
                        <div className="text-sm text-red-600">Link is required</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add Sites"
                        value={fields.sites || ''}
                        onChange={(e) => handleFieldChange(permission.permission, 'sites', e.target.value)}
                        className={`p-2 border rounded ${errors.includes(`List of sites is required for: ${permission.permission}`) ? 'border-red-500' : ''}`}
                      />
                      {errors.includes(`List of sites is required for: ${permission.permission}`) && (
                        <div className="text-sm text-red-600">List of sites is required</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}