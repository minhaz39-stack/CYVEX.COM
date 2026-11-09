import type { CollectionConfig } from 'payload'

export const IntelReports: CollectionConfig = {
  slug: 'intel-reports',
  admin: {
    group: 'Threat Intelligence',
    defaultColumns: ['indicator', 'type', 'confidence', 'status', 'createdAt'],
    useAsTitle: 'indicator',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'admins',
    read: ({ req }) => req.user?.collection === 'admins',
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    { name: 'indicator', type: 'text', required: true, index: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['domain', 'url', 'ipv4', 'certificate-fingerprint'],
    },
    { name: 'comment', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'reporter', type: 'email', required: true },
    { name: 'verifiedReporter', type: 'checkbox', defaultValue: false },
    { name: 'confidence', type: 'number', min: 0, max: 100, defaultValue: 50 },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'verified', 'rejected', 'false-positive'],
      defaultValue: 'pending',
      index: true,
    },
  ],
  timestamps: true,
}
