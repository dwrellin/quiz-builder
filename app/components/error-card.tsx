import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ErrorCard({ error }: { error?: any }) {
  return (
    <Card className="gap-2 w-full max-w-xl">
      <CardHeader className="flex flex-col items-center">
        <AlertCircle className="size-12 text-red-500" />
        <CardTitle className="mt-4 text-center text-xl font-semibold">
          Oops! Something went wrong.
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4 text-gray-600">
          {!error
            ? "Sorry for the inconvenience. Please try again."
            : error.toString()}
        </p>
      </CardContent>
    </Card>
  );
}
