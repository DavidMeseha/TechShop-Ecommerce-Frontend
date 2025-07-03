import { DropdownInputSearch } from "@/common/components/ui/extend/DropdownInputSearch";
import { VENDORS_QUERY_KEY } from "@/common/constants/query-keys";
import useDebounce from "@/common/hooks/useDebounce";
import { findVendors } from "@/admin/services/find";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type Props = {
  className?: string;
  selectedVendorId: string;
  onChange: (vendorId: string) => void;
};

export default function VendorSelect({ selectedVendorId, onChange, className }: Props) {
  const [vendorQuery, setVendorQuery] = useState("");

  const vendorsQuery = useQuery({
    queryKey: [VENDORS_QUERY_KEY, vendorQuery],
    queryFn: () => findVendors({ query: vendorQuery })
  });
  const vendors = vendorsQuery.data ?? [];
  const vendorQueryChangeHandle = useDebounce(setVendorQuery);

  return (
    <DropdownInputSearch
      className={className}
      isAsync
      isPending={vendorsQuery.isLoading}
      placeholder="Vendor..."
      value={selectedVendorId}
      options={[
        ...vendors.map((vendor) => ({ value: vendor.id, label: vendor.name })),
        { label: "All Vendors", value: "" }
      ]}
      onSearchChange={vendorQueryChangeHandle}
      onValueChange={(value) => onChange(value)}
    />
  );
}
