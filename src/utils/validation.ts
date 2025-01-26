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