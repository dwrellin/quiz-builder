import { Button } from "@/components/ui/button";
import * as React from "react";

export default function Home() {
  return (
    <div>
      <h2 className="text-center text-3xl font-bold mb-3">Log in as:</h2>
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline">Examiner</Button>
        <p>or</p>
        <Button variant="outline">Examinee</Button>
      </div>
    </div>
  );
}
