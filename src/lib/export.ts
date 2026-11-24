export type ExportRow = Record<string, string | number | null | undefined>;

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function exportCSV(rows: ExportRow[], name: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${name}.csv`);
}

export async function exportXLSX(rows: ExportRow[], name: string) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${name}.xlsx`);
}

export async function exportPDF(rows: ExportRow[], name: string, title: string, company = "Tech Hub Management System", subtitle?: string) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFillColor(22, 33, 72);
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(232, 186, 80);
  doc.setFontSize(14);
  doc.text("THMS", 10, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(company, 30, 14);
  doc.setTextColor(20, 20, 40);
  doc.setFontSize(16);
  doc.text(title, 10, 34);
  doc.setFontSize(9);
  doc.text(subtitle ?? `Generated ${new Date().toLocaleString()}`, 10, 40);
  const headers = rows.length ? Object.keys(rows[0]!) : ["No records"];
  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: rows.map((r) => headers.map((h) => String(r[h] ?? ""))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 33, 72], textColor: [255, 255, 255] },
  });
  doc.save(`${name}.pdf`);
}
