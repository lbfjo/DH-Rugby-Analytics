"use client";

import { uploadReport } from "@/app/actions/upload";
import { useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function UploadForm() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("uploading");
    setMessage("");

    const result = await uploadReport(formData);

    if (result.success) {
      setStatus("success");
      setMessage(result.message || "Success!");
    } else {
      setStatus("error");
      setMessage(result.message || "Something went wrong.");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${status === "uploading" ? "bg-gray-100 border-gray-400 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600"}
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {status === "uploading" ? (
              <Loader2 className="w-10 h-10 mb-4 text-green-600 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="w-10 h-10 mb-4 text-green-500" />
            ) : status === "error" ? (
              <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
            ) : (
              <Upload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" />
            )}
            
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {fileName || "XLSX file only"}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            name="file"
            className="hidden"
            accept=".xlsx"
            required
            disabled={status === "uploading"}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
                setStatus("idle");
                setMessage("");
              }
            }}
          />
        </label>
      </div>

      {message && (
        <div className={`p-4 rounded-md text-sm font-medium ${
          status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "uploading" || !fileName}
        className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "uploading" ? "Ingesting Data..." : "Upload & Update Database"}
      </button>
    </form>
  );
}
