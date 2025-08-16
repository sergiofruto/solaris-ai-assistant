'use client';

import React, { useState } from 'react';
import { X, Calendar, Target, BookOpen } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects/types';

interface ProjectCreationDialogProps {
  templates: ProjectTemplate[];
  onClose: () => void;
  onCreate: (projectData: {
    name: string;
    type: string;
    targetDate: Date;
    estimatedWeeks: number;
  }) => void;
}

export function ProjectCreationDialog({ templates, onClose, onCreate }: ProjectCreationDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !projectName || !targetDate) return;

    onCreate({
      name: projectName,
      type: selectedTemplate.id,
      targetDate: new Date(targetDate),
      estimatedWeeks: selectedTemplate.estimatedWeeks
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create AWS Certification Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Choose Certification Path
              </label>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {template.estimatedWeeks} weeks
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {template.weeklyTopics.length} topics
                          </div>
                        </div>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., My AWS Developer Journey"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Target Date */}
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Completion Date
              </label>
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getMinDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Selected Template Preview */}
            {selectedTemplate && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Study Plan Preview</h4>
                <div className="space-y-2">
                  {selectedTemplate.weeklyTopics.slice(0, 5).map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {topic}
                    </div>
                  ))}
                  {selectedTemplate.weeklyTopics.length > 5 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{selectedTemplate.weeklyTopics.length - 5} more weeks...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTemplate || !projectName || !targetDate}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
