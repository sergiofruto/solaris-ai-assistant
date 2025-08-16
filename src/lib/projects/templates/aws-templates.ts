import { ProjectTemplate } from '../types';

export const AWS_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'aws-developer',
    name: 'AWS Certified Developer - Associate',
    description: 'Comprehensive study plan for AWS Developer certification covering core services, development tools, and best practices.',
    estimatedWeeks: 12,
    weeklyTopics: [
      'Week 1: AWS Fundamentals & IAM',
      'Week 2: EC2 & VPC Basics',
      'Week 3: S3 & Storage Services',
      'Week 4: Lambda & Serverless',
      'Week 5: API Gateway & DynamoDB',
      'Week 6: CloudFormation & CDK',
      'Week 7: CI/CD with CodePipeline',
      'Week 8: Monitoring & Logging',
      'Week 9: Security & Compliance',
      'Week 10: Advanced Lambda & EventBridge',
      'Week 11: Practice Exams & Review',
      'Week 12: Final Preparation & Exam'
    ],
    recommendedResources: [
      'AWS Developer Documentation',
      'AWS Free Tier Account',
      'Practice Exams (Whizlabs, Tutorials Dojo)',
      'Hands-on Labs (AWS Skill Builder)',
      'Study Guide Books',
      'YouTube Channels (AWS, Adrian Cantrill)'
    ]
  },
  {
    id: 'aws-solutions-architect',
    name: 'AWS Certified Solutions Architect - Associate',
    description: 'Study plan for AWS Solutions Architect focusing on designing scalable, reliable, and cost-effective systems.',
    estimatedWeeks: 14,
    weeklyTopics: [
      'Week 1: AWS Fundamentals & Well-Architected Framework',
      'Week 2: IAM & Security Fundamentals',
      'Week 3: VPC & Networking',
      'Week 4: EC2 & Compute Services',
      'Week 5: S3 & Storage Solutions',
      'Week 6: RDS & Database Services',
      'Week 7: Load Balancing & Auto Scaling',
      'Week 8: CloudFront & CDN',
      'Week 9: Lambda & Serverless Architecture',
      'Week 10: CloudFormation & Infrastructure as Code',
      'Week 11: Monitoring & Logging',
      'Week 12: High Availability & Disaster Recovery',
      'Week 13: Practice Exams & Review',
      'Week 14: Final Preparation & Exam'
    ],
    recommendedResources: [
      'AWS Solutions Architect Documentation',
      'AWS Well-Architected Framework',
      'Practice Exams (Whizlabs, Tutorials Dojo)',
      'Hands-on Labs (AWS Skill Builder)',
      'Study Guide Books',
      'YouTube Channels (AWS, Adrian Cantrill)'
    ]
  },
  {
    id: 'aws-sysops',
    name: 'AWS Certified SysOps Administrator - Associate',
    description: 'Study plan for AWS SysOps focusing on operational excellence, monitoring, and troubleshooting.',
    estimatedWeeks: 13,
    weeklyTopics: [
      'Week 1: AWS Fundamentals & IAM',
      'Week 2: VPC & Networking',
      'Week 3: EC2 & Compute Management',
      'Week 4: S3 & Storage Management',
      'Week 5: RDS & Database Operations',
      'Week 6: CloudWatch & Monitoring',
      'Week 7: CloudTrail & Logging',
      'Week 8: Auto Scaling & Load Balancing',
      'Week 9: Backup & Recovery',
      'Week 10: Security & Compliance',
      'Week 11: Troubleshooting & Support',
      'Week 12: Practice Exams & Review',
      'Week 13: Final Preparation & Exam'
    ],
    recommendedResources: [
      'AWS SysOps Documentation',
      'AWS Free Tier Account',
      'Practice Exams (Whizlabs, Tutorials Dojo)',
      'Hands-on Labs (AWS Skill Builder)',
      'Study Guide Books',
      'YouTube Channels (AWS, Adrian Cantrill)'
    ]
  }
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return AWS_TEMPLATES.find(template => template.id === id);
}

export function getAllTemplates(): ProjectTemplate[] {
  return AWS_TEMPLATES;
}
