"use client";

import { useCallback, useRef, useState, type ReactNode, type TouchEvent } from "react";

import { HOME_SWIPE_TABS } from "@/lib/home/mock-home-commerce-data";

type SwipeTabId = (typeof HOME_SWIPE_TABS)[number]["id"];

type HomeCommerceSwipeShellProps = {
  children: ReactNode;
};

/** 메인 배경 swipe → 상단 탭 전환 + 섹션 scroll */
export function HomeCommerceSwipeShell({ children }: HomeCommerceSwipeShellProps) {
  const [activeTab, setActiveTab] = useState<SwipeTabId>(HOME_SWIPE_TABS[0]?.id ?? "best");
  const touchStartX = useRef<number | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const changeTab = useCallback(
    (direction: 1 | -1) => {
      const index = HOME_SWIPE_TABS.findIndex((tab) => tab.id === activeTab);
      const nextIndex = (index + direction + HOME_SWIPE_TABS.length) % HOME_SWIPE_TABS.length;
      const next = HOME_SWIPE_TABS[nextIndex];
      if (!next) {
        return;
      }
      setActiveTab(next.id);
      scrollToSection(next.sectionId);
    },
    [activeTab, scrollToSection],
  );

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("[data-rail-item]") || target.closest(".no-swipe-tab")) {
      touchStartX.current = null;
      return;
    }
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null) {
      return;
    }
    const delta = endX - startX;
    if (Math.abs(delta) < 48) {
      return;
    }
    changeTab(delta < 0 ? 1 : -1);
  }

  return (
    <div onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
      <div className="no-swipe-tab sticky top-[calc(56px+52px+44px)] z-40 border-b border-[#E8ECEA] bg-white/95 backdrop-blur-sm">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-2">
          {HOME_SWIPE_TABS.map((tab) => (
            <button
              aria-pressed={activeTab === tab.id}
              className={`h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-[100ms] ${
                activeTab === tab.id ?
                  "bg-[#2E5E4E] text-white"
                : "border border-[#E8ECEA] bg-white text-[#666666]"
              }`}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                scrollToSection(tab.sectionId);
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
