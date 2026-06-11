import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { Plus, Pencil, Trash2, FlaskConical, X, Check } from 'lucide-react';
import { Reagent } from '../../types';
import { formatDate, getExpiryStatus } from '../../utils/format';

export const ReagentManagement = () => {
  const { reagents, addReagent, updateReagent, deleteReagent, hasActiveComplaint, fetchReagents, fetchComplaints } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingReagent, setEditingReagent] = useState<Reagent | null>(null);
  const [formData, setFormData] = useState<Partial<Reagent>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchReagents();
    fetchComplaints();
  }, []);

  const handleOpenModal = (reagent?: Reagent) => {
    if (reagent) {
      setEditingReagent(reagent);
      setFormData(reagent);
    } else {
      setEditingReagent(null);
      setFormData({
        batchNo: '',
        name: '',
        purity: '',
        expiryDate: '',
        storageCondition: '',
        safetyInstruction: '',
        manufacturer: '',
        createdAt: new Date().toISOString(),
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReagent(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchNo || !formData.name) return;

    if (editingReagent) {
      await updateReagent(editingReagent.batchNo, formData as Reagent);
    } else {
      await addReagent(formData as Reagent);
    }
    handleCloseModal();
  };

  const handleDelete = async (batchNo: string) => {
    if (deleteConfirm === batchNo) {
      await deleteReagent(batchNo);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(batchNo);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <AdminLayout title="试剂信息管理">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 {reagents.length} 种试剂
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            新增试剂
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  试剂信息
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  批号
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  纯度
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  到期日
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  状态
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reagents.map((reagent) => {
                const expiryStatus = getExpiryStatus(reagent.expiryDate);
                const hasComplaint = hasActiveComplaint(reagent.batchNo);
                return (
                  <tr key={reagent.batchNo} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          hasComplaint ? 'bg-red-100' : 'bg-primary-100'
                        }`}>
                          <FlaskConical className={`h-5 w-5 ${
                            hasComplaint ? 'text-red-600' : 'text-primary-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reagent.name}</p>
                          <p className="text-xs text-gray-500">{reagent.manufacturer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                        {reagent.batchNo}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reagent.purity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(reagent.expiryDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                          expiryStatus.color.includes('warning') ? 'bg-red-100 text-red-700' :
                          expiryStatus.color.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {expiryStatus.text}
                        </span>
                        {hasComplaint && (
                          <span className="inline-flex w-fit rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            有投诉 - 需停用
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(reagent)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reagent.batchNo)}
                          className={`rounded-lg p-2 transition-colors ${
                            deleteConfirm === reagent.batchNo
                              ? 'bg-red-100 text-red-600'
                              : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          {deleteConfirm === reagent.batchNo ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl animate-fade-in overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingReagent ? '编辑试剂信息' : '新增试剂'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    试剂名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="如：氯化钠分析纯"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    批号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.batchNo || ''}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="如：RGT-2024-001234"
                    required
                    disabled={!!editingReagent}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    纯度
                  </label>
                  <input
                    type="text"
                    value={formData.purity || ''}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="如：99.5%"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    到期日
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    生产商
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="如：国药集团"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    储存条件
                  </label>
                  <input
                    type="text"
                    value={formData.storageCondition || ''}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    placeholder="如：室温干燥处，密封保存"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    安全说明
                  </label>
                  <textarea
                    value={formData.safetyInstruction || ''}
                    onChange={(e) => setFormData({ ...formData, safetyInstruction: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    rows={3}
                    placeholder="如：避免接触眼睛和皮肤，操作时佩戴防护手套"
                  />
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
                  {editingReagent ? '保存修改' : '添加试剂'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
