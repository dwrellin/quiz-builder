import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";

export default function SkeletonLoader() {
  return (
    <Card className="w-full mx-auto max-w-max">
      <CardContent>
        <div className="flex justify-center items-center gap-3">
          <LoaderCircle size={48} className="animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
}
