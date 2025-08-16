'use client';

import React from 'react';
import { ConversationContext } from '@/lib/ai/types';

interface DomainSelectorProps {
  selectedDomain: ConversationContext['domain'];
  onDomainChange: (domain: ConversationContext['domain']) => void;
  domainIcons: Record<ConversationContext['domain'], React.ReactNode>;
}

const domains: Array<{
  key: ConversationContext['domain'];
  label: string;
  description: string;
}> = [
  {
    key: 'aws',
    label: 'AWS Certification',
    description: 'Study for AWS Developer Certificate'
  },
  {
    key: 'finance',
    label: 'Finance',
    description: 'Organize and plan finances'
  },
  {
    key: 'projects',
    label: 'Projects',
    description: 'Create and track projects'
  },
  {
    key: 'university',
    label: 'University',
    description: 'Academic studies and research'
  },
  {
    key: 'general',
    label: 'General',
    description: 'General assistance'
  }
];

export function DomainSelector({ selectedDomain, onDomainChange, domainIcons }: DomainSelectorProps) {
  return (
    <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {domains.map((domain) => (
          <button
            key={domain.key}
            onClick={() => onDomainChange(domain.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDomain === domain.key
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {domainIcons[domain.key]}
            <span className="hidden sm:inline">{domain.label}</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {domains.find(d => d.key === selectedDomain)?.description}
      </div>
    </div>
  );
}
