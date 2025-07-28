"use client";

import DocumentList from "@/components/dashboard/DocumentList";
import UploadView from "@/components/dashboard/UploadView";

export default function SignDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Start a new signature</h2>
        <UploadView />
      </div>

      <DocumentList />
    </div>
  );
}
