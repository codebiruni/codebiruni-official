"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Store,
  Phone,
  MessageCircle,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  RefreshCw,
  Plus,
  Building2,
  User,
  Copy,
  Check,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  TrendingUp,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type LeadStage =
  | "new"
  | "contacted"
  | "in_discussion"
  | "converted"
  | "closed";

export interface StorePageLead {
  _id: string;
  name: string;
  number: string;
  email?: string;
  projectType: string;
  address: string; // Brand/Business Name
  note?: string;
  status?: LeadStage;
  createdAt?: string;
  updatedAt?: string;
}

export const STAGE_CONFIG: Record<
  LeadStage,
  {
    label: string;
    description: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  new: {
    label: "New Lead",
    description: "Newly submitted from landing page",
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    dotClass: "bg-blue-500",
    icon: Clock,
  },
  contacted: {
    label: "Contacted",
    description: "Called or messaged customer",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dotClass: "bg-amber-500",
    icon: MessageSquare,
  },
  in_discussion: {
    label: "In Discussion",
    description: "Reviewing demo, store setup, or bKash",
    badgeClass:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    dotClass: "bg-purple-500",
    icon: SlidersHorizontal,
  },
  converted: {
    label: "Converted (Won)",
    description: "Order confirmed / package purchased",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed / Lost",
    description: "Uninterested or cancelled",
    badgeClass:
      "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    dotClass: "bg-zinc-400",
    icon: XCircle,
  },
};

export default function StorePageLeadsManager() {
  const [leads, setLeads] = useState<StorePageLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStageTab, setActiveStageTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dialog states
  const [selectedLead, setSelectedLead] = useState<StorePageLead | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for Edit / Add
  const [editForm, setEditForm] = useState({
    name: "",
    number: "",
    brand: "",
    note: "",
    status: "new" as LeadStage,
  });

  const [addForm, setAddForm] = useState({
    name: "",
    number: "",
    brand: "",
    note: "",
    status: "new" as LeadStage,
  });

  // Fetch leads from backend
  const fetchLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await axios.get("/api/v2/order?projectType=StorePage");
      if (response.data && response.data.success) {
        setLeads(response.data.data || []);
      } else {
        toast.error("Failed to load StorePage leads");
      }
    } catch (err: unknown) {
      console.error("Error fetching leads:", err);
      toast.error("Network error while fetching leads");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Fast inline stage update
  const handleUpdateStage = async (leadId: string, newStage: LeadStage) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStage } : l))
    );

    try {
      const response = await axios.patch("/api/v2/order", {
        id: leadId,
        data: { status: newStage },
      });

      if (response.data?.success) {
        toast.success(`Stage updated to ${STAGE_CONFIG[newStage].label}`);
      } else {
        toast.error("Failed to save stage change");
        fetchLeads();
      }
    } catch {
      toast.error("Error updating lead stage");
      fetchLeads();
    }
  };

  // Copy phone number
  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    toast.success("Phone number copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WhatsApp link helper
  const handleOpenWhatsApp = (lead: StorePageLead) => {
    let cleanNumber = lead.number.replace(/[^\d+]/g, "");
    if (cleanNumber.startsWith("+880")) {
      cleanNumber = cleanNumber.slice(1);
    } else if (cleanNumber.startsWith("0")) {
      cleanNumber = "88" + cleanNumber;
    } else if (!cleanNumber.startsWith("880") && cleanNumber.length === 10) {
      cleanNumber = "880" + cleanNumber;
    }

    const brandInfo =
      lead.address && lead.address !== "Online Store Client"
        ? ` (ব্র্যান্ড: ${lead.address})`
        : "";

    const message = encodeURIComponent(
      `আসসালামু আলাইকুম ${lead.name},\nCode Biruni থেকে যোগাযোগ করছি। আপনি আমাদের StorePage (৳১৫,০০০ E-Commerce) অফারে আগ্রহ প্রকাশ করেছিলেন${brandInfo}। আপনার সাথে এই বিষয়ে বিস্তারিত আলোচনা করতে পারি কি?`
    );

    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  // Open Edit Dialog
  const handleOpenEdit = (lead: StorePageLead) => {
    setSelectedLead(lead);
    setEditForm({
      name: lead.name,
      number: lead.number,
      brand: lead.address && lead.address !== "Online Store Client" ? lead.address : "",
      note: lead.note || "",
      status: (lead.status as LeadStage) || "new",
    });
    setIsEditOpen(true);
  };

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!selectedLead) return;

    try {
      const response = await axios.patch("/api/v2/order", {
        id: selectedLead._id,
        data: {
          name: editForm.name,
          number: editForm.number,
          address: editForm.brand || "Online Store Client",
          note: editForm.note,
          status: editForm.status,
        },
      });

      if (response.data?.success) {
        toast.success("Lead details updated successfully");
        setIsEditOpen(false);
        fetchLeads();
      } else {
        toast.error("Failed to update lead");
      }
    } catch {
      toast.error("Error updating lead details");
    }
  };

  // Submit Add Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.number) {
      toast.error("Name and Phone number are required");
      return;
    }

    try {
      const response = await axios.post("/api/v2/order", {
        name: addForm.name,
        number: addForm.number,
        projectType: "StorePage (E-Commerce ৳15,000)",
        address: addForm.brand || "Online Store Client",
        status: addForm.status,
        note: addForm.note
          ? `StorePage Lead. Brand: ${addForm.brand || "N/A"}. Note: ${addForm.note}`
          : `StorePage Lead. Brand: ${addForm.brand || "N/A"}. Added from Admin Dashboard.`,
      });

      if (response.data?.success) {
        toast.success("New lead added successfully");
        setIsAddOpen(false);
        setAddForm({
          name: "",
          number: "",
          brand: "",
          note: "",
          status: "new",
        });
        fetchLeads();
      } else {
        toast.error("Failed to create lead");
      }
    } catch {
      toast.error("Error creating lead");
    }
  };

  // Delete Lead
  const handleDeleteLead = async () => {
    if (!deleteConfirmId) return;

    try {
      const response = await axios.delete("/api/v2/order", {
        data: { ids: [deleteConfirmId] },
      });

      if (response.data?.success) {
        toast.success("Lead deleted successfully");
        setDeleteConfirmId(null);
        fetchLeads();
      } else {
        toast.error("Failed to delete lead");
      }
    } catch {
      toast.error("Error deleting lead");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.info("No leads to export");
      return;
    }

    const headers = [
      "ID",
      "Customer Name",
      "Phone / WhatsApp",
      "Brand / Business",
      "Stage",
      "Package",
      "Date",
      "Note",
    ];

    const rows = leads.map((lead) => [
      `"${lead._id}"`,
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.number.replace(/"/g, '""')}"`,
      `"${(lead.address || "").replace(/"/g, '""')}"`,
      `"${STAGE_CONFIG[(lead.status as LeadStage) || "new"]?.label || "New Lead"}"`,
      `"${lead.projectType.replace(/"/g, '""')}"`,
      `"${lead.createdAt ? format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss") : ""}"`,
      `"${(lead.note || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `storepage-leads-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV successfully");
  };

  // Stage counts for metrics and tab badges
  const stageCounts = useMemo(() => {
    const counts = {
      all: leads.length,
      new: 0,
      contacted: 0,
      in_discussion: 0,
      converted: 0,
      closed: 0,
    };

    leads.forEach((l) => {
      const stage = (l.status as LeadStage) || "new";
      if (counts[stage] !== undefined) {
        counts[stage]++;
      } else {
        counts.new++;
      }
    });

    return counts;
  }, [leads]);

  // Conversion rate
  const conversionRate = useMemo(() => {
    if (leads.length === 0) return 0;
    return Math.round((stageCounts.converted / leads.length) * 100);
  }, [leads.length, stageCounts.converted]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Stage filter
        if (activeStageTab !== "all") {
          const leadStage = (lead.status as LeadStage) || "new";
          if (leadStage !== activeStageTab) return false;
        }

        // Search filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          lead.name?.toLowerCase().includes(q) ||
          lead.number?.toLowerCase().includes(q) ||
          lead.address?.toLowerCase().includes(q) ||
          lead.note?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortBy === "newest" ? timeB - timeA : timeA - timeB;
      });
  }, [leads, activeStageTab, searchQuery, sortBy]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  StorePage Leads &amp; Pipeline
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 text-xs font-semibold"
                >
                  ৳১৫,০০০ E-Commerce
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 pt-0.5">
            Track inquiries, update sales pipeline stages, and follow up directly with{" "}
            <Link
              href="/storepage"
              target="_blank"
              className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
            >
              /storepage
              <ExternalLink className="h-3 w-3" />
            </Link>{" "}
            customers.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs font-medium"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-9 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Leads */}
        <Card className="shadow-xs border-border/70 hover:border-border transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Leads
              </span>
              <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {loading ? "..." : stageCounts.all}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                all inquiries
              </span>
            </div>
          </CardContent>
        </Card>

        {/* New / Action Required */}
        <Card className="shadow-xs border-border/70 hover:border-border transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                New (Uncontacted)
              </span>
              <div className="h-7 w-7 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {loading ? "..." : stageCounts.new}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                needs response
              </span>
            </div>
          </CardContent>
        </Card>

        {/* In Discussion / Follow Up */}
        <Card className="shadow-xs border-border/70 hover:border-border transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Discussions
              </span>
              <div className="h-7 w-7 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                {loading ? "..." : stageCounts.contacted + stageCounts.in_discussion}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                in pipeline
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Converted (Won) */}
        <Card className="shadow-xs border-border/70 hover:border-border transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Converted (Won)
              </span>
              <div className="h-7 w-7 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {loading ? "..." : stageCounts.converted}
              </span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-1.5 py-0 font-semibold"
              >
                {conversionRate}% Rate
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table and Filter Container */}
      <Card className="shadow-xs border-border/70 overflow-hidden">
        {/* Stage Filter Tabs Bar */}
        <div className="bg-muted/30 border-b border-border/60 px-4 sm:px-6 pt-3 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveStageTab("all")}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
              activeStageTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All Leads</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted font-mono font-medium">
              {stageCounts.all}
            </span>
          </button>

          {(Object.keys(STAGE_CONFIG) as LeadStage[]).map((stageKey) => {
            const config = STAGE_CONFIG[stageKey];
            const count = stageCounts[stageKey];
            const isActive = activeStageTab === stageKey;

            return (
              <button
                key={stageKey}
                type="button"
                onClick={() => setActiveStageTab(stageKey)}
                className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                <span>{config.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium ${
                    isActive ? "bg-primary/10 text-primary" : "bg-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Quick Controls */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border-b border-border/60">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by customer name, phone, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sort:</span>
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as "newest" | "oldest")}
              >
                <SelectTrigger className="h-9 text-xs w-[130px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="h-9 px-2.5 font-normal text-xs whitespace-nowrap">
              Showing {filteredLeads.length} of {leads.length}
            </Badge>
          </div>
        </div>

        {/* Leads Table */}
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted/70 mx-auto flex items-center justify-center text-muted-foreground">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No Leads in this Stage
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? `No leads matched your search query "${searchQuery}". Try a different keyword.`
                  : activeStageTab !== "all"
                  ? `No inquiries currently marked as "${STAGE_CONFIG[activeStageTab as LeadStage]?.label}".`
                  : "Leads submitted from the /storepage customer form will appear here automatically."}
              </p>
              {(searchQuery || activeStageTab !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveStageTab("all");
                  }}
                >
                  Reset All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-muted/40 border-b border-border/70 text-xs">
                    <TableHead className="w-[200px] py-3.5 pl-4 sm:pl-6">Customer</TableHead>
                    <TableHead className="w-[190px] py-3.5">Phone / Contact</TableHead>
                    <TableHead className="w-[170px] py-3.5">Brand / Shop</TableHead>
                    <TableHead className="w-[180px] py-3.5">Pipeline Stage</TableHead>
                    <TableHead className="w-[150px] py-3.5">Date</TableHead>
                    <TableHead className="py-3.5">Notes</TableHead>
                    <TableHead className="w-[120px] py-3.5 pr-4 sm:pr-6 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-xs sm:text-sm">
                  {filteredLeads.map((lead) => {
                    const currentStage: LeadStage =
                      (lead.status as LeadStage) || "new";
                    const stageMeta = STAGE_CONFIG[currentStage] || STAGE_CONFIG.new;

                    return (
                      <TableRow
                        key={lead._id}
                        className="hover:bg-muted/30 border-b border-border/50 transition-colors"
                      >
                        {/* Customer Column */}
                        <TableCell className="py-3.5 pl-4 sm:pl-6 font-medium">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {lead.name ? lead.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground block truncate max-w-[140px]">
                                {lead.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                #{lead._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Phone / Contact Column */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-foreground">
                              {lead.number}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {/* Copy button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                title="Copy Number"
                                onClick={() => handleCopyPhone(lead._id, lead.number)}
                              >
                                {copiedId === lead._id ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>

                              {/* Direct WhatsApp button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                title="Chat on WhatsApp"
                                onClick={() => handleOpenWhatsApp(lead)}
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </Button>

                              {/* Direct Call */}
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-6 w-6 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                                title="Call directly"
                              >
                                <a href={`tel:${lead.number}`}>
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </TableCell>

                        {/* Brand Column */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            <span className="truncate max-w-[130px] font-medium text-foreground">
                              {lead.address && lead.address !== "Online Store Client"
                                ? lead.address
                                : "—"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Interactive Pipeline Stage Selector Column */}
                        <TableCell className="py-3.5">
                          <Select
                            value={currentStage}
                            onValueChange={(val) =>
                              handleUpdateStage(lead._id, val as LeadStage)
                            }
                          >
                            <SelectTrigger
                              className={`h-7 w-auto min-w-[135px] text-xs font-medium border shadow-none px-2 rounded-md ${stageMeta.badgeClass}`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${stageMeta.dotClass}`} />
                                <SelectValue>{stageMeta.label}</SelectValue>
                              </div>
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                              {(Object.keys(STAGE_CONFIG) as LeadStage[]).map((stageKey) => {
                                const cfg = STAGE_CONFIG[stageKey];
                                return (
                                  <SelectItem key={stageKey} value={stageKey} className="text-xs py-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
                                      <span className="font-medium">{cfg.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Date Column */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {lead.createdAt ? (
                            <div>
                              <div className="font-medium text-foreground">
                                {format(new Date(lead.createdAt), "dd MMM yyyy")}
                              </div>
                              <div className="text-[11px]">
                                {format(new Date(lead.createdAt), "hh:mm a")}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        {/* Notes Column */}
                        <TableCell className="py-3.5">
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {lead.note || "—"}
                          </p>
                        </TableCell>

                        {/* Actions Column */}
                        <TableCell className="py-3.5 pr-4 sm:pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit / View Notes */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title="Edit Details & Notes"
                              onClick={() => handleOpenEdit(lead)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete Lead"
                              onClick={() => setDeleteConfirmId(lead._id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Edit / View Lead Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-600" />
              <span>Lead Details &amp; Sales Follow-Up</span>
            </DialogTitle>
            <DialogDescription>
              Update customer information, internal follow-up notes, and pipeline status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs sm:text-sm">
            {/* Pipeline Stage Selector in Modal */}
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border border-border/60">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Current Pipeline Stage</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {STAGE_CONFIG[editForm.status]?.description}
                </span>
              </label>
              <Select
                value={editForm.status}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, status: val as LeadStage })
                }
              >
                <SelectTrigger className="h-9 bg-background text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STAGE_CONFIG) as LeadStage[]).map((stageKey) => {
                    const cfg = STAGE_CONFIG[stageKey];
                    return (
                      <SelectItem key={stageKey} value={stageKey}>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
                          <span className="font-medium">{cfg.label}</span>
                          <span className="text-xs text-muted-foreground">
                            — {cfg.description}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Customer Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Mobile / WhatsApp Number
                </label>
                <Input
                  value={editForm.number}
                  onChange={(e) =>
                    setEditForm({ ...editForm, number: e.target.value })
                  }
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Brand / Shop Name
              </label>
              <Input
                placeholder="e.g. Smart Store BD"
                value={editForm.brand}
                onChange={(e) =>
                  setEditForm({ ...editForm, brand: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Follow-up Activity &amp; Internal Notes
              </label>
              <Textarea
                rows={4}
                placeholder="Record conversation summary, customer requests, bKash setup requirements, or reasons for closure..."
                value={editForm.note}
                onChange={(e) =>
                  setEditForm({ ...editForm, note: e.target.value })
                }
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
            {selectedLead && (
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                onClick={() => handleOpenWhatsApp(selectedLead)}
              >
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Manual Lead Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual StorePage Lead</DialogTitle>
            <DialogDescription>
              Record an incoming offline inquiry or direct message for the StorePage ৳15,000 package.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-4 py-2 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Customer Name *
              </label>
              <Input
                required
                placeholder="e.g. সাকিব হাসান"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Mobile / WhatsApp Number *
              </label>
              <Input
                required
                placeholder="017xxxxxxxx"
                value={addForm.number}
                onChange={(e) =>
                  setAddForm({ ...addForm, number: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Brand / Business Name
              </label>
              <Input
                placeholder="e.g. Trendy Outfit BD"
                value={addForm.brand}
                onChange={(e) =>
                  setAddForm({ ...addForm, brand: e.target.value })
                }
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Initial Pipeline Stage
              </label>
              <Select
                value={addForm.status}
                onValueChange={(val) =>
                  setAddForm({ ...addForm, status: val as LeadStage })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STAGE_CONFIG) as LeadStage[]).map((stageKey) => {
                    const cfg = STAGE_CONFIG[stageKey];
                    return (
                      <SelectItem key={stageKey} value={stageKey}>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
                          <span>{cfg.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Initial Notes
              </label>
              <Textarea
                rows={3}
                placeholder="Optional notes or conversation details..."
                value={addForm.note}
                onChange={(e) =>
                  setAddForm({ ...addForm, note: e.target.value })
                }
              />
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this StorePage lead from the database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLead}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
