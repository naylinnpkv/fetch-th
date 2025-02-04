import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Dog } from "@/types/dogs";
import { Button } from "./ui/button";
import { PawPrint } from "lucide-react";
import { toast } from "sonner";

export default function MatchDialog({
  dog,
  open,
  setOpen,
}: {
  dog: Dog;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col items-center justify-center bg-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center mb-5">
            Your new friend is waiting!
          </DialogTitle>
          <div>
            <Card
              key={dog.id}
              className="w-56 flex flex-col border-2 border-gray-300 rounded-md shadow-md"
            >
              <CardHeader className="flex-none">
                <CardTitle className="text-center truncate">
                  {dog.name}
                </CardTitle>
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
              </CardFooter>
            </Card>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-teal-500 text-white"
            onClick={() => {
              toast.success(`${dog.name} is happy that you're interested!`, {
                icon: <PawPrint className="w-4 h-4 text-green-500" />,
              });
              setOpen(false);
            }}
          >
            <PawPrint className="w-4 h-4" />
            Contact {dog.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
