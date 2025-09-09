import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a market analysis report
export const createMarketReport = mutation({
  args: {
    title: v.string(),
    industry: v.string(),
    sector: v.string(),
    summary: v.string(),
    keyFindings: v.array(v.string()),
    recommendations: v.array(v.string()),
    companiesAnalyzed: v.array(v.id("companies")),
  },
  returns: v.id("marketReports"),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to create market reports");
    }

    return await ctx.db.insert("marketReports", {
      ...args,
      createdBy: user._id,
      reportDate: Date.now(),
    });
  },
});

// Get market reports
export const getMarketReports = query({
  args: {
    industry: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("marketReports"),
    _creationTime: v.number(),
    title: v.string(),
    industry: v.string(),
    sector: v.string(),
    summary: v.string(),
    keyFindings: v.array(v.string()),
    recommendations: v.array(v.string()),
    companiesAnalyzed: v.array(v.id("companies")),
    createdBy: v.id("users"),
    reportDate: v.number(),
  })),
  handler: async (ctx, args) => {
    if (args.industry) {
      return await ctx.db
        .query("marketReports")
        .withIndex("by_industry", (q) => q.eq("industry", args.industry!))
        .order("desc")
        .take(args.limit || 20);
    } else {
      return await ctx.db
        .query("marketReports")
        .order("desc")
        .take(args.limit || 20);
    }
  },
});

// Generate acquisition targets analysis
export const generateAcquisitionTargets = query({
  args: {
    industry: v.optional(v.string()),
    minScore: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("companies"),
    _creationTime: v.number(),
    name: v.string(),
    industry: v.string(),
    sector: v.string(),
    acquisitionSuitability: v.optional(v.number()),
    investmentPotential: v.optional(v.number()),
    totalFunding: v.optional(v.number()),
    growthRate: v.optional(v.number()),
    headcount: v.optional(v.number()),
    yearFounded: v.optional(v.number()),
    keyTechnologies: v.optional(v.array(v.string())),
    competitivePosition: v.optional(v.string()),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    fundingStage: v.optional(v.string()),
    revenue: v.optional(v.number()),
    employeeGrowthRate: v.optional(v.number()),
    patents: v.optional(v.number()),
    technicalDifferentiators: v.optional(v.array(v.string())),
    lastUpdated: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
  })),
  handler: async (ctx, args) => {
    let companies;
    
    if (args.industry) {
      companies = await ctx.db
        .query("companies")
        .withIndex("by_industry", (q) => q.eq("industry", args.industry!))
        .collect();
    } else {
      companies = await ctx.db.query("companies").collect();
    }
    
    // Filter and sort by acquisition suitability
    return companies
      .filter(company => {
        const score = company.acquisitionSuitability || 0;
        return score >= (args.minScore || 5);
      })
      .sort((a, b) => (b.acquisitionSuitability || 0) - (a.acquisitionSuitability || 0))
      .slice(0, 20);
  },
});

// Get competitive landscape analysis
export const getCompetitiveLandscape = query({
  args: {
    industry: v.string(),
  },
  returns: v.object({
    leaders: v.array(v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      name: v.string(),
      totalFunding: v.optional(v.number()),
      headcount: v.optional(v.number()),
      keyTechnologies: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      location: v.optional(v.string()),
      yearFounded: v.optional(v.number()),
      sector: v.string(),
      fundingStage: v.optional(v.string()),
      revenue: v.optional(v.number()),
      growthRate: v.optional(v.number()),
      employeeGrowthRate: v.optional(v.number()),
      competitivePosition: v.optional(v.string()),
      acquisitionSuitability: v.optional(v.number()),
      investmentPotential: v.optional(v.number()),
      patents: v.optional(v.number()),
      technicalDifferentiators: v.optional(v.array(v.string())),
      lastUpdated: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      industry: v.string(),
    })),
    challengers: v.array(v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      name: v.string(),
      totalFunding: v.optional(v.number()),
      headcount: v.optional(v.number()),
      keyTechnologies: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      location: v.optional(v.string()),
      yearFounded: v.optional(v.number()),
      sector: v.string(),
      fundingStage: v.optional(v.string()),
      revenue: v.optional(v.number()),
      growthRate: v.optional(v.number()),
      employeeGrowthRate: v.optional(v.number()),
      competitivePosition: v.optional(v.string()),
      acquisitionSuitability: v.optional(v.number()),
      investmentPotential: v.optional(v.number()),
      patents: v.optional(v.number()),
      technicalDifferentiators: v.optional(v.array(v.string())),
      lastUpdated: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      industry: v.string(),
    })),
    emerging: v.array(v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      name: v.string(),
      totalFunding: v.optional(v.number()),
      headcount: v.optional(v.number()),
      keyTechnologies: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      location: v.optional(v.string()),
      yearFounded: v.optional(v.number()),
      sector: v.string(),
      fundingStage: v.optional(v.string()),
      revenue: v.optional(v.number()),
      growthRate: v.optional(v.number()),
      employeeGrowthRate: v.optional(v.number()),
      competitivePosition: v.optional(v.string()),
      acquisitionSuitability: v.optional(v.number()),
      investmentPotential: v.optional(v.number()),
      patents: v.optional(v.number()),
      technicalDifferentiators: v.optional(v.array(v.string())),
      lastUpdated: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      industry: v.string(),
    })),
  }),
  handler: async (ctx, args) => {
    const companies = await ctx.db
      .query("companies")
      .withIndex("by_industry", (q) => q.eq("industry", args.industry))
      .collect();

    const leaders = companies.filter(c => c.competitivePosition === "Leader");
    const challengers = companies.filter(c => c.competitivePosition === "Challenger");
    const emerging = companies.filter(c => c.competitivePosition === "Emerging");

    return { leaders, challengers, emerging };
  },
});