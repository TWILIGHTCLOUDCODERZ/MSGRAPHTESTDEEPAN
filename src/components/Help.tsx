import React from 'react';
import { ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { permissions } from '../data/permissions';

export function Help() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Understanding Graph Permissions
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              Microsoft Graph permissions determine what data your application can access. There are two
              types of permissions:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  <strong>Delegated permissions</strong> are used when your app needs to access data on
                  behalf of a signed-in user.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>
                  <strong>Application permissions</strong> are used when your app needs to access data
                  without a signed-in user.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Common Conflicts</h3>
          <div className="mt-2">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Selecting both Application and Delegated permissions
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Generally, you should choose either Application OR Delegated permissions, not both.
                      Selecting both types for the same permission often indicates a misunderstanding of
                      how the application will authenticate and access data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Available Permissions</h3>
          <div className="mt-4 space-y-4">
            {permissions.map((permission) => (
              <div key={permission.permission} className="border-b pb-4">
                <h4 className="text-md font-medium text-gray-900">{permission.permission}</h4>
                <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                <div className="mt-2">
                  {permission.glr && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                      Requires GLR
                    </span>
                  )}
                  {permission.apiScan && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Requires API Scan
                    </span>
                  )}
                </div>
                <a
                  href="https://learn.microsoft.com/en-us/graph/permissions-reference"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <span className="mr-1">View documentation</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}