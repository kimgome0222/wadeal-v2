"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateNotificationSettingsAction } from "@/app/actions/notification-settings";
import type { NotificationSettings } from "@/lib/profile/types";
import { ui } from "@/lib/ui";

type MypageNotificationSettingsContentProps = {
  initialSettings: NotificationSettings;
};

type ToggleField =
  | "groupbuyDeadline"
  | "tierAchievement"
  | "orderShipping"
  | "marketing";

type ChannelField = "kakao" | "email" | "push";

const NOTIFICATION_TOGGLES: { field: ToggleField; label: string; description: string }[] = [
  {
    field: "groupbuyDeadline",
    label: "관심 상품 알림",
    description: "관심 상품의 혜택 종료가 가까워지면 알려드려요.",
  },
  {
    field: "tierAchievement",
    label: "혜택 단계 알림",
    description: "가격 단계가 적용되면 알려드려요.",
  },
  {
    field: "orderShipping",
    label: "주문·배송 알림",
    description: "결제, 배송 시작, 배송 완료 등 주문 상태를 알려드려요.",
  },
  {
    field: "marketing",
    label: "혜택·이벤트 알림",
    description: "쿠폰, 프로모션 등 마케팅 정보를 받을 수 있어요.",
  },
];

const CHANNEL_TOGGLES: { field: ChannelField; label: string }[] = [
  { field: "kakao", label: "카카오톡" },
  { field: "email", label: "이메일" },
  { field: "push", label: "앱 푸시 (준비 중)" },
];

export function MypageNotificationSettingsContent({
  initialSettings,
}: MypageNotificationSettingsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [feedback, setFeedback] = useState<string | null>(null);

  function save(next: NotificationSettings) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateNotificationSettingsAction({
        groupbuyDeadline: next.groupbuyDeadline,
        tierAchievement: next.tierAchievement,
        orderShipping: next.orderShipping,
        marketing: next.marketing,
        channels: next.channels,
      });

      if (!result.success) {
        setFeedback("저장에 실패했어요. 다시 시도해 주세요.");
        return;
      }

      if (result.settings) {
        setSettings(result.settings);
      }
      setFeedback("알림 설정이 저장됐어요.");
      router.refresh();
    });
  }

  function toggleNotification(field: ToggleField) {
    const next = { ...settings, [field]: !settings[field] };
    setSettings(next);
    save(next);
  }

  function toggleChannel(field: ChannelField) {
    const next = {
      ...settings,
      channels: { ...settings.channels, [field]: !settings.channels[field] },
    };
    setSettings(next);
    save(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold leading-relaxed text-wadeal-muted">
        알림 수신 설정을 관리할 수 있어요. 채널별 설정은 순차적으로 연결됩니다.
      </p>

      <ul className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        {NOTIFICATION_TOGGLES.map((item) => (
          <li className="px-4 py-4" key={item.field}>
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <span>
                <span className="block text-sm font-black text-wadeal-ink">{item.label}</span>
                <span className="mt-1 block text-xs font-bold text-wadeal-muted">
                  {item.description}
                </span>
              </span>
              <input
                checked={settings[item.field]}
                className="mt-1 shrink-0"
                disabled={isPending}
                onChange={() => toggleNotification(item.field)}
                type="checkbox"
              />
            </label>
          </li>
        ))}
      </ul>

      <section className="overflow-hidden rounded-xl border border-wadeal-line bg-white divide-y divide-wadeal-line">
        <div className="px-4 py-3">
          <p className="text-xs font-black text-wadeal-muted">알림 채널</p>
        </div>
        {CHANNEL_TOGGLES.map((item) => (
          <div className="px-4 py-4" key={item.field}>
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-black text-wadeal-ink">{item.label}</span>
              <input
                checked={settings.channels[item.field]}
                className="shrink-0"
                disabled={isPending || item.field === "push"}
                onChange={() => toggleChannel(item.field)}
                type="checkbox"
              />
            </label>
          </div>
        ))}
      </section>

      {feedback ?
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700" role="status">
          {feedback}
        </p>
      : null}

      <p className="text-[11px] leading-relaxed text-wadeal-muted">
        혜택·이벤트 알림은 마케팅 수신 동의가 필요해요. 동의 철회는 언제든지 가능합니다.{" "}
        <Link className="font-semibold text-[#2E5E4E] underline" href="/policies/marketing">
          마케팅 수신 정책
        </Link>
      </p>
    </div>
  );
}
