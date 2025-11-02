import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="w-full bg-gray-50 min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Rocket className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Your Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You are all set! Start exploring your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-4">
            <Button asChild className="w-full" size="lg" variant="secondary">
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
