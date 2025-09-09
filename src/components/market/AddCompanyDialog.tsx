import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    yearFounded: "",
    headcount: "",
    industry: "",
    sector: "",
    fundingStage: "",
    totalFunding: "",
    revenue: "",
    keyTechnologies: "",
  });

  const createCompany = useMutation(api.companies.createCompany);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCompany({
        name: formData.name,
        description: formData.description || undefined,
        website: formData.website || undefined,
        location: formData.location || undefined,
        yearFounded: formData.yearFounded ? parseInt(formData.yearFounded) : undefined,
        headcount: formData.headcount ? parseInt(formData.headcount) : undefined,
        industry: formData.industry,
        sector: formData.sector,
        fundingStage: formData.fundingStage || undefined,
        totalFunding: formData.totalFunding ? parseFloat(formData.totalFunding) * 1000000 : undefined,
        revenue: formData.revenue ? parseFloat(formData.revenue) * 1000000 : undefined,
        keyTechnologies: formData.keyTechnologies 
          ? formData.keyTechnologies.split(",").map(t => t.trim()).filter(Boolean)
          : undefined,
      });

      toast("Company added successfully!");
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        website: "",
        location: "",
        yearFounded: "",
        headcount: "",
        industry: "",
        sector: "",
        fundingStage: "",
        totalFunding: "",
        revenue: "",
        keyTechnologies: "",
      });
    } catch (error) {
      toast("Failed to add company. Please try again.");
      console.error(error);
    }
  };

  const industries = ["AI", "IoT", "Cybersecurity", "Fintech", "Healthtech", "Edtech", "Cleantech", "Other"];
  const sectors = ["Hardware", "Software", "Services", "Platform", "Infrastructure"];
  const fundingStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D+", "IPO", "Acquired"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Enter company information for market research analysis
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the company..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
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

            <div>
              <Label htmlFor="sector">Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="yearFounded">Year Founded</Label>
              <Input
                id="yearFounded"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.yearFounded}
                onChange={(e) => setFormData({ ...formData, yearFounded: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="headcount">Employee Count</Label>
              <Input
                id="headcount"
                type="number"
                min="1"
                value={formData.headcount}
                onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fundingStage">Funding Stage</Label>
              <Select value={formData.fundingStage} onValueChange={(value) => setFormData({ ...formData, fundingStage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {fundingStages.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalFunding">Total Funding (M)</Label>
              <Input
                id="totalFunding"
                type="number"
                step="0.1"
                min="0"
                placeholder="10.5"
                value={formData.totalFunding}
                onChange={(e) => setFormData({ ...formData, totalFunding: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="revenue">Annual Revenue (M)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.1"
                min="0"
                placeholder="5.2"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="keyTechnologies">Key Technologies</Label>
            <Input
              id="keyTechnologies"
              placeholder="AI, Machine Learning, IoT (comma-separated)"
              value={formData.keyTechnologies}
              onChange={(e) => setFormData({ ...formData, keyTechnologies: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.industry || !formData.sector}>
              Add Company
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
