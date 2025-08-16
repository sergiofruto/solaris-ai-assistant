export interface StudyTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface StudyWeek {
  id: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  tasks: StudyTask[];
  goals: string[];
  completed: boolean;
}

export interface CertificationProject {
  id: string;
  name: string;
  type: 'aws-developer' | 'aws-solutions-architect' | 'aws-sysops' | 'custom';
  targetDate: Date;
  currentWeek: number;
  totalWeeks: number;
  weeks: StudyWeek[];
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  resources?: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  estimatedWeeks: number;
  weeklyTopics: string[];
  recommendedResources: string[];
}
