import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, History, FlaskConical, AlertCircle, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ReagentCard } from '../components/ReagentCard';
import { OpeningRecordList } from '../components/OpeningRecordList';
import { ComplaintWarning } from '../components/ComplaintWarning';
import { OpeningRecord, Complaint } from '../types';

export const QueryPage = () => {
  const navigate = useNavigate();
  const { user, logout, searchReagent, fetchReagents, getOpeningRecords, getComplaintsByBatch, hasActiveComplaint, searchHistory } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedBatch, setSearchedBatch] = useState<string | null>(null);
  const [reagent, setReagent] = useState<ReturnType<typeof searchReagent>>(undefined);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [openingRecords, setOpeningRecords] = useState<OpeningRecord[]>([]);
  const [batchComplaints, setBatchComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = async (batchNo?: string) => {
    const query = batchNo || searchInput.trim();
    if (!query) return;

    setIsSearching(true);
    setNotFound(false);
    setSearchedBatch(null);

    await fetchReagents();
    const result = searchReagent(query);
    if (result) {
      setReagent(result);
      setSearchedBatch(query);
      const records = await getOpeningRecords(query);
      setOpeningRecords(records);
      const complaints = await getComplaintsByBatch(query);
      setBatchComplaints(complaints);
    } else {
      setReagent(undefined);
      setNotFound(true);
    }
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const activeComplaints: Complaint[] = searchedBatch
    ? batchComplaints.filter(c => c.stopUsage && c.status !== 'closed')
    : [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">实验试剂批号查询系统</h1>
                <p className="text-xs text-gray-500">欢迎您，{user.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">试剂批号查询</h2>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="请输入试剂批号，如 RGT-2024-001234"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !searchInput.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {isSearching ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    查询
                  </>
                )}
              </button>
            </div>

            {searchHistory.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <History className="h-4 w-4" />
                  <span>最近查询：</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {searchHistory.slice(0, 5).map((batch) => (
                    <button
                      key={batch}
                      onClick={() => {
                        setSearchInput(batch);
                        handleSearch(batch);
                      }}
                      className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-700"
                    >
                      {batch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {notFound && (
          <div className="animate-fade-in rounded-2xl border border-orange-200 bg-orange-50 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-orange-500" />
            <h3 className="mt-3 text-lg font-semibold text-orange-800">未找到该批次试剂</h3>
            <p className="mt-1 text-orange-600">请检查批号是否正确</p>
          </div>
        )}

        {searchedBatch && activeComplaints.length > 0 && (
          <div className="animate-fade-in">
            {activeComplaints.map((complaint) => (
              <ComplaintWarning
                key={complaint.id}
                batchNo={complaint.batchNo}
                reason={complaint.reason}
                reporter={complaint.reporter}
              />
            ))}
          </div>
        )}

        {reagent && (
          <div className="space-y-6 animate-fade-in">
            <ReagentCard reagent={reagent} />
            <OpeningRecordList records={openingRecords} />

            {hasActiveComplaint(searchedBatch!) && (
              <div className="animate-slide-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-warning-500" />
                  <h3 className="text-lg font-semibold text-gray-900">投诉记录</h3>
                </div>
                <div className="space-y-3">
                  {batchComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className={`rounded-xl p-4 ${
                        complaint.stopUsage && complaint.status !== 'closed'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{complaint.reason}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            投诉人：{complaint.reporter} · {new Date(complaint.reportedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!searchedBatch && !notFound && (
          <div className="animate-fade-in rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <FlaskConical className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-600">请输入试剂批号进行查询</h3>
            <p className="mt-2 text-sm text-gray-400">
              系统将展示试剂的纯度、到期日、储存条件、开封记录等信息
            </p>
            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">可测试的批号：</span><br />
                RGT-2024-001234（氯化钠，正常）<br />
                RGT-2024-005678（无水乙醇，正常）<br />
                RGT-2024-009999（盐酸，有投诉，需停用！）
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
