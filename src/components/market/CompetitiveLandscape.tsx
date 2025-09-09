import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Rocket } from "lucide-react";

export function CompetitiveLandscape() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  
  const stats = useQuery(api.companies.getIndustryStats);
  const landscape = useQuery(
    api.marketAnalysis.getCompetitiveLandscape,
    selectedIndustry ? { industry: selectedIndustry } : "skip"
  );

  const industries = stats ? Object.keys(stats.industriesCount) : [];

  if (!selectedIndustry) {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Industry to Analyze:</label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Choose an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Select an industry to view competitive landscape analysis
        </div>
      </div>
    );
  }

  if (!landscape) {
    return <div>Loading competitive landscape...</div>;
  }

  const sections = [
    {
      title: "Market Leaders",
      companies: landscape.leaders,
      icon: Crown,
      description: "Established companies with strong market position",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Challengers",
      companies: landscape.challengers,
      icon: Zap,
      description: "Growing companies challenging market leaders",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Emerging Players",
      companies: landscape.emerging,
      icon: Rocket,
      description: "New entrants with innovative approaches",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Industry:</label>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className={`${section.bgColor} rounded-t-lg`}>
              <CardTitle className={`flex items-center gap-2 ${section.color}`}>
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {section.companies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No companies in this category
                </p>
              ) : (
                <div className="space-y-3">
                  {section.companies.map((company) => (
                    <div key={company._id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{company.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        {company.totalFunding && (
                          <span className="text-sm text-muted-foreground">
                            ${(company.totalFunding / 1000000).toFixed(1)}M funding
                          </span>
                        )}
                        {company.headcount && (
                          <span className="text-sm text-muted-foreground">
                            {company.headcount} employees
                          </span>
                        )}
                      </div>
                      {company.keyTechnologies && company.keyTechnologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {company.keyTechnologies.slice(0, 3).map(tech => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}