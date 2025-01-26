export interface Permission {
  permissionType: string;
  permission: string;
  description: string;
  glr: boolean;
  apiScan: boolean;
}

export type ApprovalStage = 'Business' | 'Technical' | 'AM Team';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Denied';

export interface ApprovalHistory {
  stage: ApprovalStage;
  status: ApprovalStatus;
  approver: string;
  date: Date;
  comments?: string;
}

export interface RequestStatus {
  id: string;
  status: ApprovalStatus;
  currentStage: ApprovalStage;
  approver: string;
  permissions: Permission[];
  justifications: Record<string, string>;
  attachments: Record<string, File[]>;
  links: Record<string, string[]>;
  sites: Record<string, string[]>;
  createdAt: Date;
  approvalHistory: ApprovalHistory[];
}

export const APPROVAL_FLOW: ApprovalStage[] = ['Business', 'Technical', 'AM Team'];