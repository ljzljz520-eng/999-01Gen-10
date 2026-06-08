import { AlertTriangle, XCircle } from 'lucide-react';

interface ComplaintWarningProps {
  batchNo: string;
  reason: string;
  reporter: string;
}

export const ComplaintWarning = ({ batchNo, reason, reporter }: ComplaintWarningProps) => {
  return (
    <div className="animate-breathe mb-6 rounded-lg border border-warning-300 bg-gradient-to-r from-warning-500 to-warning-600 p-5 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            <h3 className="text-lg font-bold">警告：该批次已被投诉，停止使用！</h3>
          </div>
          <p className="mt-1 text-sm text-white/90">
            批号：<span className="font-semibold">{batchNo}</span>
          </p>
          <div className="mt-3 rounded-md bg-white/10 p-3">
            <p className="text-sm">
              <span className="font-semibold">投诉原因：</span>{reason}
            </p>
            <p className="mt-1 text-sm">
              <span className="font-semibold">投诉人：</span>{reporter}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-warning-600">
              <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-warning-500"></span>
              请立即停止使用该批次试剂
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
