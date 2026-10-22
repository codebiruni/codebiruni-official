import React from "react";
import StorePageLeadsManager from "./StorePageLeadsManager";

export const metadata = {
  title: "StorePage Leads | Admin Dashboard",
  description: "Manage form submissions and customer leads from the /storepage landing page",
};

export default function StorePageDashboardPage() {
  return (
    <div className="w-full">
      <StorePageLeadsManager />
    </div>
  );
}

