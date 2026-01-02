import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UploadForm } from "./UploadForm";

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload the latest Excel report (.xlsx) to update the database. 
              This process will replace all existing match data.
            </p>
            
            <UploadForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
