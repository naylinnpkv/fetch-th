"use client";

import useFavoriteDogsStore from "@/store/useFavoriteDogsStore";
import DogList from "@/components/DogList";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dog as DogIcon } from "lucide-react";
import { Bone } from "lucide-react";
import { Dog } from "@/types/dogs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import MatchDialog from "@/components/MatchDialog";

export default function Favorites() {
  const { favoriteDogs } = useFavoriteDogsStore();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const response = await axios.post<Dog[]>(
      "https://frontend-take-home-service.fetch.com/dogs",
      favoriteDogs,
      { withCredentials: true }
    );
    setDogs(response.data);
  };

  const generateMatch = async () => {
    const response = await axios.post<{ match: string }>(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      favoriteDogs,
      { withCredentials: true }
    );
    const fetchMatch = await axios.post<Dog[]>(
      "https://frontend-take-home-service.fetch.com/dogs",
      [response.data.match],
      { withCredentials: true }
    );
    setMatch(fetchMatch.data[0]);
    setMatchOpen(true);
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
      <div className="flex flex-wrap gap-2 justify-center gap-y-5 mt-10 w-3/4 mx-auto mb-10">
        <DogList dogs={dogs} />
      </div>
      <div className="flex justify-center my-5">
        {dogs.length > 0 && (
          <Button
            variant="outline"
            className="bg-purple-500 text-white"
            disabled={loading}
            onClick={generateMatch}
          >
            <DogIcon className="w-4 h-4" />
            Find a new friend
            <Bone className="w-4 h-4" />
          </Button>
        )}
      </div>
      {match && (
        <MatchDialog dog={match} open={matchOpen} setOpen={setMatchOpen} />
      )}
    </div>
  );
}
