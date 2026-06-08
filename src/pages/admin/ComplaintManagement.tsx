import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { Plus, AlertTriangle, CheckCircle, XCircle, X, Ban, Check } from 'lucide-react';
import { formatDateTime, getComplaintStatusText, getComplaintStatusColor } from '../../utils/format';
import { Complaint } from '../../types';

export const ComplaintManagement = () => {
  const { reagents, complaints, addComplaint, updateComplaintStatus } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    batchNo: '',
    reporter: '',
    reason: '',
    stopUsage: true,
  });

  const handleOpenModal = () => {
    setFormData({
      batchNo: reagents[0]?.batchNo || '',
      reporter: '',
      reason: '',
      stopUsage: true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchNo || !formData.reporter || !formData.reason) return;

    addComplaint({
      batchNo: formData.batchNo,
      reporter: formData.reporter,
      reason: formData.reason,
      reportedAt: new Date().toISOString(),
      status: 'pending',
      stopUsage: formData.stopUsage,
    });
    handleCloseModal();
  };

  const getBatchInfo = (batchNo: string) => {
    return reagents.find(r => r.batchNo === batchNo);
  };

  const handleStatusUpdate = (
    id: string,
    status: Complaint['status'],
    stopUsage: boolean
  ) => {
    updateComplaintStatus(id, status, stopUsage);
  };

  const sortedComplaints = [...complaints].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  return (
    <AdminLayout title="投诉记录管理">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              共 {complaints.length} 条投诉记录
            </p>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              {complaints.filter(c => c.status === 'pending').length} 条待处理
            </span>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              {complaints.filter(c => c.stopUsage && c.status !== 'closed').length} 条需停用
            </span>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            新增投诉
          </button>
        </div>

        <div className="space-y-4">
          {sortedComplaints.map((complaint, index) => {
            const reagent = getBatchInfo(complaint.batchNo);
            return (
              <div
                key={complaint.id}
                className={`animate-slide-up overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md ${
                  complaint.stopUsage && complaint.status !== 'closed'
                    ? 'border-2 border-red-300 bg-red-50/50'
                    : 'border border-gray-200 bg-white'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                        complaint.status === 'pending'
                          ? 'bg-yellow-100'
                          : complaint.status === 'resolved'
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {complaint.status === 'pending' ? (
                          <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        ) : complaint.status === 'resolved' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {reagent?.name || '未知试剂'}
                          </h3>
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                            {complaint.batchNo}
                          </code>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getComplaintStatusColor(complaint.status)}`}>
                            {getComplaintStatusText(complaint.status)}
                          </span>
                          {complaint.stopUsage && complaint.status !== 'closed' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                              <Ban className="h-3 w-3" />
                              需停用
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                          {complaint.reason}
                        </p>

                        <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                          <span>投诉人：{complaint.reporter}</span>
                          <span>投诉时间：{formatDateTime(complaint.reportedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {complaint.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(complaint.id, 'resolved', false)}
                          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md"
                        >
                          <Check className="h-3.5 w-3.5" />
                          标记解决
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(complaint.id, 'closed', false)}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          关闭
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {complaint.stopUsage && complaint.status !== 'closed' && (
                  <div className="border-t border-red-200 bg-red-100/50 px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-red-700">
                      <Ban className="h-4 w-4" />
                      <span className="font-medium">已标记该批次停止使用，查询时将显示红色警告</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedComplaints.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-600">暂无投诉记录</h3>
              <p className="mt-2 text-sm text-gray-400">所有试剂批次质量正常</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl animate-fade-in overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">新增投诉记录</h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    选择试剂批次 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {reagents.map((reagent) => (
                      <option key={reagent.batchNo} value={reagent.batchNo}>
                        {reagent.name} ({reagent.batchNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    投诉人 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reporter}
                    onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="请输入投诉人姓名"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    投诉原因 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    rows={4}
                    placeholder="请详细描述投诉原因，如：试剂浓度不符合标准，实验结果异常等"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
                  <input
                    type="checkbox"
                    id="stopUsage"
                    checked={formData.stopUsage}
                    onChange={(e) => setFormData({ ...formData, stopUsage: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="stopUsage" className="text-sm text-gray-700">
                    <span className="font-medium text-red-600">标记该批次停止使用</span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      勾选后，实验人员查询该批次时将显示红色警告
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg"
                >
                  提交投诉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
