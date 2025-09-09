import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";

export function AcquisitionTargets() {
  const targets = useQuery(api.marketAnalysis.generateAcquisitionTargets, {
    minScore: 6,
  });

  if (!targets || targets.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No acquisition targets found. Add companies with acquisition suitability scores to see analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {targets.slice(0, 8).map((company, index) => (
        <div key={company._id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-lg">{company.name}</h4>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{company.industry}</Badge>
                <Badge variant="secondary">{company.sector}</Badge>
                {company.competitivePosition && (
                  <Badge variant="outline">{company.competitivePosition}</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                #{index + 1}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {company.totalFunding && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    ${(company.totalFunding / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground">Funding</div>
                </div>
              </div>
            )}
            
            {company.headcount && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{company.headcount}</div>
                  <div className="text-xs text-muted-foreground">Employees</div>
                </div>
              </div>
            )}

            {company.growthRate && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{company.growthRate}%</div>
                  <div className="text-xs text-muted-foreground">Growth</div>
                </div>
              </div>
            )}

            {company.yearFounded && (
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-sm font-medium">
                    {new Date().getFullYear() - company.yearFounded}y
                  </div>
                  <div className="text-xs text-muted-foreground">Age</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Acquisition Suitability</span>
              <span className="text-sm font-bold">
                {company.acquisitionSuitability}/10
              </span>
            </div>
            <Progress 
              value={(company.acquisitionSuitability || 0) * 10} 
              className="h-2"
            />
          </div>

          {company.investmentPotential && (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Investment Potential</span>
                <span className="text-sm font-bold">
                  {company.investmentPotential}/10
                </span>
              </div>
              <Progress 
                value={company.investmentPotential * 10} 
                className="h-2"
              />
            </div>
          )}

          {company.keyTechnologies && company.keyTechnologies.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Key Technologies:</p>
              <div className="flex flex-wrap gap-1">
                {company.keyTechnologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
