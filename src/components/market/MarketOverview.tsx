import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, Target, Award } from "lucide-react";

export function MarketOverview() {
  const stats = useQuery(api.companies.getIndustryStats);
  const acquisitionTargets = useQuery(api.marketAnalysis.generateAcquisitionTargets, {
    minScore: 6,
  });

  if (!stats) {
    return <div>Loading market overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Industry Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Industry Breakdown
          </CardTitle>
          <CardDescription>
            Distribution of companies across different industries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.topIndustries.map((industry) => (
              <div key={industry.industry} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{industry.count}</div>
                <div className="text-sm text-muted-foreground">{industry.industry}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funding Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Funding Stage Distribution
          </CardTitle>
          <CardDescription>
            Companies by their current funding stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.fundingStagesCount).map(([stage, count]) => (
              <Badge key={stage} variant="secondary" className="text-sm">
                {stage}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Acquisition Targets */}
      {acquisitionTargets && acquisitionTargets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Acquisition Targets
            </CardTitle>
            <CardDescription>
              Companies with high acquisition suitability scores (6+/10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acquisitionTargets.slice(0, 5).map((company) => (
                <div key={company._id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{company.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{company.industry}</Badge>
                      <Badge variant="secondary">{company.sector}</Badge>
                    </div>
                    {company.keyTechnologies && (
                      <div className="flex gap-1 mt-2">
                        {company.keyTechnologies.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">
                        {company.acquisitionSuitability}/10
                      </span>
                    </div>
                    {company.totalFunding && (
                      <div className="text-sm text-muted-foreground">
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

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>
            Key observations from the current dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Industry Concentration</h4>
              <p className="text-sm text-muted-foreground">
                The {stats.topIndustries[0]?.industry} industry leads with {stats.topIndustries[0]?.count} companies, 
                representing {((stats.topIndustries[0]?.count || 0) / stats.totalCompanies * 100).toFixed(1)}% of the total dataset.
              </p>
            </div>
            
            {stats.averageFunding && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Funding Landscape</h4>
                <p className="text-sm text-muted-foreground">
                  Average funding across all companies is ${(stats.averageFunding / 1000000).toFixed(1)}M, 
                  indicating a healthy mix of early and growth-stage companies.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Data Coverage</h4>
              <p className="text-sm text-muted-foreground">
                Currently tracking {stats.totalCompanies} companies across {Object.keys(stats.industriesCount).length} industries. 
                Consider expanding data collection to reach the target of 20-30 companies per niche.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
