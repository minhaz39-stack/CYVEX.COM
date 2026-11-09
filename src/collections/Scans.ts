import type { CollectionConfig } from 'payload'

export const Scans: CollectionConfig = {
  slug: 'scans',
  admin: {
    group: 'Threat Intelligence',
    defaultColumns: ['target', 'status', 'score', 'verdict', 'createdAt'],
    useAsTitle: 'target',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => false,
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    { name: 'taskId', type: 'text', required: true, unique: true, index: true },
    { name: 'target', type: 'text', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'queued',
      options: ['queued', 'running', 'completed', 'failed'],
      index: true,
    },
    { name: 'score', type: 'number', min: 0, max: 100, defaultValue: 0 },
    {
      name: 'verdict',
      type: 'select',
      options: ['safe', 'suspicious', 'malicious', 'unknown'],
      defaultValue: 'unknown',
    },
    { name: 'summary', type: 'textarea' },
    { name: 'error', type: 'textarea' },
    { name: 'results', type: 'json' },
  ],
  timestamps: true,
}
