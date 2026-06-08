import { Reagent, Complaint, OpeningRecord, QualityReport, User } from '../types';

export const mockUsers: User[] = [
  { username: 'exp1', role: 'experimenter', name: '王实验员' },
  { username: 'exp2', role: 'experimenter', name: '李研究员' },
  { username: 'admin', role: 'admin', name: '系统管理员' },
];

export const mockReagents: Reagent[] = [
  {
    batchNo: 'RGT-2024-001234',
    name: '氯化钠分析纯',
    purity: '99.5%',
    expiryDate: '2026-12-31',
    storageCondition: '室温干燥处，密封保存，温度10-30℃',
    safetyInstruction: '避免接触眼睛和皮肤，操作时佩戴防护手套和护目镜。如不慎接触，立即用大量清水冲洗。',
    manufacturer: '国药集团化学试剂有限公司',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    batchNo: 'RGT-2024-005678',
    name: '无水乙醇',
    purity: '99.7%',
    expiryDate: '2025-06-30',
    storageCondition: '阴凉通风处，远离火源，温度不超过25℃',
    safetyInstruction: '易燃液体，使用时注意通风，禁止明火。佩戴防毒口罩，避免吸入蒸气。',
    manufacturer: '上海化学试剂厂',
    createdAt: '2024-03-20T14:20:00Z',
  },
  {
    batchNo: 'RGT-2024-009999',
    name: '盐酸（36%-38%）',
    purity: 'AR级',
    expiryDate: '2027-03-15',
    storageCondition: '密封，存于通风橱内，避免与碱类接触',
    safetyInstruction: '强腐蚀性，操作时佩戴护目镜、防酸手套和防护服。在通风橱内操作。',
    manufacturer: '北京化工厂',
    createdAt: '2024-05-10T09:15:00Z',
  },
  {
    batchNo: 'RGT-2024-012345',
    name: '硫酸（98%）',
    purity: 'GR级',
    expiryDate: '2027-08-20',
    storageCondition: '密封保存，与易燃物、还原剂分开存放',
    safetyInstruction: '强腐蚀性强氧化性，与水混合时必须酸入水。穿戴全套防护装备。',
    manufacturer: '国药集团化学试剂有限公司',
    createdAt: '2024-06-01T11:00:00Z',
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-001',
    batchNo: 'RGT-2024-009999',
    reportedAt: '2024-11-05T11:00:00Z',
    reporter: '李研究员',
    reason: '试剂浓度不符合标准，滴定实验结果异常，偏差超过15%',
    status: 'pending',
    stopUsage: true,
  },
  {
    id: 'CMP-002',
    batchNo: 'RGT-2024-001234',
    reportedAt: '2024-10-15T09:30:00Z',
    reporter: '张实验员',
    reason: '试剂包装有破损，可能受潮',
    status: 'resolved',
    stopUsage: false,
  },
];

export const mockOpeningRecords: OpeningRecord[] = [
  {
    id: 'OPN-001',
    batchNo: 'RGT-2024-001234',
    openedAt: '2024-10-20T09:00:00Z',
    operator: '王实验员',
    status: 'opened',
    remark: '用于离子色谱分析实验',
  },
  {
    id: 'OPN-002',
    batchNo: 'RGT-2024-005678',
    openedAt: '2024-11-01T14:30:00Z',
    operator: '李研究员',
    status: 'sealed',
    remark: '样品前处理用，开封后重新密封',
  },
  {
    id: 'OPN-003',
    batchNo: 'RGT-2024-005678',
    openedAt: '2024-11-10T10:15:00Z',
    operator: '王实验员',
    status: 'opened',
    remark: '用于有机合成反应',
  },
];

export const mockQualityReports: QualityReport[] = [
  {
    id: 'RPT-001',
    batchNo: 'RGT-2024-001234',
    version: 'v1.0',
    uploadedAt: '2024-01-16T08:30:00Z',
    uploadedBy: '系统管理员',
    fileName: '氯化钠质检报告_v1.0.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    remark: '出厂质检报告，各项指标合格',
  },
  {
    id: 'RPT-002',
    batchNo: 'RGT-2024-001234',
    version: 'v1.1',
    uploadedAt: '2024-03-15T10:00:00Z',
    uploadedBy: '系统管理员',
    fileName: '氯化钠复检报告_v1.1.pdf',
    fileSize: 1150000,
    fileType: 'application/pdf',
    remark: '复检报告，纯度重新验证为99.6%',
  },
  {
    id: 'RPT-003',
    batchNo: 'RGT-2024-005678',
    version: 'v1.0',
    uploadedAt: '2024-03-21T09:00:00Z',
    uploadedBy: '系统管理员',
    fileName: '无水乙醇质检报告_v1.0.pdf',
    fileSize: 980000,
    fileType: 'application/pdf',
    remark: '出厂质检报告',
  },
  {
    id: 'RPT-004',
    batchNo: 'RGT-2024-009999',
    version: 'v1.0',
    uploadedAt: '2024-05-11T08:30:00Z',
    uploadedBy: '系统管理员',
    fileName: '盐酸质检报告_v1.0.pdf',
    fileSize: 1200000,
    fileType: 'application/pdf',
    remark: '出厂质检报告',
  },
  {
    id: 'RPT-005',
    batchNo: 'RGT-2024-009999',
    version: 'v2.0',
    uploadedAt: '2024-11-06T14:00:00Z',
    uploadedBy: '系统管理员',
    fileName: '盐酸复检报告_v2.0.pdf',
    fileSize: 1350000,
    fileType: 'application/pdf',
    remark: '重大更新：针对投诉重新检测，浓度不达标，建议停用',
  },
];

export const validateLogin = (username: string, password: string): User | null => {
  const user = mockUsers.find(u => u.username === username);
  if (user && password === '123456') {
    return user;
  }
  return null;
};
