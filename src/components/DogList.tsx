import { Dog } from "@/types/dogs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import useFavoriteDogsStore from "@/store/useFavoriteDogsStore";

interface DogListProps {
  dogs: Dog[];
}

export default function DogList({ dogs }: DogListProps) {
  const { favoriteDogs, addDog, removeDog } = useFavoriteDogsStore();

  const handleSaveDog = (dogId: string) => {
    if (favoriteDogs.includes(dogId)) {
      removeDog(dogId);
    } else {
      addDog(dogId);
    }
  };

  return (
    <>
      {dogs.map((dog) => (
        <Card
          key={dog.id}
          className="w-56 flex flex-col border-2 border-gray-300 rounded-md shadow-md"
        >
          <CardHeader className="flex-none">
            <CardTitle className="text-center truncate">{dog.name}</CardTitle>
            <CardDescription className="text-sm">
              Breed: <span className="font-bold">{dog.breed}</span>
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
          <CardFooter className="flex gap-2 justify-between">
            <p className="text-sm text-gray-500 italic">Age: {dog.age}</p>
            <Heart
              size={24}
              fill={favoriteDogs.includes(dog.id) ? "red" : "none"}
              className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600 justify-self-end"
              onClick={() => handleSaveDog(dog.id)}
            />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
