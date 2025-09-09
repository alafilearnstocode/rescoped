import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Companies table - core company information
    companies: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      location: v.optional(v.string()),
      yearFounded: v.optional(v.number()),
      headcount: v.optional(v.number()),
      industry: v.string(), // e.g., "IoT", "AI", "Cybersecurity"
      sector: v.string(), // e.g., "Hardware", "Software", "Services"
      fundingStage: v.optional(v.string()), // e.g., "Seed", "Series A", "Series B", etc.
      totalFunding: v.optional(v.number()),
      lastFundingDate: v.optional(v.number()),
      revenue: v.optional(v.number()),
      growthRate: v.optional(v.number()),
      employeeGrowthRate: v.optional(v.number()),
      technicalDifferentiators: v.optional(v.array(v.string())),
      patents: v.optional(v.number()),
      keyTechnologies: v.optional(v.array(v.string())),
      competitivePosition: v.optional(v.string()), // "Leader", "Challenger", "Emerging"
      acquisitionSuitability: v.optional(v.number()), // 1-10 score
      investmentPotential: v.optional(v.number()), // 1-10 score
      dataSource: v.optional(v.string()),
      lastUpdated: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
    })
      .index("by_industry", ["industry"])
      .index("by_sector", ["sector"])
      .index("by_funding_stage", ["fundingStage"])
      .index("by_created_by", ["createdBy"])
      .index("by_competitive_position", ["competitivePosition"]),

    // Funding rounds table
    fundingRounds: defineTable({
      companyId: v.id("companies"),
      roundType: v.string(), // "Seed", "Series A", etc.
      amount: v.number(),
      date: v.number(),
      leadInvestor: v.optional(v.string()),
      investors: v.optional(v.array(v.string())),
      valuation: v.optional(v.number()),
      source: v.optional(v.string()),
    }).index("by_company", ["companyId"]),

    // Investors table
    investors: defineTable({
      name: v.string(),
      type: v.string(), // "VC", "Angel", "Corporate", "Government"
      location: v.optional(v.string()),
      focusAreas: v.optional(v.array(v.string())),
      typicalCheckSize: v.optional(v.string()),
      website: v.optional(v.string()),
    }),

    // Company relationships (partnerships, competitors, etc.)
    companyRelationships: defineTable({
      companyId1: v.id("companies"),
      companyId2: v.id("companies"),
      relationshipType: v.string(), // "Partner", "Competitor", "Supplier", "Customer"
      description: v.optional(v.string()),
      strength: v.optional(v.number()), // 1-5 scale
    })
      .index("by_company1", ["companyId1"])
      .index("by_company2", ["companyId2"]),

    // Market analysis reports
    marketReports: defineTable({
      title: v.string(),
      industry: v.string(),
      sector: v.string(),
      summary: v.string(),
      keyFindings: v.array(v.string()),
      recommendations: v.array(v.string()),
      companiesAnalyzed: v.array(v.id("companies")),
      createdBy: v.id("users"),
      reportDate: v.number(),
    })
      .index("by_industry", ["industry"])
      .index("by_created_by", ["createdBy"]),

    // Data collection jobs (for tracking scraping/API calls)
    dataJobs: defineTable({
      jobType: v.string(), // "scraping", "api_call", "manual_entry"
      source: v.string(), // "crunchbase", "linkedin", "manual"
      status: v.string(), // "pending", "running", "completed", "failed"
      targetIndustry: v.optional(v.string()),
      companiesFound: v.optional(v.number()),
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      errorMessage: v.optional(v.string()),
      createdBy: v.id("users"),
    }).index("by_created_by", ["createdBy"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;