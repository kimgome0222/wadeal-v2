export { buildShareMessageContent } from "@/lib/share/share-message";
export { logReferralVisit } from "@/lib/share/log-referral-visit";
export { logShare } from "@/lib/share/log-share";
export { getOrCreateReferralCode, resolveUserIdByReferralCode } from "@/lib/share/referral-code";
export { getShareStatsForUser } from "@/lib/share/stats";
export { buildShareUrl, getSiteOrigin } from "@/lib/share/urls";
export { extractClientIp, hashIpAddress } from "@/lib/share/ip-hash";
export type { ShareChannel, ShareMessageContent, ShareStats } from "@/lib/share/types";
