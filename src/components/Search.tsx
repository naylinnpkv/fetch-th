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
import DogList from "@/components/DogList";
import Spinner from "@/components/ui/spinner";
import Filter from "@/components/Filter";
import useFilterStore from "@/store/useFilterStore";
import { Button } from "./ui/button";
interface SearchProps {
  currentPage: number;
}

export default function Search({ currentPage }: SearchProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { breeds, minAge, maxAge } = useFilterStore();
  const size = 25;

  useEffect(() => {
    searchDogs();
  }, []);

  const searchDogs = async () => {
    try {
      const from = (currentPage - 1) * size;
      const queryParams = new URLSearchParams();

      queryParams.append("size", size.toString());
      queryParams.append("from", from.toString());

      if (breeds.length > 0) {
        queryParams.append("breeds", breeds.join(","));
      }
      if (minAge > 0) {
        queryParams.append("ageMin", minAge.toString());
      }
      if (maxAge > 0) {
        queryParams.append("ageMax", maxAge.toString());
      }

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
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <Spinner />;
  return (
    <>
      <div className="flex justify-center items-center gap-2 my-4">
        <Filter />
        <Button
          variant="outline"
          className="bg-blue-500 text-white"
          onClick={searchDogs}
        >
          Search
        </Button>
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
