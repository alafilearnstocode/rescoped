import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, MapPin, Calendar, Users, DollarSign, ExternalLink, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function CompanyList() {
  const [industryFilter, setIndustryFilter] = useState<string>("__ALL__");
  const [sectorFilter, setSectorFilter] = useState<string>("__ALL__");
  const [searchTerm, setSearchTerm] = useState("");

  const companies = useQuery(api.companies.getCompanies, {
    industry: industryFilter === "__ALL__" ? undefined : industryFilter,
    sector: sectorFilter === "__ALL__" ? undefined : sectorFilter,
    limit: 50,
  });

  const deleteCompany = useMutation(api.companies.deleteCompany);

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const industries = [...new Set(companies?.map(c => c.industry) || [])];
  const sectors = [...new Set(companies?.map(c => c.sector) || [])];

  const handleDeleteCompany = async (companyId: Id<"companies">, companyName: string) => {
    try {
      await deleteCompany({ id: companyId });
      toast(`${companyName} has been deleted successfully.`);
    } catch (error) {
      toast("Failed to delete company. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Sectors</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {company.description || "No description available"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {company.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(company.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Company</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <strong>{company.name}</strong>? 
                            This action cannot be undone and will permanently remove all company data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCompany(company._id, company.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Company
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{company.industry}</Badge>
                  <Badge variant="outline">{company.sector}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {company.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </div>
                  )}
                  
                  {company.yearFounded && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Founded {company.yearFounded}
                    </div>
                  )}
                  
                  {company.headcount && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {company.headcount} employees
                    </div>
                  )}
                  
                  {company.totalFunding && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      ${(company.totalFunding / 1000000).toFixed(1)}M funding
                    </div>
                  )}

                  {company.fundingStage && (
                    <Badge variant="outline" className="w-fit">
                      {company.fundingStage}
                    </Badge>
                  )}

                  {company.keyTechnologies && company.keyTechnologies.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Key Technologies:</p>
                      <div className="flex flex-wrap gap-1">
                        {company.keyTechnologies.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {company.keyTechnologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{company.keyTechnologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {(company.acquisitionSuitability || company.investmentPotential) && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        {company.acquisitionSuitability && (
                          <span>
                            Acquisition: <strong>{company.acquisitionSuitability}/10</strong>
                          </span>
                        )}
                        {company.investmentPotential && (
                          <span>
                            Investment: <strong>{company.investmentPotential}/10</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No companies found. Try adjusting your filters or add some companies to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}