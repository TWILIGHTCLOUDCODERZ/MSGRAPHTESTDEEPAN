export function generateRequestId(): string {
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ-${timestamp}-${random}`.toUpperCase();
}