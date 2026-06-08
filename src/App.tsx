import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import { QueryPage } from "@/pages/QueryPage";
import { NotFound } from "@/pages/NotFound";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { ReagentManagement } from "@/pages/admin/ReagentManagement";
import { ReportManagement } from "@/pages/admin/ReportManagement";
import { ReportVersions } from "@/pages/admin/ReportVersions";
import { ComplaintManagement } from "@/pages/admin/ComplaintManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/query" element={<QueryPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reagents" element={<ReagentManagement />} />
        <Route path="/admin/reports" element={<ReportManagement />} />
        <Route path="/admin/reports/:batchNo/versions" element={<ReportVersions />} />
        <Route path="/admin/complaints" element={<ComplaintManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
