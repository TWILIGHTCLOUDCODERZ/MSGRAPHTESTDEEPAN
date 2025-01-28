export function validatePermissionRequest(
  selectedPermissions: string[],
  selectedTypes: Record<string, string>,
  justifications: Record<string, string>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if any permissions are selected
  if (selectedPermissions.length === 0) {
    errors.push('Please select at least one permission');
  }

  // Check if all selected permissions have a type
  const missingTypes = selectedPermissions.filter(
    permission => !selectedTypes[permission]
  );
  if (missingTypes.length > 0) {
    errors.push(`Please select a type for: ${missingTypes.join(', ')}`);
  }

  // Check if all selected permissions have a justification
  const missingJustifications = selectedPermissions.filter(
    permission => !justifications[permission]?.trim()
  );
  if (missingJustifications.length > 0) {
    errors.push(`Please provide justification for: ${missingJustifications.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateAdditionalFields(
  permissions: { permission: string; glr?: boolean; apiScan?: boolean }[],
  additionalFields: Record<string, { attachments: string[]; links: string[]; sites: string[] }>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  permissions.forEach((permission) => {
    if (permission.glr || permission.apiScan) {
      const fields = additionalFields[permission.permission] || {};
      if (!fields.attachments || fields.attachments.length === 0) {
        errors[`${permission.permission}-attachments`] = 'Attachment is required';
      }
      if (!fields.links || fields.links.length === 0) {
        errors[`${permission.permission}-links`] = 'Link is required';
      }
      if (!fields.sites || fields.sites.length === 0) {
        errors[`${permission.permission}-sites`] = 'List of sites is required';
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}