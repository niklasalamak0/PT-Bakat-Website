import React from 'react';
import { 
  Monitor, 
  Lightbulb, 
  FileText, 
  Wind, 
  Zap, 
  Building, 
  Settings,
  Wrench,
  Cpu,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Billboard: Monitor, // Using Monitor as fallback for Billboard
  Lightbulb,
  FileText,
  Wind,
  Zap,
  Building,
  Settings,
  Wrench,
  Monitor,
  Cpu,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Settings;
}
