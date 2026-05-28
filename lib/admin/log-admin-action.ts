import {
  createAdminActivityLog,
  type AdminAction,
  type AdminTargetType,
} from "@/lib/admin/activity-log";
import { getAdminRequestContext } from "@/lib/admin/admin-request-context";

export async function logAdminAction(input: {
  adminUserId: string;
  action: AdminAction;
  targetType: AdminTargetType;
  targetId: string;
  beforeData?: unknown;
  afterData?: unknown;
}): Promise<void> {
  const requestContext = await getAdminRequestContext();

  await createAdminActivityLog({
    adminUserId: input.adminUserId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    beforeData: input.beforeData,
    afterData: input.afterData,
    ipHash: requestContext.ipHash,
    userAgent: requestContext.userAgent,
  });
}
