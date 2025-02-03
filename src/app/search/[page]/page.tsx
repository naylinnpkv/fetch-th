"use client";

import { useParams } from "next/navigation";
import Search from "@/components/Search";

export default function SearchPage() {
  const { page } = useParams();
  return <Search currentPage={Number(page) || 1} />;
}
