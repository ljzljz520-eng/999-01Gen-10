import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { useStore } from '../../store/useStore';
import { api } from '../../api';
import { ArrowLeft, FileText, Download, Clock, User, MessageSquare, History } from 'lucide-react';
import { formatDateTime, formatFileSize } from '../../utils/format';
import { QualityReport } from '../../types';

export const ReportVersions = () => {
  const navigate = useNavigate();
  const { batchNo } = useParams<{ batchNo: string }>();
  const { reagents, getReports } = useStore();
  const [reports, setReports] = useState<QualityReport[]>([]);

  const reagent = reagents.find(r => r.batchNo === batchNo);

  useEffect(() => {
    if (batchNo) {
      getReports(batchNo).then(setReports);
    }
  }, [batchNo]);

  if (!reagent) {
    return (
      <AdminLayout title="版本历史">
        <div className="rounded-2xl bg-white p-12 text-center">
          <p className="text-gray-500">未找到该批次试剂</p>
          <button
            onClick={() => navigate('/admin/reports')}
            className="mt-4 text-primary-500 hover:text-primary-600"
          >
            返回报告列表
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="报告版本历史">
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/reports')}
          className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回报告列表
        </button>

        <div className="animate-slide-up rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
              <History className="h-7 w-7 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{reagent.name}</h2>
              <p className="text-sm text-gray-500">
                批号：<code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{reagent.batchNo}</code>
                <span className="mx-2">·</span>
                共 {reports.length} 个版本
              </p>
            </div>
          </div>
        </div>

        {reports.length > 0 ? (
          <div className="relative pl-8">
            <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gray-200"></div>
            
            {reports.map((report, index) => (
              <div
                key={report.id}
                className="relative mb-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute -left-6 mt-6 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white ${
                  index === 0 ? 'bg-green-500' : 'bg-gray-400'
                } shadow`}></div>

                <div className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  index === 0 ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        index === 0 ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <FileText className={`h-6 w-6 ${
                          index === 0 ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{report.fileName}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            index === 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {report.version}
                            {index === 0 && ' (最新版本)'}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>上传时间：{formatDateTime(report.uploadedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>上传人：{report.uploadedBy}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>文件大小：{formatFileSize(report.fileSize)}</span>
                          </div>
                        </div>

                        {report.remark && (
                          <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3">
                            <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">版本说明</p>
                              <p className="mt-1 text-sm text-gray-700">{report.remark}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => window.open(api.getDownloadUrl(report.id), '_blank')}
                      className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
                      title="下载报告"
                    >
                      <Download className="h-4 w-4" />
                      下载
                    </button>
                  </div>

                  {index < reports.length - 1 && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                          {index + 2}
                        </div>
                        <span className="text-xs text-gray-500">上一版本：{reports[index + 1].version}</span>
                      </div>
                      <div className="h-px flex-1 bg-dotted bg-gray-300"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <History className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-600">暂无版本记录</h3>
            <p className="mt-2 text-sm text-gray-400">该批次试剂尚未上传质检报告</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
