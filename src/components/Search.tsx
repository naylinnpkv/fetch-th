"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Dog } from "@/types/dogs";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  console.log("currentPage", currentPage);
  const searchDogs = async () => {
    try {
      const from = (currentPage - 1) * size;
      console.log("from", from);
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
      {dogs.map((dog) => (
        <Card
          key={dog.id}
          className="w-56 flex flex-col border-2 border-gray-300 rounded-md shadow-md"
        >
          <CardHeader className="flex-none">
            <CardTitle className="text-center truncate">{dog.name}</CardTitle>
            <CardDescription className="truncate text-center">
              {dog.breed} breed
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-4">
            <Image
              src={dog.img || ""}
              alt={dog.name}
              width={200}
              height={200}
              className="rounded-md object-cover w-full h-[200px]"
            />
          </CardContent>
          <CardFooter className="flex-none">
            <p className="text-sm text-gray-500 italic">Age: {dog.age}</p>
          </CardFooter>
        </Card>
      ))}
      <div className="w-full flex justify-center mt-4 mb-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/search/${currentPage - 1 > 0 ? currentPage - 1 : 0}`}
              />
            </PaginationItem>

            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/search/${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 3 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext href={`/search/${currentPage + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
