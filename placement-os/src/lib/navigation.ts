import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Flame,
  Focus,
  GitBranch,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Moon,
  Notebook,
  Rocket,
  Settings,
  Target,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const mainNav: NavGroup[] = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Placement Countdown", href: "/countdown", icon: Target },
      { label: "Daily Planner", href: "/planner/daily", icon: Calendar },
      { label: "Weekly Review", href: "/planner/weekly", icon: ListChecks },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Preparation",
    items: [
      { label: "DSA Tracker", href: "/dsa", icon: GitBranch },
      { label: "DSA Roadmap", href: "/dsa/roadmap", icon: Rocket },
      { label: "Daily Challenge", href: "/dsa/daily", icon: Zap, badge: "New" },
      { label: "Practice", href: "/dsa/practice", icon: Zap },
      { label: "Mock Tests", href: "/dsa/mock", icon: Target },
      { label: "Revision", href: "/revision", icon: BookOpen },
      { label: "Aptitude", href: "/aptitude", icon: Brain },
      { label: "MCQ Practice", href: "/mcq-practice", icon: Brain, badge: "New" },
      { label: "CS Subjects", href: "/subjects", icon: Notebook },
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Mock Interview", href: "/mock-interview", icon: MessageSquare },
    ],
  },
  {
    title: "Build & Brand",
    items: [
      { label: "Resume", href: "/resume", icon: ListChecks },
      { label: "GitHub / LinkedIn", href: "/social-tracker", icon: GitBranch },
    ],
  },
  {
    title: "Execution",
    items: [
      { label: "Habits", href: "/habits", icon: Flame },
      { label: "Focus Mode", href: "/focus", icon: Focus },
      { label: "Pomodoro", href: "/pomodoro", icon: Timer },
      { label: "Notes", href: "/notes", icon: BookOpen },
    ],
  },
  {
    title: "Wellness & AI",
    items: [
      { label: "AI Mentor", href: "/ai-mentor", icon: Brain },
      { label: "Burnout Recovery", href: "/burnout", icon: Moon },
      { label: "Low-Energy Mode", href: "/low-energy", icon: Zap, badge: "Soft" },
    ],
  },
  {
    title: "Motivation",
    items: [
      { label: "Streaks", href: "/streaks", icon: Flame },
      { label: "XP & Levels", href: "/xp", icon: Trophy },
      { label: "Achievements", href: "/achievements", icon: Trophy },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Sheet Admin", href: "/admin", icon: Settings },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Home", href: "/", icon: Home },
    ],
  },
];
