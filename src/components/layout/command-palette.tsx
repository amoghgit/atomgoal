"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppStore } from "@/store/app-store";
import {
  LayoutDashboard,
  Target,
  Users,
  BarChart3,
  Shield,
  Calendar,
  FileText,
  Share2,
  TrendingUp,
  CheckSquare,
} from "lucide-react";

const commandItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "My Goals", href: "/goals", icon: Target, group: "Navigation" },
  { label: "Create Goal", href: "/goals/create", icon: Target, group: "Actions" },
  { label: "Shared Goals", href: "/shared-goals", icon: Share2, group: "Navigation" },
  { label: "Achievements", href: "/achievements", icon: TrendingUp, group: "Navigation" },
  { label: "Check-ins", href: "/checkins", icon: CheckSquare, group: "Navigation" },
  { label: "Team Review", href: "/team", icon: Users, group: "Navigation" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Navigation" },
  { label: "Reports", href: "/reports", icon: FileText, group: "Navigation" },
  { label: "Audit Trail", href: "/audit", icon: Shield, group: "Navigation" },
  { label: "Cycle Management", href: "/cycles", icon: Calendar, group: "Navigation" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  const groups = Array.from(new Set(commandItems.map((item) => item.group)));

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, idx) => (
          <React.Fragment key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {commandItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                    className="gap-3 rounded-lg"
                  >
                    <item.icon className="h-4 w-4 text-gray-400" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
