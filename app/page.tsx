import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Receipt, Users, Wallet } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Split Bills, Not Friendships
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The smart way to track shared expenses, split bills, and manage group travel. Real-time updates, multiple currency support, and intelligent insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">
                Try it NOW!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="p-6">
            <Receipt className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Smart Bill Splitting</h3>
            <p className="text-muted-foreground">
              Split expenses equally or by custom amounts. Support for multiple currencies and instant calculations.
            </p>
          </Card>

          <Card className="p-6">
            <Users className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Group Management</h3>
            <p className="text-muted-foreground">
              Create groups for trips, roommates, or events. Track expenses and settle up with ease.
            </p>
          </Card>

          <Card className="p-6">
            <Wallet className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Expense Analytics</h3>
            <p className="text-muted-foreground">
              Get insights into spending patterns and track your budget with beautiful visualizations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}