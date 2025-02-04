"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Dog } from "@/types/dogs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DogList from "@/components/DogList";

interface SearchProps {
  currentPage: number;
}

export default function Search({ currentPage }: SearchProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [size] = useState<number>(25);

  useEffect(() => {
    searchDogs();
  }, []);

  const searchDogs = async () => {
    try {
      const from = (currentPage - 1) * size;
      const searchResponse = await axios.get<{
        resultIds: string[];
        total: number;
        next: string;
        prev: string;
      }>(
        `https://frontend-take-home-service.fetch.com/dogs/search?size=${size}&from=${from}`,
        {
          withCredentials: true,
        }
      );

      const { resultIds, total } = searchResponse.data;
      setTotalPages(Math.ceil(total / size));

      if (!resultIds?.length) return;

      const postResponse = await axios.post<Dog[]>(
        "https://frontend-take-home-service.fetch.com/dogs",
        resultIds,
        { withCredentials: true }
      );

      setDogs(postResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center gap-y-5 mt-10 w-full mx-auto">
      <DogList dogs={dogs} />
      <div className="w-full flex justify-center mt-4 mb-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/search/${currentPage - 1 > 0 ? currentPage - 1 : 1}`}
              />
            </PaginationItem>
            {currentPage > 5 && (
              <>
                <PaginationItem>
                  <PaginationLink href={`/search/1`}>1</PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
              </>
            )}

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              console.log("currentPage", currentPage, i);
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`/search/${i + 1}`}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink href={`/search/${totalPages}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href={`/search/${currentPage + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
