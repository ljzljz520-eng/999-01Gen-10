export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getExpiryStatus = (expiryDate: string): { text: string; color: string } => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { text: '已过期', color: 'text-warning-500' };
  if (days <= 30) return { text: `即将过期 (${days}天后)`, color: 'text-yellow-600' };
  return { text: `有效期内 (${days}天后过期)`, color: 'text-success-500' };
};

export const getComplaintStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待处理',
    resolved: '已解决',
    closed: '已关闭',
  };
  return map[status] || status;
};

export const getComplaintStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};
