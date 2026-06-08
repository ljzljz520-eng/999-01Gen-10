import { FlaskConical, Calendar, ThermometerSnowflake, Shield, Factory, Info } from 'lucide-react';
import { Reagent } from '../types';
import { formatDate, getExpiryStatus } from '../utils/format';

interface ReagentCardProps {
  reagent: Reagent;
}

export const ReagentCard = ({ reagent }: ReagentCardProps) => {
  const expiryStatus = getExpiryStatus(reagent.expiryDate);

  return (
    <div className="animate-slide-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-bold text-gray-900">{reagent.name}</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">批号：{reagent.batchNo}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          expiryStatus.color.includes('warning') ? 'bg-red-100 text-red-700' :
          expiryStatus.color.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {expiryStatus.text}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">纯度</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{reagent.purity}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">到期日</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(reagent.expiryDate)}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <ThermometerSnowflake className="h-4 w-4" />
            <span className="text-sm font-medium">储存条件</span>
          </div>
          <p className="mt-1 text-sm text-gray-900">{reagent.storageCondition}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Factory className="h-4 w-4" />
            <span className="text-sm font-medium">生产商</span>
          </div>
          <p className="mt-1 text-sm text-gray-900">{reagent.manufacturer}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-center gap-2 text-primary-700">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">安全说明</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{reagent.safetyInstruction}</p>
      </div>
    </div>
  );
};
