import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );
}
