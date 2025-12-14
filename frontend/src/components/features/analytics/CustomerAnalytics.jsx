import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/DatePicker";
import { useGetCustomerSalesAnalytics } from "@/components/react-queries/analyticsQueries";
import { useGetCustomers } from "@/components/react-queries/userQueries";
import Loader from "@/components/Loader";
import { format } from "date-fns";

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarter", label: "Quarter" },
  { value: "yearly", label: "Yearly" },
];

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const CustomerAnalytics = () => {
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return {
      from: oneMonthAgo,
      to: today,
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    frequency: "monthly",
    customerId: "",
  });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setFilters((prev) => ({
        ...prev,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      }));
    }
  }, [dateRange]);

  const { data: analyticsData, isLoading } = useGetCustomerSalesAnalytics(filters);
  const { data: customersData } = useGetCustomers();

  // Helper to format the period object into a readable string
  const formatPeriodLabel = (period, frequency) => {
    if (!period) return "Unknown";
    const { year, month, day, week, quarter, half } = period;

    switch (frequency) {
      case "daily":
        return `${day}/${month}/${year}`;
      case "weekly":
        return `W${week} ${year}`;
      case "monthly":
        return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
      case "quarter":
        return `Q${quarter} ${year}`;
      case "half_yearly":
        return `H${half} ${year}`;
      case "yearly":
        return `${year}`;
      default:
        return `${month}/${year}`;
    }
  };

  // Process data for different charts
  const { timeSeriesData, customerData, topCustomers } = useMemo(() => {
    if (!analyticsData?.data) return { timeSeriesData: [], customerData: [], topCustomers: [] };

    const rawData = analyticsData.data;

    // 1. Time Series Data (Aggregate all customers by period)
    const timeMap = new Map();
    rawData.forEach(item => {
      const label = formatPeriodLabel(item.period, filters.frequency);
      if (!timeMap.has(label)) {
        timeMap.set(label, { name: label, totalAmount: 0, orderCount: 0, rawPeriod: item.period });
      }
      const entry = timeMap.get(label);
      entry.totalAmount += (item.totalAmount || 0);
      entry.orderCount += (item.orderCount || 0);
    });
    // Sort logic could be improved by using rawPeriod, but map iteration order is usually insertion order
    const timeSeriesData = Array.from(timeMap.values());

    // 2. Customer Data (Aggregate all periods by customer)
    const custMap = new Map();
    rawData.forEach(item => {
      const name = item.customerName || "Unknown";
      if (!custMap.has(name)) {
        custMap.set(name, { name: name, totalAmount: 0, orderCount: 0 });
      }
      const entry = custMap.get(name);
      entry.totalAmount += (item.totalAmount || 0);
      entry.orderCount += (item.orderCount || 0);
    });
    const customerData = Array.from(custMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
    const topCustomers = customerData.slice(0, 5); // Top 5 for charts

    return { timeSeriesData, customerData, topCustomers };
  }, [analyticsData, filters.frequency]);

  const totalStats = useMemo(() => {
    return customerData.reduce(
      (acc, item) => ({
        revenue: acc.revenue + item.totalAmount,
        orders: acc.orders + item.orderCount,
      }),
      { revenue: 0, orders: 0 }
    );
  }, [customerData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const customers = customersData?.data?.customers || customersData?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {entry.name === "Revenue" || entry.name === "Total Amount"
                  ? `₹${Number(entry.value).toFixed(2)}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!analyticsData?.data || analyticsData.data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {/* Render Controls even if empty */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card ">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <DateRangePicker dateRange={dateRange} onSelect={setDateRange} className="flex-1 sm:flex-none" />
            <Select
              value={filters.frequency}
              onValueChange={(value) => handleFilterChange("frequency", value)}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.customerId || "all"}
              onValueChange={(value) =>
                handleFilterChange("customerId", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center text-muted-foreground border rounded-xl border-dashed">
          No data available for the selected range.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DateRangePicker dateRange={dateRange} onSelect={setDateRange} className="flex-1 sm:flex-none" />
          <Select
            value={filters.frequency}
            onValueChange={(value) => handleFilterChange("frequency", value)}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.customerId || "all"}
            onValueChange={(value) =>
              handleFilterChange("customerId", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer._id} value={customer._id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-1">
              ₹{totalStats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {customerData.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalStats.orders.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line Graph: Revenue Trends */}
        <Card className="col-span-1 lg:col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Revenue over time across all selected customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" className="opacity-50" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="totalAmount"
                    name="Revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4, stroke: "var(--color-background)" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Top Customers */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Top Customers by Revenue</CardTitle>
            <CardDescription>Highest revenue generating customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCustomers} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" className="opacity-50" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="totalAmount"
                    name="Revenue"
                    fill="var(--color-chart-1)"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart: Customer Share */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Share</CardTitle>
            <CardDescription>Revenue contribution by top customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCustomers}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="totalAmount"
                    nameKey="name"
                    stroke="none"
                  >
                    {topCustomers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CustomerAnalytics;
