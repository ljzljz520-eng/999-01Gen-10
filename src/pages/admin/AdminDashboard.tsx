import { useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { FlaskConical, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { formatDate } from '../../utils/format';

export const AdminDashboard = () => {
  const { reagents, complaints, hasActiveComplaint, fetchReagents, fetchComplaints } = useStore();

  useEffect(() => {
    fetchReagents();
    fetchComplaints();
  }, []);

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const stopUsageCount = reagents.filter(r => hasActiveComplaint(r.batchNo)).length;

  const stats = [
    {
      label: '试剂总数',
      value: reagents.length,
      icon: FlaskConical,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: '待处理投诉',
      value: pendingCount,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: '需停用批次',
      value: stopUsageCount,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: '投诉总数',
      value: complaints.length,
      icon: ShieldAlert,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 8);

  return (
    <AdminLayout title="控制台">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="animate-slide-up rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 text-white ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-slide-up overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-500" />
                <h3 className="font-semibold text-gray-900">最近投诉记录</h3>
              </div>
              {pendingCount > 0 && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  {pendingCount} 条待处理
                </span>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentComplaints.length > 0 ? recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`px-6 py-4 ${
                  complaint.stopUsage && complaint.status !== 'closed' ? 'bg-red-50/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {complaint.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      批号：{complaint.batchNo} · 投诉人：{complaint.reporter} · {formatDate(complaint.reportedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {complaint.stopUsage && complaint.status !== 'closed' && (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        停用中
                      </span>
                    )}
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status === 'pending' ? '待处理' :
                       complaint.status === 'resolved' ? '已解决' : '已关闭'}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="px-6 py-12 text-center text-sm text-gray-400">
                暂无投诉记录
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
