import React from "react";

const Dashboard = () => {
  return (
    <div className="h-full">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's your overview
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stat Cards Placeholder */}
          {[
            { title: "Total Revenue", value: "$45,231.89", change: "+20.1%" },
            { title: "Orders", value: "2,350", change: "+15.2%" },
            { title: "Products", value: "189", change: "+7%" },
            { title: "Customers", value: "1,234", change: "+12.5%" },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional content area */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your recent orders and activity will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;