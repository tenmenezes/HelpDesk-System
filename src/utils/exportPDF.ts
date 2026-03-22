import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTableToPDF<T extends Record<string, any>>(
  data: T[],
  columns: { key: string; label: string }[],
  title: string
) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Preparando dados para a tabela
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      if (value === null || value === undefined) return "";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    })
  );

  const headers = columns.map((col) => col.label);

  // Adicionando tabela
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Salvando
  doc.save(
    `${title.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
}
