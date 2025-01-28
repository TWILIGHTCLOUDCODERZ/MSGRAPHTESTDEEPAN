import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Permission } from '../types';

interface PermissionSelectProps {
  permissions: Permission[];
  selectedPermissions: Permission[];
  onPermissionChange: (permissions: Permission[]) => void;
}

export function PermissionSelect({
  permissions,
  selectedPermissions,
  onPermissionChange,
}: PermissionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPermissions = permissions.filter(
    (p) =>
      p.permission.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const togglePermission = (permission: Permission) => {
    const exists = selectedPermissions.find((p) => p.permission === permission.permission);
    if (exists) {
      onPermissionChange(
        selectedPermissions.filter((p) => p.permission !== permission.permission)
      );
    } else {
      onPermissionChange([...selectedPermissions, permission]);
    }
  };

  return (
    <div className="relative">
      <div
        className="border rounded-lg p-2 min-h-[42px] cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedPermissions.map((permission) => (
            <span
              key={permission.permission}
              className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm"
            >
              {permission.permission}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePermission(permission);
                }}
                className="ml-1"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          {selectedPermissions.length === 0 && (
            <span className="text-gray-500">Select permissions...</span>
          )}
          <ChevronDown className="h-5 w-5 ml-auto text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search permissions..."
              className="w-full p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredPermissions.map((permission) => (
              <label
                key={permission.permission}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.some(
                    (p) => p.permission === permission.permission
                  )}
                  onChange={() => togglePermission(permission)}
                  className="mr-2"
                />
                <div>
                  <div className="font-medium">{permission.permission}</div>
                  <div className="text-sm text-gray-600">{permission.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}