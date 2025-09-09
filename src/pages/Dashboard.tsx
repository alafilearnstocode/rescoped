// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { Protected } from "@/lib/protected-page";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, DollarSign, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { CompanyList } from "@/components/market/CompanyList";
import { AddCompanyDialog } from "@/components/market/AddCompanyDialog";
import { MarketOverview } from "@/components/market/MarketOverview";
import { AcquisitionTargets } from "@/components/market/AcquisitionTargets";
import { CompetitiveLandscape } from "@/components/market/CompetitiveLandscape";
import { GrowthAnalysis } from "@/components/market/GrowthAnalysis";
import { UserButton } from "@/components/auth/UserButton";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") as "overview" | "companies" | "analysis" || "overview";
  const [activeTab, setActiveTab] = useState<"overview" | "companies" | "analysis">(initialTab);
  const [showAddCompany, setShowAddCompany] = useState(false);
  
  const stats = useQuery(api.companies.getIndustryStats);

  return (
    <Protected>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-xl font-bold">ReScoped</span>
              </Link>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Market Research Dashboard</h1>
                <p className="text-muted-foreground">
                  Track companies, analyze markets, and identify investment opportunities
                </p>
              </div>
              <Button onClick={() => setShowAddCompany(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === "overview" ? "default" : "outline"}
                onClick={() => setActiveTab("overview")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "companies" ? "default" : "outline"}
                onClick={() => setActiveTab("companies")}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                Companies
              </Button>
              <Button
                variant={activeTab === "analysis" ? "default" : "outline"}
                onClick={() => setActiveTab("analysis")}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Analysis
              </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Industries</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.keys(stats.industriesCount).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Funding</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageFunding 
                        ? `$${(stats.averageFunding / 1000000).toFixed(1)}M`
                        : "N/A"
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Industry</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.topIndustries[0]?.industry || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.topIndustries[0]?.count || 0} companies
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "overview" && <MarketOverview />}
            {activeTab === "companies" && <CompanyList />}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                {/* Market Analysis Components */}
                <Card>
                  <CardHeader>
                    <CardTitle>Acquisition Target Analysis</CardTitle>
                    <CardDescription>
                      Top companies ranked by acquisition suitability and investment potential
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AcquisitionTargets />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Landscape</CardTitle>
                    <CardDescription>
                      Market positioning analysis across different industries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CompetitiveLandscape />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth & Funding Trends</CardTitle>
                    <CardDescription>
                      Analysis of growth rates and funding patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GrowthAnalysis />
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>

        <AddCompanyDialog 
          open={showAddCompany} 
          onOpenChange={setShowAddCompany} 
        />
      </div>
    </Protected>
  );
}