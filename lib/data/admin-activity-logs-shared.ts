import type { Json } from "@/lib/database/types";
import type { AdminAction, AdminTargetType } from "@/lib/admin/activity-log-shared";

export type AdminActivityLogListItem = {
  id: string;
  adminUserId: string;
  adminName: string;
  adminEmail: string | null;
  action: AdminAction;
  actionLabel: string;
  targetType: AdminTargetType;
  targetTypeLabel: string;
  targetId: string;
  beforeData: Json | null;
  afterData: Json | null;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: string;
  createdAtLabel: string;
};

export type AdminActivityLogFilters = {
  adminId?: string;
  action?: AdminAction;
  targetType?: AdminTargetType;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type AdminActivityLogListResult = {
  logs: AdminActivityLogListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminActivityLogAdminOption = {
  id: string;
  label: string;
};
