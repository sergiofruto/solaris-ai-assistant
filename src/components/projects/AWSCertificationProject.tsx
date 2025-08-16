'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Target, BookOpen, CheckCircle, Play, Pause, Trophy } from 'lucide-react';
import { CertificationProject, StudyWeek, StudyTask } from '@/lib/projects/types';
import { getTemplateById, getAllTemplates } from '@/lib/projects/templates/aws-templates';
import { ProjectCreationDialog } from './ProjectCreationDialog';
import { WeekView } from './WeekView';

export function AWSCertificationProject() {
  const [projects, setProjects] = useState<CertificationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CertificationProject | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [templates] = useState(getAllTemplates());

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('aws-certification-projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setProjects(parsed.map((p: any) => ({
        ...p,
        targetDate: new Date(p.targetDate),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        weeks: p.weeks.map((w: any) => ({
          ...w,
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate)
        }))
      })));
    }
  }, []);

  const saveProjects = (newProjects: CertificationProject[]) => {
    setProjects(newProjects);
    localStorage.setItem('aws-certification-projects', JSON.stringify(newProjects));
  };

  const createProject = (projectData: {
    name: string;
    type: string;
    targetDate: Date;
    estimatedWeeks: number;
  }) => {
    const template = getTemplateById(projectData.type);
    if (!template) return;

    const startDate = new Date();
    const weeks: StudyWeek[] = [];

    for (let i = 0; i < projectData.estimatedWeeks; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekTasks: StudyTask[] = [
        {
          id: `week-${i + 1}-task-1`,
          title: template.weeklyTopics[i] || `Week ${i + 1} Study`,
          description: `Focus on ${template.weeklyTopics[i] || 'core concepts'}`,
          estimatedHours: 10,
          completed: false
        }
      ];

      weeks.push({
        id: `week-${i + 1}`,
        weekNumber: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        tasks: weekTasks,
        goals: [template.weeklyTopics[i] || `Complete Week ${i + 1} objectives`],
        completed: false
      });
    }

    const newProject: CertificationProject = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      type: projectData.type as any,
      targetDate: projectData.targetDate,
      currentWeek: 1,
      totalWeeks: projectData.estimatedWeeks,
      weeks,
      status: 'planning',
      createdAt: new Date(),
      updatedAt: new Date(),
      resources: template.recommendedResources
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setSelectedProject(newProject);
    setShowCreateDialog(false);
  };

  const updateProjectStatus = (projectId: string, status: CertificationProject['status']) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status, updatedAt: new Date() } : p
    );
    saveProjects(updatedProjects);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updatedProjects.find(p => p.id === projectId) || null);
    }
  };

  const completeTask = (projectId: string, weekId: string, taskId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedWeeks = project.weeks.map(week => {
          if (week.id === weekId) {
            const updatedTasks = week.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, completed: !task.completed, completedAt: new Date() };
              }
              return task;
            });
            return { ...week, tasks: updatedTasks };
          }
          return week;
        });
        return { ...project, weeks: updatedWeeks, updatedAt: new Date() };
      }
      return project;
    });
    saveProjects(updatedProjects);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updatedProjects.find(p => p.id === projectId) || null);
    }
  };

  const getStatusIcon = (status: CertificationProject['status']) => {
    switch (status) {
      case 'planning': return <BookOpen className="w-4 h-4" />;
      case 'in-progress': return <Play className="w-4 h-4" />;
      case 'completed': return <Trophy className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: CertificationProject['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AWS Certification Projects</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Plan, track, and complete your AWS certifications</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Project List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start your AWS certification journey by creating your first project
                </p>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.targetDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {project.currentWeek}/{project.totalWeeks} weeks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedProject ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'planning')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedProject.status === 'planning'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Planning
                    </button>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'in-progress')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedProject.status === 'in-progress'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'paused')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedProject.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'completed')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedProject.status === 'completed'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Complete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedProject.targetDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Week</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Week {selectedProject.currentWeek} of {selectedProject.totalWeeks}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.round((selectedProject.currentWeek / selectedProject.totalWeeks) * 100)}%
                    </p>
                  </div>
                </div>

                {selectedProject.resources && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recommended Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedProject.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {resource}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Plan */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Study Plan</h3>
                <div className="space-y-4">
                  {selectedProject.weeks.map((week) => (
                    <WeekView
                      key={week.id}
                      week={week}
                      onTaskComplete={(taskId) => completeTask(selectedProject.id, week.id, taskId)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Project</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a project from the left panel to view details and track progress
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Creation Dialog */}
      {showCreateDialog && (
        <ProjectCreationDialog
          templates={templates}
          onClose={() => setShowCreateDialog(false)}
          onCreate={createProject}
        />
      )}
    </div>
  );
}
