import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { Plus, Upload, History, FileText, X, Check, Download, Trash2, ArrowRight } from 'lucide-react';
import { formatDateTime, formatFileSize } from '../../utils/format';
import { QualityReport } from '../../types';

export const ReportManagement = () => {
  const navigate = useNavigate();
  const { reagents, qualityReports, uploadReport, deleteReport, getReports } = useStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remark, setRemark] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleOpenUpload = () => {
    setSelectedBatch(reagents[0]?.batchNo || '');
    setSelectedFile(null);
    setRemark('');
    setShowUploadModal(true);
  };

  const handleCloseUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedBatch || !selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      uploadReport(selectedBatch, selectedFile, remark);
      setIsUploading(false);
      handleCloseUpload();
    }, 1000);
  };

  const handleDelete = (reportId: string) => {
    if (deleteConfirm === reportId) {
      deleteReport(reportId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(reportId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getBatchInfo = (batchNo: string) => {
    return reagents.find(r => r.batchNo === batchNo);
  };

  const groupedReports = reagents.map(reagent => ({
    reagent,
    reports: getReports(reagent.batchNo),
  })).filter(group => group.reports.length > 0);

  return (
    <AdminLayout title="质检报告管理">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            共 {qualityReports.length} 份质检报告，涉及 {groupedReports.length} 个批次
          </p>
          <button
            onClick={handleOpenUpload}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            上传报告
          </button>
        </div>

        <div className="space-y-6">
          {groupedReports.map(({ reagent, reports }) => (
            <div key={reagent.batchNo} className="animate-slide-up overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{reagent.name}</h3>
                  <p className="text-sm text-gray-500">
                    批号：<code className="rounded bg-white px-1.5 py-0.5 text-xs">{reagent.batchNo}</code>
                    <span className="mx-2">·</span>
                    共 {reports.length} 个版本
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/admin/reports/${reagent.batchNo}/versions`)}
                  className="flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100"
                >
                  <History className="h-4 w-4" />
                  查看版本历史
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {reports.slice(0, 3).map((report, index) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{report.fileName}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            index === 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {report.version}
                            {index === 0 && ' (最新)'}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatDateTime(report.uploadedAt)} · 上传人：{report.uploadedBy} · {formatFileSize(report.fileSize)}
                        </p>
                        {report.remark && (
                          <p className="mt-1 text-xs text-gray-400">备注：{report.remark}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="下载报告"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className={`rounded-lg p-2 transition-colors ${
                          deleteConfirm === report.id
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                        }`}
                        title="删除报告"
                      >
                        {deleteConfirm === report.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                {reports.length > 3 && (
                  <div className="px-6 py-3 text-center text-sm text-gray-500">
                    还有 {reports.length - 3} 个历史版本，点击"查看版本历史"查看全部
                  </div>
                )}
              </div>
            </div>
          ))}

          {groupedReports.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-600">暂无质检报告</h3>
              <p className="mt-2 text-sm text-gray-400">点击上方"上传报告"按钮添加质检报告</p>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl animate-fade-in overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">上传质检报告</h3>
              <button
                onClick={handleCloseUpload}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    选择试剂批次 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {reagents.map((reagent) => (
                      <option key={reagent.batchNo} value={reagent.batchNo}>
                        {reagent.name} ({reagent.batchNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    dragOver
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${selectedFile ? 'bg-green-50 border-green-300' : ''}`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-green-500" />
                      <p className="mt-2 font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="mt-3 text-sm text-red-500 hover:text-red-600"
                      >
                        重新选择
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-3 text-sm text-gray-600">
                        拖拽文件到此处，或
                        <label className="cursor-pointer font-medium text-primary-500 hover:text-primary-600">
                          点击选择文件
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        支持 PDF、Word、Excel 格式，最大 20MB
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    版本号（自动生成）
                  </label>
                  <input
                    type="text"
                    value={selectedBatch ? (() => {
                      const existing = getReports(selectedBatch);
                      if (existing.length === 0) return 'v1.0';
                      const last = existing[0].version;
                      const match = last.match(/v(\d+)\.(\d+)/);
                      if (match) return `v${match[1]}.${parseInt(match[2]) + 1}`;
                      return 'v1.0';
                    })() : ''}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    备注说明
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    rows={3}
                    placeholder="请输入本次报告的说明，如：复检报告、针对投诉重新检测等"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseUpload}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedBatch || !selectedFile || isUploading}
                  className="flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      上传中...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      上传报告
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
