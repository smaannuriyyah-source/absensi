"use client";

import { type LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  accentColor?: "green" | "blue";
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  accentColor = "green",
}: TabsProps) {
  return (
    <div className="glass-surface p-1.5 mb-6 inline-flex gap-1 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
              rounded-lg transition-all duration-300 whitespace-nowrap
              ${
                isActive
                  ? accentColor === "green"
                    ? "bg-white/70 dark:bg-white/10 text-primary-700 dark:text-primary-300 shadow-sm backdrop-blur-sm border border-primary-400/20 dark:border-primary-400/10"
                    : "bg-white/70 dark:bg-white/10 text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-sm border border-blue-400/20 dark:border-blue-400/10"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/30 dark:hover:bg-white/5"
              }
            `}
          >
            <Icon
              size={18}
              className={
                isActive
                  ? accentColor === "green"
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
