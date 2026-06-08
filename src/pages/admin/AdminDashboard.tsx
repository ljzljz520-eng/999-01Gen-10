import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { FlaskConical, FileText, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { formatDate } from '../../utils/format';

export const AdminDashboard = () => {
  const { reagents, qualityReports, complaints, hasActiveComplaint } = useStore();

  const stats = [
    {
      label: '试剂总数',
      value: reagents.length,
      icon: FlaskConical,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: '质检报告',
      value: qualityReports.length,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: '待处理投诉',
      value: complaints.filter(c => c.status === 'pending').length,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: '需停用批次',
      value: reagents.filter(r => hasActiveComplaint(r.batchNo)).length,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const recentReports = [...qualityReports]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="animate-slide-up overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold text-gray-900">最近上传的报告</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentReports.map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {report.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        批号：{report.batchNo} · 版本 {report.version} · {formatDate(report.uploadedAt)}
                      </p>
                    </div>
                    <span className="ml-2 flex-shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                      {report.version}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-up overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-500" />
                <h3 className="font-semibold text-gray-900">最近投诉记录</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentComplaints.map((complaint) => (
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
                        批号：{complaint.batchNo} · 投诉人：{complaint.reporter}
                      </p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status === 'pending' ? '待处理' :
                       complaint.status === 'resolved' ? '已解决' : '已关闭'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
