import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function GrowthAnalysis() {
  const companies = useQuery(api.companies.getCompanies, { limit: 100 });

  if (!companies || companies.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No company data available for growth analysis.
        </p>
      </div>
    );
  }

  // Filter companies with growth data
  const companiesWithGrowth = companies.filter(c => c.growthRate !== undefined);
  
  // Calculate growth metrics
  const avgGrowthRate = companiesWithGrowth.length > 0 
    ? companiesWithGrowth.reduce((sum, c) => sum + (c.growthRate || 0), 0) / companiesWithGrowth.length
    : 0;

  const highGrowthCompanies = companiesWithGrowth
    .filter(c => (c.growthRate || 0) > 150)
    .sort((a, b) => (b.growthRate || 0) - (a.growthRate || 0));

  const fundingByStage = companies.reduce((acc, company) => {
    if (company.fundingStage && company.totalFunding) {
      if (!acc[company.fundingStage]) {
        acc[company.fundingStage] = { count: 0, totalFunding: 0 };
      }
      acc[company.fundingStage].count++;
      acc[company.fundingStage].totalFunding += company.totalFunding;
    }
    return acc;
  }, {} as Record<string, { count: number; totalFunding: number }>);

  const getGrowthIcon = (rate: number) => {
    if (rate > 100) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 200) return "text-green-700 bg-green-100";
    if (rate > 100) return "text-green-600 bg-green-50";
    if (rate > 50) return "text-blue-600 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="space-y-6">
      {/* Growth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{avgGrowthRate.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground">Average Growth Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{highGrowthCompanies.length}</div>
            <p className="text-sm text-muted-foreground">High Growth Companies (&gt;150%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companiesWithGrowth.length}</div>
            <p className="text-sm text-muted-foreground">Companies with Growth Data</p>
          </CardContent>
        </Card>
      </div>

      {/* High Growth Companies */}
      {highGrowthCompanies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>High Growth Companies</CardTitle>
            <CardDescription>
              Companies with growth rates above 150%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highGrowthCompanies.slice(0, 8).map((company) => (
                <div key={company._id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{company.industry}</Badge>
                      {company.fundingStage && (
                        <Badge variant="secondary">{company.fundingStage}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getGrowthColor(company.growthRate || 0)}`}>
                      {getGrowthIcon(company.growthRate || 0)}
                      <span className="font-bold">{company.growthRate}%</span>
                    </div>
                    {company.totalFunding && (
                      <div className="text-sm text-muted-foreground mt-1">
                        ${(company.totalFunding / 1000000).toFixed(1)}M funding
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funding Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Funding by Stage</CardTitle>
          <CardDescription>
            Average funding amounts and company counts by stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(fundingByStage)
              .sort(([,a], [,b]) => b.totalFunding - a.totalFunding)
              .map(([stage, data]) => (
                <div key={stage} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{stage}</h4>
                    <p className="text-sm text-muted-foreground">
                      {data.count} companies
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${(data.totalFunding / data.count / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">
                      avg per company
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}