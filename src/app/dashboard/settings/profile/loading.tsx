import React from "react";

export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Profile Card Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      {/* Security Card Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg" />
              <div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg" />
              <div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Other sections skeletons */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 h-24" />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 h-24" />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 h-24" />
    </div>
  );
}
