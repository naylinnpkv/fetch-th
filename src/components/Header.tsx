"use client";

import Link from "next/link";
import { Heart, PawPrint, LogOut } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await axios
      .post(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="sticky top-0  w-full border-b bg-white ">
      <div className="container flex h-14 items-center">
        <div className="mx-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">🐕 Fetch</span>
          </Link>
        </div>
        {pathname !== "/" && (
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <Link
                href="/search/1"
                className="flex items-center space-x-1 hover:text-gray-600"
              >
                <PawPrint
                  className={`h-4 w-4 ${
                    pathname.includes("/search")
                      ? "text-orange-500"
                      : "text-gray-600"
                  }`}
                />
                <span
                  className={`${
                    pathname.includes("/search")
                      ? "text-orange-500"
                      : "text-gray-600"
                  }`}
                >
                  Browse
                </span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center space-x-1 hover:text-gray-600"
              >
                <Heart
                  className={`h-4 w-4 ${
                    pathname.includes("/favorites")
                      ? "text-orange-500"
                      : "text-gray-600"
                  }`}
                />
                <span
                  className={`${
                    pathname.includes("/favorites")
                      ? "text-orange-500"
                      : "text-gray-600"
                  }`}
                >
                  Favorites
                </span>
              </Link>
              <button
                className="flex items-center space-x-1 hover:text-gray-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
