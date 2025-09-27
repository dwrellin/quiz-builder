import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BuilderPage() {
  return (
    <div className="m-auto mt-12 max-w-md">
      <Card>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label>Quiz Name</Label>
                <Input
                  type="text"
                  placeholder="General Knowledge Quiz"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label>Description</Label>
                <Textarea rows={5} />
              </div>
              <Button className="cursor-pointer w-full">Create Quiz</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
