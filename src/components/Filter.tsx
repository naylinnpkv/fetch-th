"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useFilterStore from "@/store/useFilterStore";
import Spinner from "./ui/spinner";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Filter as FilterIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import api from "@/lib/axios";

const Select = dynamic(() => import("react-select"), { ssr: false });

type FormValues = {
  breeds: { label: string; value: string }[];
  minAge: number;
  maxAge: number;
  sortField: { label: string; value: string };
  sortOrder: "asc" | "desc";
};

interface FilterProps {
  onSubmit: () => void;
}

export default function Filter({ onSubmit }: FilterProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [breedOptions, setBreedOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    breeds: currentBreeds,
    minAge: currentMinAge,
    maxAge: currentMaxAge,
    sortField: currentSortField,
    sortOrder: currentSortOrder,
    setBreeds,
    setMinAge,
    setMaxAge,
    setSortField,
    setSortOrder,
  } = useFilterStore();

  const sortFieldOptions = [
    { label: "Breed", value: "breed" },
    { label: "Age", value: "age" },
    { label: "Name", value: "name" },
  ];
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      breeds: currentBreeds.map((breed) => ({
        label: breed,
        value: breed,
      })),
      minAge: currentMinAge,
      maxAge: currentMaxAge,
      sortField: sortFieldOptions.find(
        (option) => option.value === currentSortField
      ),
      sortOrder: currentSortOrder,
    },
  });

  const formValues = watch();
  console.log("Form values:", formValues);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dogs/breeds");
        setBreedOptions(
          response.data.map((breed: string) => ({
            label: breed,
            value: breed,
          }))
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            router.push("/");
            toast.error("You must be logged in to access this page");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, [router]);

  const handleFilterSubmit = (data: FormValues) => {
    setBreeds(data.breeds.map((breed) => breed.value));
    setMinAge(data.minAge);
    setMaxAge(data.maxAge);
    setSortField(data.sortField.value as "breed" | "age");
    setSortOrder(data.sortOrder);
    onSubmit();
  };

  if (loading) return <Spinner />;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="mt-4">
          <FilterIcon className="text-blue-500" />
          <span className="text-blue-500">Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <form
            onSubmit={handleSubmit(handleFilterSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-4">
              <Controller
                name="breeds"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={breedOptions}
                    value={field.value}
                    isMulti
                    placeholder="Select breeds"
                    className="w-72"
                  />
                )}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-sm">Min Age</Label>
                <Controller
                  name="minAge"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      min={0}
                      className="w-16 h-10 border-2 border-gray-300 rounded-md p-2"
                    />
                  )}
                />
              </div>

              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-sm">Max Age</Label>
                <Controller
                  name="maxAge"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      max={50}
                      className="w-16 h-10 border-2 border-gray-300 rounded-md p-2"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-start justify-start gap-2">
                  <Label className="text-sm">Sort by</Label>
                  <Controller
                    name="sortField"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={sortFieldOptions}
                        placeholder="Sort by"
                        className="w-32"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                  <Label className="text-sm">Sort order</Label>
                  <Controller
                    name="sortOrder"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        onValueChange={onChange}
                        defaultValue={value}
                        value={value}
                        className="flex gap-2 items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="asc" id="asc" />
                          <Label htmlFor="asc">Ascending</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="desc" id="desc" />
                          <Label htmlFor="desc">Descending</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-1/2 bg-blue-500 text-white rounded-lg"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
