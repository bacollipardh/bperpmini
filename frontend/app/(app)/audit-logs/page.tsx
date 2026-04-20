import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { api } from '@/lib/api';

export default async function AuditLogsPage() {
  const logs = await api.list('audit-logs');

  return (
    <div>
      <PageHeader title="Audit Logs" description="Gjurmimi i veprimeve në sistem." />
      <DataTable
        data={logs}
        columns={[
          { key: 'entityType', title: 'Entity', render: (row: any) => row.entityType },
          { key: 'action', title: 'Action', render: (row: any) => row.action },
          { key: 'entityId', title: 'Entity ID', render: (row: any) => row.entityId },
          { key: 'userId', title: 'User ID', render: (row: any) => row.userId ?? '-' },
          { key: 'createdAt', title: 'Created At', render: (row: any) => new Date(row.createdAt).toLocaleString() },
        ]}
      />
    </div>
  );
}
