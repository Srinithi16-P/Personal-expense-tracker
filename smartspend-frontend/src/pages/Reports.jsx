import { useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { downloadReport } from "../api/report";

const now = new Date();

const Reports = () => {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [downloading, setDownloading] = useState("");

  const handleDownload = async (type) => {
    setDownloading(type);
    const token = localStorage.getItem("smartspend_token");
    try {
      await downloadReport(type, { month, year }, token);
    } finally {
      setDownloading("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-100">Reports</h2>
        <p className="text-sm text-ink-500">Download a monthly summary generated live from your data.</p>
      </div>

      <Card className="max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Month" type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} />
          <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => handleDownload("pdf")} disabled={downloading === "pdf"} className="flex-1">
            <FileDown size={16} /> {downloading === "pdf" ? "Preparing..." : "Download PDF"}
          </Button>
          <Button variant="secondary" onClick={() => handleDownload("excel")} disabled={downloading === "excel"} className="flex-1">
            <FileSpreadsheet size={16} /> {downloading === "excel" ? "Preparing..." : "Download Excel"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
