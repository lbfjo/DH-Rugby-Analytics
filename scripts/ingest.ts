import { ingestExcelData } from "../src/lib/ingest";
import path from "path";

async function main() {
  const excelPath = path.join(process.cwd(), "data", "report.xlsx");
  await ingestExcelData(excelPath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });