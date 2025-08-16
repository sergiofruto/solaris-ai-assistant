'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Circle, Calendar, Target } from 'lucide-react';
import { StudyWeek, StudyTask } from '@/lib/projects/types';

interface WeekViewProps {
  week: StudyWeek;
  onTaskComplete: (taskId: string) => void;
}

export function WeekView({ week, onTaskComplete }: WeekViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedTasks = week.tasks.filter(task => task.completed).length;
  const totalTasks = week.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Week Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{week.weekNumber}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Week {week.weekNumber}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(week.startDate)} - {formatDate(week.endDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {completedTasks}/{totalTasks} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
            </div>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Week Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Goals */}
          {week.goals.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weekly Goals</h4>
              <div className="space-y-1">
                {week.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Study Tasks</h4>
            <div className="space-y-3">
              {week.tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <button
                    onClick={() => onTaskComplete(task.id)}
                    className="mt-0.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className={`font-medium ${
                          task.completed 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h5>
                        <p className={`text-sm ${
                          task.completed 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {task.estimatedHours}h
                      </div>
                    </div>
                    
                    {task.completed && task.completedAt && (
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                        Completed on {task.completedAt.toLocaleDateString()}
                      </div>
                    )}
                    
                    {task.notes && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border">
                        {task.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
