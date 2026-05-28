import { createNotification } from "@/lib/notifications/create";

export async function notifySupportReply(input: {
  userId: string;
  ticketTitle: string;
  ticketId: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "support_reply",
    "고객센터 답변",
    input.ticketTitle,
    `/support/${input.ticketId}`,
  );
}

export async function notifySupportResolved(input: {
  userId: string;
  ticketTitle: string;
  ticketId: string;
}): Promise<void> {
  await createNotification(
    input.userId,
    "support_resolved",
    "문의 처리 완료",
    input.ticketTitle,
    `/support/${input.ticketId}`,
  );
}
