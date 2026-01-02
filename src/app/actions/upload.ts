"use server";

import { ingestExcelData } from "@/lib/ingest";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import os from "os";

export async function uploadReport(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  if (!file.name.endsWith(".xlsx")) {
    return { success: false, message: "Invalid file type. Please upload an Excel (.xlsx) file." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.xlsx`);

    fs.writeFileSync(tempFilePath, buffer);

    console.log(`File saved to ${tempFilePath}, starting ingestion...`);
    const result = await ingestExcelData(tempFilePath);
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    revalidatePath("/dashboard");
    revalidatePath("/matches");
    revalidatePath("/teams");

    return { 
      success: true, 
      message: `Ingestion complete! Processed ${result.matchCount} matches.` 
    };

  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Failed to process file: " + (error as Error).message };
  }
}
