import React from 'react';
import PageLayout from "@/layouts/PageLayout";

const Settings = () => {
  return (
    <PageLayout
      heading="Settings"
      description="Manage your application settings"
    >
      {/* Content */}
      <div className="flex-1 w-full h-full">
        <div>Settings</div>
      </div>
    </PageLayout>
  );
};

export default Settings