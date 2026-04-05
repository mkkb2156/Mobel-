"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type JobType = "full" | "incremental" | "price_check" | "availability";
type JobStatus = "running" | "completed" | "failed";
type SortField = "type" | "startedAt" | "status" | "found" | "added" | "updated" | "delisted" | "errors";
type SortDir = "asc" | "desc";

interface ScraperLog {
  id: string;
  type: JobType;
  startedAt: string;
  status: JobStatus;
  found: number;
  added: number;
  updated: number;
  delisted: number;
  errors: number;
}

const typeLabels: Record<JobType, string> = {
  full: "全站爬取",
  incremental: "增量爬取",
  price_check: "價格檢查",
  availability: "可用性檢查",
};

const statusConfig: Record<JobStatus, { label: string; variant: "info" | "success" | "error" }> = {
  running: { label: "執行中", variant: "info" },
  completed: { label: "已完成", variant: "success" },
  failed: { label: "失敗", variant: "error" },
};

const mockLogs: ScraperLog[] = [
  { id: "1", type: "full", startedAt: "2026-04-05 10:00", status: "running", found: 342, added: 47, updated: 128, delisted: 0, errors: 0 },
  { id: "2", type: "incremental", startedAt: "2026-04-05 08:00", status: "completed", found: 89, added: 12, updated: 34, delisted: 3, errors: 0 },
  { id: "3", type: "price_check", startedAt: "2026-04-05 06:00", status: "completed", found: 892, added: 0, updated: 67, delisted: 0, errors: 2 },
  { id: "4", type: "availability", startedAt: "2026-04-04 22:00", status: "completed", found: 1247, added: 0, updated: 0, delisted: 5, errors: 0 },
  { id: "5", type: "full", startedAt: "2026-04-04 10:00", status: "completed", found: 1523, added: 38, updated: 412, delisted: 7, errors: 3 },
  { id: "6", type: "incremental", startedAt: "2026-04-04 08:00", status: "failed", found: 45, added: 2, updated: 0, delisted: 0, errors: 12 },
  { id: "7", type: "price_check", startedAt: "2026-04-03 18:00", status: "completed", found: 876, added: 0, updated: 54, delisted: 0, errors: 1 },
  { id: "8", type: "full", startedAt: "2026-04-03 10:00", status: "completed", found: 1498, added: 52, updated: 389, delisted: 11, errors: 4 },
  { id: "9", type: "availability", startedAt: "2026-04-02 22:00", status: "completed", found: 1210, added: 0, updated: 0, delisted: 8, errors: 0 },
  { id: "10", type: "incremental", startedAt: "2026-04-02 14:00", status: "completed", found: 112, added: 19, updated: 45, delisted: 2, errors: 0 },
];

const categories = [
  { name: "座椅 Seating", count: 387, lastScraped: "2026-04-05 10:12" },
  { name: "桌几 Tables", count: 245, lastScraped: "2026-04-05 10:08" },
  { name: "收納 Storage", count: 198, lastScraped: "2026-04-05 09:55" },
  { name: "燈具 Lighting", count: 213, lastScraped: "2026-04-05 09:47" },
  { name: "裝飾 Decor", count: 134, lastScraped: "2026-04-05 09:40" },
  { name: "戶外 Outdoor", count: 70, lastScraped: "2026-04-05 09:35" },
];

const liveStats = [
  { label: "總商品數", value: "1,247" },
  { label: "今日新增", value: "59" },
  { label: "今日更新", value: "229" },
  { label: "今日下架", value: "8" },
  { label: "爬取成功率", value: "96.8%" },
];

export default function AdminScraperPage() {
  const [sortField, setSortField] = useState<SortField>("startedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedLogs = [...mockLogs].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string" && typeof valB === "string") return valA.localeCompare(valB) * dir;
    if (typeof valA === "number" && typeof valB === "number") return (valA - valB) * dir;
    return 0;
  });

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 font-medium text-walnut cursor-pointer select-none hover:text-charcoal"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-brass">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
        )}
      </span>
    </th>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">爬蟲管理</h1>
          <p className="mt-2 text-sm text-walnut/70">管理歐洲古董網站的資料爬取任務</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border border-linen bg-white p-4">
        <Button variant="primary" size="sm">執行全站爬取</Button>
        <Button variant="outline" size="sm">增量爬取</Button>
        <Button variant="danger" size="sm">停止</Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-walnut/60">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>請求速率: 42/min</span>
          <span className="text-walnut/30">|</span>
          <span>冷卻狀態: 正常</span>
        </div>
      </div>

      {/* Live Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {liveStats.map((stat) => (
          <div key={stat.label} className="border border-linen bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/60">{stat.label}</p>
            <p className="mt-1 font-serif text-xl font-bold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Scraper Log Table */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">爬蟲執行記錄</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <SortHeader field="type">執行類型</SortHeader>
                  <SortHeader field="startedAt">開始時間</SortHeader>
                  <SortHeader field="status">狀態</SortHeader>
                  <SortHeader field="found">發現商品</SortHeader>
                  <SortHeader field="added">新增</SortHeader>
                  <SortHeader field="updated">更新</SortHeader>
                  <SortHeader field="delisted">下架</SortHeader>
                  <SortHeader field="errors">錯誤數</SortHeader>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log) => {
                  const sc = statusConfig[log.status];
                  return (
                    <tr key={log.id} className="border-b border-linen/50 last:border-0 hover:bg-cream/30">
                      <td className="px-4 py-3">
                        <Badge variant="default">{typeLabels[log.type]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-walnut/80">{log.startedAt}</td>
                      <td className="px-4 py-3">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal">{log.found.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-600">{log.added > 0 ? `+${log.added}` : "0"}</td>
                      <td className="px-4 py-3 text-blue-600">{log.updated > 0 ? String(log.updated) : "0"}</td>
                      <td className="px-4 py-3 text-amber-600">{log.delisted > 0 ? `-${log.delisted}` : "0"}</td>
                      <td className="px-4 py-3">
                        <span className={log.errors > 0 ? "font-medium text-red-600" : "text-walnut/50"}>
                          {log.errors}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">分類統計</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-walnut">分類</th>
                  <th className="px-4 py-3 font-medium text-walnut">商品數量</th>
                  <th className="px-4 py-3 font-medium text-walnut">最後爬取時間</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.name} className="border-b border-linen/50 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3 font-medium text-charcoal">{cat.name}</td>
                    <td className="px-4 py-3 text-walnut/80">{cat.count}</td>
                    <td className="px-4 py-3 text-walnut/60">{cat.lastScraped}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
