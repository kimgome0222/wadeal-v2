"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getMypageActivities,
  LOCAL_DATA_EVENTS,
  type ActivityItem,
} from "@/lib/storage/local-user-data";

function activityTone(type: ActivityItem["type"]) {
  if (type === "alert") {
    return "text-wadeal-red";
  }
  if (type === "join") {
    return "text-green-700";
  }
  return "text-wadeal-ink";
}

export function MypageRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setActivities(getMypageActivities(3));

    function syncActivities() {
      setActivities(getMypageActivities(3));
    }

    window.addEventListener(LOCAL_DATA_EVENTS.activity, syncActivities);
    return () => {
      window.removeEventListener(LOCAL_DATA_EVENTS.activity, syncActivities);
    };
  }, []);

  return (
    <section className="rounded-xl border border-wadeal-line bg-white p-4">
      <h2 className="text-sm font-black text-wadeal-ink">최근 활동</h2>
      <ul className="mt-3 space-y-2">
        {activities.map((activity) => (
          <li key={activity.id}>
            <Link
              className="block cursor-pointer rounded-lg border border-wadeal-line bg-wadeal-surface px-3 py-3 active:bg-gray-100"
              href={activity.href}
            >
              <p className={`text-xs font-black ${activityTone(activity.type)}`}>
                {activity.title}
              </p>
              <p className="mt-1 text-[13px] font-bold leading-relaxed text-wadeal-ink">
                {activity.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
