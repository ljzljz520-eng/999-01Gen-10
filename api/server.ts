import express from 'express';
import cors from 'cors';
import multer from 'multer';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DB_PATH = path.join(__dirname, 'reagent.db');

let db: SqlJsDatabase;

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function rowToCamel(row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = row[key];
  }
  return result;
}

function allRows(stmt: ReturnType<SqlJsDatabase['prepare']>): any[] {
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS reagents (
      batch_no TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      purity TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      storage_condition TEXT NOT NULL,
      safety_instruction TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS opening_records (
      id TEXT PRIMARY KEY,
      batch_no TEXT NOT NULL,
      opened_at TEXT NOT NULL,
      operator TEXT NOT NULL,
      status TEXT NOT NULL,
      remark TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      batch_no TEXT NOT NULL,
      reported_at TEXT NOT NULL,
      reporter TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL,
      stop_usage INTEGER NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS quality_reports (
      id TEXT PRIMARY KEY,
      batch_no TEXT NOT NULL,
      version TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      file_data TEXT,
      remark TEXT
    )
  `);

  const userCheck = db.exec('SELECT COUNT(*) as cnt FROM users');
  const count = userCheck.length > 0 ? (userCheck[0].values[0][0] as number) : 0;

  if (count === 0) {
    db.run("INSERT INTO users VALUES ('exp1', '123456', 'experimenter', '王实验员')");
    db.run("INSERT INTO users VALUES ('exp2', '123456', 'experimenter', '李研究员')");
    db.run("INSERT INTO users VALUES ('admin', '123456', 'admin', '系统管理员')");

    db.run("INSERT INTO reagents VALUES ('RGT-2024-001234', '氯化钠分析纯', '99.5%', '2026-12-31', '室温干燥处，密封保存，温度10-30℃', '避免接触眼睛和皮肤，操作时佩戴防护手套和护目镜。如不慎接触，立即用大量清水冲洗。', '国药集团化学试剂有限公司', '2024-01-15T10:30:00Z')");
    db.run("INSERT INTO reagents VALUES ('RGT-2024-005678', '无水乙醇', '99.7%', '2025-06-30', '阴凉通风处，远离火源，温度不超过25℃', '易燃液体，使用时注意通风，禁止明火。佩戴防毒口罩，避免吸入蒸气。', '上海化学试剂厂', '2024-03-20T14:20:00Z')");
    db.run("INSERT INTO reagents VALUES ('RGT-2024-009999', '盐酸（36%-38%）', 'AR级', '2027-03-15', '密封，存于通风橱内，避免与碱类接触', '强腐蚀性，操作时佩戴护目镜、防酸手套和防护服。在通风橱内操作。', '北京化工厂', '2024-05-10T09:15:00Z')");
    db.run("INSERT INTO reagents VALUES ('RGT-2024-012345', '硫酸（98%）', 'GR级', '2027-08-20', '密封保存，与易燃物、还原剂分开存放', '强腐蚀性强氧化性，与水混合时必须酸入水。穿戴全套防护装备。', '国药集团化学试剂有限公司', '2024-06-01T11:00:00Z')");

    db.run("INSERT INTO opening_records VALUES ('OPN-001', 'RGT-2024-001234', '2024-10-20T09:00:00Z', '王实验员', 'opened', '用于离子色谱分析实验')");
    db.run("INSERT INTO opening_records VALUES ('OPN-002', 'RGT-2024-005678', '2024-11-01T14:30:00Z', '李研究员', 'sealed', '样品前处理用，开封后重新密封')");
    db.run("INSERT INTO opening_records VALUES ('OPN-003', 'RGT-2024-005678', '2024-11-10T10:15:00Z', '王实验员', 'opened', '用于有机合成反应')");

    db.run("INSERT INTO complaints VALUES ('CMP-001', 'RGT-2024-009999', '2024-11-05T11:00:00Z', '李研究员', '试剂浓度不符合标准，滴定实验结果异常，偏差超过15%', 'pending', 1)");
    db.run("INSERT INTO complaints VALUES ('CMP-002', 'RGT-2024-001234', '2024-10-15T09:30:00Z', '张实验员', '试剂包装有破损，可能受潮', 'resolved', 0)");

    db.run("INSERT INTO quality_reports VALUES ('RPT-001', 'RGT-2024-001234', 'v1.0', '2024-01-16T08:30:00Z', '系统管理员', '氯化钠质检报告_v1.0.pdf', 1024000, 'application/pdf', NULL, '出厂质检报告，各项指标合格')");
    db.run("INSERT INTO quality_reports VALUES ('RPT-002', 'RGT-2024-001234', 'v1.1', '2024-03-15T10:00:00Z', '系统管理员', '氯化钠复检报告_v1.1.pdf', 1150000, 'application/pdf', NULL, '复检报告，纯度重新验证为99.6%')");
    db.run("INSERT INTO quality_reports VALUES ('RPT-003', 'RGT-2024-005678', 'v1.0', '2024-03-21T09:00:00Z', '系统管理员', '无水乙醇质检报告_v1.0.pdf', 980000, 'application/pdf', NULL, '出厂质检报告')");
    db.run("INSERT INTO quality_reports VALUES ('RPT-004', 'RGT-2024-009999', 'v1.0', '2024-05-11T08:30:00Z', '系统管理员', '盐酸质检报告_v1.0.pdf', 1200000, 'application/pdf', NULL, '出厂质检报告')");
    db.run("INSERT INTO quality_reports VALUES ('RPT-005', 'RGT-2024-009999', 'v2.0', '2024-11-06T14:00:00Z', '系统管理员', '盐酸复检报告_v2.0.pdf', 1350000, 'application/pdf', NULL, '重大更新：针对投诉重新检测，浓度不达标，建议停用')");

    saveDb();
  }
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const stmt = db.prepare('SELECT username, role, name FROM users WHERE username = ? AND password = ?');
  stmt.bind([username, password]);
  if (stmt.step()) {
    const user = rowToCamel(stmt.getAsObject());
    stmt.free();
    res.json({ success: true, user });
  } else {
    stmt.free();
    res.json({ success: false, error: '用户名或密码错误' });
  }
});

app.get('/api/reagents', (_req, res) => {
  const stmt = db.prepare('SELECT * FROM reagents ORDER BY created_at DESC');
  const rows = allRows(stmt).map(rowToCamel);
  res.json(rows);
});

app.post('/api/reagents', (req, res) => {
  const r = req.body;
  try {
    db.run('INSERT INTO reagents VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [r.batchNo, r.name, r.purity, r.expiryDate, r.storageCondition, r.safetyInstruction, r.manufacturer, r.createdAt || new Date().toISOString()]);
    saveDb();
    res.json({ success: true });
  } catch (e: any) {
    res.json({ success: false, error: e.message });
  }
});

app.put('/api/reagents/:batchNo', (req, res) => {
  const r = req.body;
  db.run('UPDATE reagents SET name=?, purity=?, expiry_date=?, storage_condition=?, safety_instruction=?, manufacturer=? WHERE batch_no=?', [r.name, r.purity, r.expiryDate, r.storageCondition, r.safetyInstruction, r.manufacturer, req.params.batchNo]);
  saveDb();
  res.json({ success: true });
});

app.delete('/api/reagents/:batchNo', (req, res) => {
  db.run('DELETE FROM reagents WHERE batch_no = ?', [req.params.batchNo]);
  saveDb();
  res.json({ success: true });
});

app.get('/api/opening-records/:batchNo', (req, res) => {
  const stmt = db.prepare('SELECT * FROM opening_records WHERE batch_no = ? ORDER BY opened_at DESC');
  stmt.bind([req.params.batchNo]);
  const rows = allRows(stmt).map(rowToCamel);
  res.json(rows);
});

app.get('/api/complaints', (_req, res) => {
  const stmt = db.prepare('SELECT * FROM complaints ORDER BY reported_at DESC');
  const rows = allRows(stmt).map(r => { const c = rowToCamel(r); c.stopUsage = !!c.stopUsage; return c; });
  res.json(rows);
});

app.get('/api/complaints/:batchNo', (req, res) => {
  const stmt = db.prepare('SELECT * FROM complaints WHERE batch_no = ? ORDER BY reported_at DESC');
  stmt.bind([req.params.batchNo]);
  const rows = allRows(stmt).map(r => { const c = rowToCamel(r); c.stopUsage = !!c.stopUsage; return c; });
  res.json(rows);
});

app.post('/api/complaints', (req, res) => {
  const c = req.body;
  const id = `CMP-${Date.now().toString(36).toUpperCase()}`;
  db.run('INSERT INTO complaints VALUES (?, ?, ?, ?, ?, ?, ?)', [id, c.batchNo, c.reportedAt, c.reporter, c.reason, c.status || 'pending', c.stopUsage ? 1 : 0]);
  saveDb();
  res.json({ success: true, id });
});

app.put('/api/complaints/:id/status', (req, res) => {
  const { status, stopUsage } = req.body;
  db.run('UPDATE complaints SET status = ?, stop_usage = ? WHERE id = ?', [status, stopUsage ? 1 : 0, req.params.id]);
  saveDb();
  res.json({ success: true });
});

app.get('/api/reports/:batchNo', (req, res) => {
  const stmt = db.prepare('SELECT id, batch_no, version, uploaded_at, uploaded_by, file_name, file_size, file_type, remark FROM quality_reports WHERE batch_no = ? ORDER BY version DESC');
  stmt.bind([req.params.batchNo]);
  const rows = allRows(stmt).map(rowToCamel);
  res.json(rows);
});

app.post('/api/reports/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const { batchNo, remark, uploadedBy } = req.body;
  if (!file || !batchNo) {
    res.json({ success: false, error: '缺少文件或批号' });
    return;
  }

  const stmt = db.prepare('SELECT version FROM quality_reports WHERE batch_no = ? ORDER BY version DESC');
  stmt.bind([batchNo]);
  const existing = allRows(stmt);
  let nextVersion = 'v1.0';
  if (existing.length > 0) {
    const match = (existing[0].version as string).match(/v(\d+)\.(\d+)/);
    if (match) {
      nextVersion = `v${match[1]}.${parseInt(match[2]) + 1}`;
    }
  }

  const id = `RPT-${Date.now().toString(36).toUpperCase()}`;
  const fileData = file.buffer.toString('base64');
  const now = new Date().toISOString();
  const uploader = uploadedBy || '未知用户';

  db.run('INSERT INTO quality_reports VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    id, batchNo, nextVersion, now, uploader, file.originalname, file.size, file.mimetype, fileData, remark || null
  ]);
  saveDb();

  res.json({
    success: true,
    report: {
      id, batchNo, version: nextVersion, uploadedAt: now, uploadedBy: uploader,
      fileName: file.originalname, fileSize: file.size, fileType: file.mimetype, remark: remark || null,
    },
  });
});

app.get('/api/reports/download/:id', (req, res) => {
  const stmt = db.prepare('SELECT file_name, file_type, file_data FROM quality_reports WHERE id = ?');
  stmt.bind([req.params.id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as { file_name: string; file_type: string; file_data: string | null };
    stmt.free();
    if (!row.file_data) {
      res.status(404).json({ error: '文件数据不存在' });
      return;
    }
    const buffer = Buffer.from(row.file_data, 'base64');
    res.setHeader('Content-Type', row.file_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(row.file_name)}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } else {
    stmt.free();
    res.status(404).json({ error: '报告不存在' });
  }
});

app.delete('/api/reports/:id', (req, res) => {
  db.run('DELETE FROM quality_reports WHERE id = ?', [req.params.id]);
  saveDb();
  res.json({ success: true });
});

app.get('/api/next-version/:batchNo', (req, res) => {
  const stmt = db.prepare('SELECT version FROM quality_reports WHERE batch_no = ? ORDER BY version DESC');
  stmt.bind([req.params.batchNo]);
  const existing = allRows(stmt);
  let nextVersion = 'v1.0';
  if (existing.length > 0) {
    const match = (existing[0].version as string).match(/v(\d+)\.(\d+)/);
    if (match) {
      nextVersion = `v${match[1]}.${parseInt(match[2]) + 1}`;
    }
  }
  res.json({ nextVersion });
});

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
  });
}

start();

process.on('SIGINT', () => { if (db) { saveDb(); db.close(); } process.exit(0); });
process.on('SIGTERM', () => { if (db) { saveDb(); db.close(); } process.exit(0); });
