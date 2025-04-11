"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EquipesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/organisation/teams");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection vers la page des équipes...</p>
      </div>
    </div>
  );
} 