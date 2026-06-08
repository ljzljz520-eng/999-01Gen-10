import { Clock, User, FileText, PackageOpen, Package } from 'lucide-react';
import { OpeningRecord } from '../types';
import { formatDateTime } from '../utils/format';

interface OpeningRecordListProps {
  records: OpeningRecord[];
}

export const OpeningRecordList = ({ records }: OpeningRecordListProps) => {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-3 text-gray-500">暂无开封记录</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <PackageOpen className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900">开封记录</h3>
          <span className="ml-auto rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
            共 {records.length} 条
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {records.map((record, index) => (
          <div
            key={record.id}
            className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
              <Clock className="h-5 w-5 text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                    record.status === 'opened'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      record.status === 'opened' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                    {record.status === 'opened' ? '已开封' : '已重新密封'}
                  </span>
                </div>
                <span className="flex-shrink-0 text-sm text-gray-500">
                  {formatDateTime(record.openedAt)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>操作人：{record.operator}</span>
              </div>
              {record.remark && (
                <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                  <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-2">{record.remark}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
