"use client";

import useFavoriteDogsStore from "@/store/useFavoriteDogsStore";
import DogList from "@/components/DogList";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dog } from "@/types/dogs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { favoriteDogs } = useFavoriteDogsStore();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs",
      favoriteDogs,
      { withCredentials: true }
    );
    setDogs(response.data);
  };

  useEffect(() => {
    setLoading(true);
    if (favoriteDogs.length > 0) {
      fetchFavorites();
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteDogs]);

  if (loading) return <Spinner />;
  if (dogs.length === 0 || favoriteDogs.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">No favorites found</h1>
        <p className="text-gray-500">
          Add some 🐶 to your favorites to see them here
        </p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center gap-y-5 mt-10 w-full mx-auto mb-10">
        <DogList dogs={dogs} />
      </div>
      <div className="flex justify-center my-5">
        {dogs.length > 0 && (
          <Button variant="outline" className="bg-purple-500 text-white">
            Find a new friend
          </Button>
        )}
      </div>
    </div>
  );
}
