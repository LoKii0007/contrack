import React from "react";

const PageLayout = ({ heading, description, children, className }) => {
  return (
    <div className="h-full min-h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className=" shrink-0 ">
        <div className="flex h-16 items-center px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {heading}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 p-6 bg-white rounded-tl-[20px] border-l border-t border-border ${className}`}>{children}</div>
    </div>
  );
};

export default PageLayout;
