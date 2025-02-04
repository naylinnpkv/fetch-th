"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import useFilterStore from "@/store/useFilterStore";
import Spinner from "./ui/spinner";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false }); // to avoid hydration error

export default function Filter() {
  const [loading, setLoading] = useState(false);
  const [breeds, setBreeds] = useState<{ label: string; value: string }[]>([]);
  const {
    breeds: selectedBreeds,
    setBreeds: setSelectedBreeds,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
  } = useFilterStore();

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        { withCredentials: true }
      );
      setBreeds(
        response.data.map((breed: string) => ({
          label: breed,
          value: breed,
        }))
      );
      setLoading(false);
    };
    fetchBreeds();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="flex justify-center items-center gap-2 my-4">
      <Select
        options={breeds || []}
        placeholder="Select breeds"
        isMulti
        maxMenuHeight={200}
        value={breeds.filter((breed) => selectedBreeds.includes(breed.value))}
        className="w-96"
        onChange={(newValue: unknown) => {
          const selectedOptions = newValue as Array<{
            label: string;
            value: string;
          }>;
          setSelectedBreeds(selectedOptions.map((option) => option.value));
        }}
      />
      <input
        type="number"
        onChange={(e) => setMinAge(Number(e.target.value))}
        value={minAge}
        min={0}
        placeholder="Min Age"
        className="w-24 border-2 border-gray-300 rounded-md p-2"
      />
      <input
        type="number"
        onChange={(e) => setMaxAge(Number(e.target.value))}
        value={maxAge}
        max={50}
        placeholder="Max Age"
        className="w-24 border-2 border-gray-300 rounded-md p-2"
      />
    </div>
  );
}
