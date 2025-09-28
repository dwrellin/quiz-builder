import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SkeletonLoader() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full h-[32px]" />
          <Skeleton className="w-[80%] h-[32px]" />
          <Skeleton className="w-[60%] h-[32px]" />
        </div>
      </CardContent>
    </Card>
  );
}
