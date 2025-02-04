"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Dog } from "@/types/dogs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import DogList from "@/components/DogList";
import Spinner from "@/components/ui/spinner";
import Filter from "@/components/Filter";
import useFilterStore from "@/store/useFilterStore";
import { useRouter } from "next/navigation";

interface SearchProps {
  currentPage: number;
}

export default function Search({ currentPage }: SearchProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { buildQueryParams } = useFilterStore();
  const router = useRouter();
  const size = 25;

  const searchDogs = async () => {
    try {
      const from = (currentPage - 1) * size;
      const queryParams = buildQueryParams(size, from);
      const url = `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`;

      setLoading(true);
      const searchResponse = await axios.get<{
        resultIds: string[];
        total: number;
        next: string;
        prev: string;
      }>(url, {
        withCredentials: true,
      });

      const { resultIds, total } = searchResponse.data;
      setTotalPages(Math.ceil(total / size));

      const postResponse = await axios.post<Dog[]>(
        "https://frontend-take-home-service.fetch.com/dogs",
        resultIds,
        { withCredentials: true }
      );

      setDogs(postResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          router.push("/");
          toast.error("You must be logged in to access this page");
        } else {
          console.error("Error fetching breeds:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchDogs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  if (loading) return <Spinner />;
  return (
    <>
      <div className="flex flex-col w-full justify-end items-end">
        <Filter onSubmit={searchDogs} />
      </div>
      <div className="flex flex-wrap gap-2 justify-center gap-y-5 mt-10 w-full mx-auto">
        <DogList dogs={dogs} />
        <div className="w-full flex justify-center mt-4 mb-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/search/${Math.max(currentPage - 1, 1)}`}
                />
              </PaginationItem>

              {[...Array(5)].map((_, i) => {
                const pageNumber = currentPage - 2 + i;
                if (pageNumber < 1 || pageNumber > totalPages) return null;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/search/${pageNumber}`}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href={`/search/${Math.min(currentPage + 1, totalPages)}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
