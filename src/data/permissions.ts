export const permissions = [
  {
    permissionType: 'Delegated',
    permission: 'User.Read',
    description: 'Sign in and read user profile',
    glr: false,
    apiScan: false
  },
  {
    permissionType: 'Delegated',
    permission: 'User.ReadWrite',
    description: 'Read and write user profile',
    glr: false,
    apiScan: true
  },
  {
    permissionType: 'Delegated',
    permission: 'Mail.Read',
    description: 'Read user mail',
    glr: true,
    apiScan: true
  },
  {
    permissionType: 'Delegated',
    permission: 'Mail.Send',
    description: 'Send mail as a user',
    glr: false,
    apiScan: true
  },
  {
    permissionType: 'Application',
    permission: 'Application.Read.All',
    description: 'Read all applications',
    glr: false,
    apiScan: true
  },
  {
    permissionType: 'Application',
    permission: 'Directory.Read.All',
    description: 'Read directory data',
    glr: true,
    apiScan: false
  },
  {
    permissionType: 'Application',
    permission: 'Group.Read.All',
    description: 'Read all groups',
    glr: true,
    apiScan: false
  }
];