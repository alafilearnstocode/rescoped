import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new company
export const createCompany = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    yearFounded: v.optional(v.number()),
    headcount: v.optional(v.number()),
    industry: v.string(),
    sector: v.string(),
    fundingStage: v.optional(v.string()),
    totalFunding: v.optional(v.number()),
    revenue: v.optional(v.number()),
    keyTechnologies: v.optional(v.array(v.string())),
  },
  returns: v.id("companies"),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to create companies");
    }

    return await ctx.db.insert("companies", {
      ...args,
      createdBy: user._id,
      lastUpdated: Date.now(),
    });
  },
});

// Get all companies with optional filtering
export const getCompanies = query({
  args: {
    industry: v.optional(v.string()),
    sector: v.optional(v.string()),
    fundingStage: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("companies"),
    _creationTime: v.number(),
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    yearFounded: v.optional(v.number()),
    headcount: v.optional(v.number()),
    industry: v.string(),
    sector: v.string(),
    fundingStage: v.optional(v.string()),
    totalFunding: v.optional(v.number()),
    revenue: v.optional(v.number()),
    growthRate: v.optional(v.number()),
    employeeGrowthRate: v.optional(v.number()),
    keyTechnologies: v.optional(v.array(v.string())),
    competitivePosition: v.optional(v.string()),
    acquisitionSuitability: v.optional(v.number()),
    investmentPotential: v.optional(v.number()),
    technicalDifferentiators: v.optional(v.array(v.string())),
    patents: v.optional(v.number()),
    lastUpdated: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
  })),
  handler: async (ctx, args) => {
    if (args.industry) {
      const companies = await ctx.db
        .query("companies")
        .withIndex("by_industry", (q) => q.eq("industry", args.industry!))
        .take(args.limit || 50);
      return companies;
    } else if (args.sector) {
      const companies = await ctx.db
        .query("companies")
        .withIndex("by_sector", (q) => q.eq("sector", args.sector!))
        .take(args.limit || 50);
      return companies;
    } else if (args.fundingStage) {
      const companies = await ctx.db
        .query("companies")
        .withIndex("by_funding_stage", (q) => q.eq("fundingStage", args.fundingStage!))
        .take(args.limit || 50);
      return companies;
    } else {
      const companies = await ctx.db
        .query("companies")
        .take(args.limit || 50);
      return companies;
    }
  },
});

// Get a single company by ID
export const getCompany = query({
  args: { id: v.id("companies") },
  returns: v.union(
    v.object({
      _id: v.id("companies"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      location: v.optional(v.string()),
      yearFounded: v.optional(v.number()),
      headcount: v.optional(v.number()),
      industry: v.string(),
      sector: v.string(),
      fundingStage: v.optional(v.string()),
      totalFunding: v.optional(v.number()),
      revenue: v.optional(v.number()),
      growthRate: v.optional(v.number()),
      keyTechnologies: v.optional(v.array(v.string())),
      competitivePosition: v.optional(v.string()),
      acquisitionSuitability: v.optional(v.number()),
      investmentPotential: v.optional(v.number()),
      technicalDifferentiators: v.optional(v.array(v.string())),
      patents: v.optional(v.number()),
      lastUpdated: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update company information
export const updateCompany = mutation({
  args: {
    id: v.id("companies"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    yearFounded: v.optional(v.number()),
    headcount: v.optional(v.number()),
    industry: v.optional(v.string()),
    sector: v.optional(v.string()),
    fundingStage: v.optional(v.string()),
    totalFunding: v.optional(v.number()),
    revenue: v.optional(v.number()),
    growthRate: v.optional(v.number()),
    keyTechnologies: v.optional(v.array(v.string())),
    competitivePosition: v.optional(v.string()),
    acquisitionSuitability: v.optional(v.number()),
    investmentPotential: v.optional(v.number()),
    technicalDifferentiators: v.optional(v.array(v.string())),
    patents: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to update companies");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      lastUpdated: Date.now(),
    });
    return null;
  },
});

// Delete a company
export const deleteCompany = mutation({
  args: { id: v.id("companies") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to delete companies");
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

// Get industry statistics
export const getIndustryStats = query({
  args: {},
  returns: v.object({
    totalCompanies: v.number(),
    industriesCount: v.any(),
    sectorsCount: v.any(),
    fundingStagesCount: v.any(),
    averageFunding: v.optional(v.number()),
    topIndustries: v.array(v.object({
      industry: v.string(),
      count: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    
    const industriesCount: Record<string, number> = {};
    const sectorsCount: Record<string, number> = {};
    const fundingStagesCount: Record<string, number> = {};
    let totalFunding = 0;
    let fundingCount = 0;

    companies.forEach(company => {
      industriesCount[company.industry] = (industriesCount[company.industry] || 0) + 1;
      sectorsCount[company.sector] = (sectorsCount[company.sector] || 0) + 1;
      
      if (company.fundingStage) {
        fundingStagesCount[company.fundingStage] = (fundingStagesCount[company.fundingStage] || 0) + 1;
      }
      
      if (company.totalFunding) {
        totalFunding += company.totalFunding;
        fundingCount++;
      }
    });

    const topIndustries = Object.entries(industriesCount)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalCompanies: companies.length,
      industriesCount,
      sectorsCount,
      fundingStagesCount,
      averageFunding: fundingCount > 0 ? totalFunding / fundingCount : undefined,
      topIndustries,
    };
  },
});

// Create demo data for testing
export const createDemoData = mutation({
  args: {},
  returns: v.object({
    companiesCreated: v.number(),
    message: v.string(),
    totalCompanies: v.number(),
  }),
  handler: async (ctx) => {
    // Get current user if authenticated, but don't require it for demo
    const user = await getCurrentUser(ctx);

    // Check if demo companies already exist by looking for specific demo company names
    const existingDemoCompanies = await ctx.db
      .query("companies")
      .filter((q) => q.or(
        q.eq(q.field("name"), "NeuralFlow AI"),
        q.eq(q.field("name"), "DataMind Corp"),
        q.eq(q.field("name"), "ConnectEdge Systems")
      ))
      .collect();

    if (existingDemoCompanies.length > 0) {
      const allCompanies = await ctx.db.query("companies").collect();
      return {
        companiesCreated: 0,
        message: "Demo companies already exist",
        totalCompanies: allCompanies.length,
      };
    }

    const demoCompanies = [
      // AI Startups
      {
        name: "NeuralFlow AI",
        description: "Advanced neural network optimization for edge computing devices",
        website: "https://neuralflow.ai",
        location: "San Francisco, CA",
        yearFounded: 2021,
        headcount: 45,
        industry: "AI",
        sector: "Software",
        fundingStage: "Series A",
        totalFunding: 12000000,
        revenue: 2500000,
        growthRate: 180,
        employeeGrowthRate: 120,
        keyTechnologies: ["Neural Networks", "Edge Computing", "TensorFlow", "CUDA"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 8,
        investmentPotential: 9,
        patents: 3,
        technicalDifferentiators: ["Proprietary neural compression", "Real-time optimization"],
      },
      {
        name: "DataMind Corp",
        description: "Enterprise AI platform for predictive analytics and automation",
        website: "https://datamind.com",
        location: "Boston, MA",
        yearFounded: 2019,
        headcount: 120,
        industry: "AI",
        sector: "Platform",
        fundingStage: "Series B",
        totalFunding: 35000000,
        revenue: 8500000,
        growthRate: 145,
        employeeGrowthRate: 85,
        keyTechnologies: ["Machine Learning", "AutoML", "Python", "Kubernetes"],
        competitivePosition: "Challenger",
        acquisitionSuitability: 7,
        investmentPotential: 8,
        patents: 8,
        technicalDifferentiators: ["No-code ML platform", "Enterprise integration"],
      },
      // IoT Companies
      {
        name: "ConnectEdge Systems",
        description: "Industrial IoT sensors and edge computing solutions",
        website: "https://connectedge.io",
        location: "Austin, TX",
        yearFounded: 2020,
        headcount: 65,
        industry: "IoT",
        sector: "Hardware",
        fundingStage: "Series A",
        totalFunding: 18000000,
        revenue: 4200000,
        growthRate: 220,
        employeeGrowthRate: 95,
        keyTechnologies: ["LoRaWAN", "Edge Computing", "ARM Cortex", "MQTT"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 9,
        investmentPotential: 8,
        patents: 12,
        technicalDifferentiators: ["Ultra-low power design", "Mesh networking"],
      },
      {
        name: "SmartGrid Dynamics",
        description: "IoT solutions for smart grid and energy management",
        website: "https://smartgriddynamics.com",
        location: "Denver, CO",
        yearFounded: 2018,
        headcount: 85,
        industry: "IoT",
        sector: "Infrastructure",
        fundingStage: "Series B",
        totalFunding: 28000000,
        revenue: 6800000,
        growthRate: 165,
        employeeGrowthRate: 70,
        keyTechnologies: ["Zigbee", "WiFi 6", "Time Series DB", "React"],
        competitivePosition: "Challenger",
        acquisitionSuitability: 6,
        investmentPotential: 7,
        patents: 15,
        technicalDifferentiators: ["Grid-scale optimization", "Predictive maintenance"],
      },
      // Cybersecurity
      {
        name: "SecureVault Technologies",
        description: "Zero-trust security platform for cloud-native applications",
        website: "https://securevault.tech",
        location: "Seattle, WA",
        yearFounded: 2020,
        headcount: 55,
        industry: "Cybersecurity",
        sector: "Software",
        fundingStage: "Seed",
        totalFunding: 8500000,
        revenue: 1800000,
        growthRate: 280,
        employeeGrowthRate: 140,
        keyTechnologies: ["Zero Trust", "Kubernetes", "Go", "gRPC"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 8,
        investmentPotential: 9,
        patents: 2,
        technicalDifferentiators: ["Container-native security", "Policy automation"],
      },
      {
        name: "ThreatShield AI",
        description: "AI-powered threat detection and response for enterprises",
        website: "https://threatshield.ai",
        location: "New York, NY",
        yearFounded: 2019,
        headcount: 95,
        industry: "Cybersecurity",
        sector: "Platform",
        fundingStage: "Series A",
        totalFunding: 22000000,
        revenue: 5200000,
        growthRate: 195,
        employeeGrowthRate: 110,
        keyTechnologies: ["Machine Learning", "SIEM", "Python", "Elasticsearch"],
        competitivePosition: "Challenger",
        acquisitionSuitability: 7,
        investmentPotential: 8,
        patents: 6,
        technicalDifferentiators: ["Behavioral analytics", "Real-time response"],
      },
      // Fintech
      {
        name: "PayFlow Innovations",
        description: "B2B payment infrastructure for emerging markets",
        website: "https://payflow.co",
        location: "Miami, FL",
        yearFounded: 2021,
        headcount: 35,
        industry: "Fintech",
        sector: "Infrastructure",
        fundingStage: "Seed",
        totalFunding: 6000000,
        revenue: 1200000,
        growthRate: 320,
        employeeGrowthRate: 180,
        keyTechnologies: ["Blockchain", "Node.js", "PostgreSQL", "Redis"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 9,
        investmentPotential: 9,
        patents: 1,
        technicalDifferentiators: ["Cross-border optimization", "Regulatory compliance"],
      },
      {
        name: "CreditAI Labs",
        description: "Alternative credit scoring using machine learning",
        website: "https://creditai.com",
        location: "Chicago, IL",
        yearFounded: 2020,
        headcount: 42,
        industry: "Fintech",
        sector: "Software",
        fundingStage: "Series A",
        totalFunding: 15000000,
        revenue: 3100000,
        growthRate: 240,
        employeeGrowthRate: 125,
        keyTechnologies: ["Machine Learning", "Python", "Apache Spark", "Kafka"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 8,
        investmentPotential: 8,
        patents: 4,
        technicalDifferentiators: ["Alternative data sources", "Real-time scoring"],
      },
      // Healthtech
      {
        name: "BioSense Diagnostics",
        description: "Wearable biosensors for continuous health monitoring",
        website: "https://biosense.health",
        location: "Palo Alto, CA",
        yearFounded: 2019,
        headcount: 78,
        industry: "Healthtech",
        sector: "Hardware",
        fundingStage: "Series B",
        totalFunding: 32000000,
        revenue: 7200000,
        growthRate: 175,
        employeeGrowthRate: 90,
        keyTechnologies: ["Biosensors", "Bluetooth LE", "Flutter", "TensorFlow Lite"],
        competitivePosition: "Challenger",
        acquisitionSuitability: 7,
        investmentPotential: 8,
        patents: 18,
        technicalDifferentiators: ["Non-invasive monitoring", "FDA approval"],
      },
      {
        name: "MedFlow AI",
        description: "AI-powered clinical workflow optimization for hospitals",
        website: "https://medflow.ai",
        location: "Philadelphia, PA",
        yearFounded: 2020,
        headcount: 52,
        industry: "Healthtech",
        sector: "Software",
        fundingStage: "Series A",
        totalFunding: 19000000,
        revenue: 4500000,
        growthRate: 210,
        employeeGrowthRate: 105,
        keyTechnologies: ["Natural Language Processing", "FHIR", "React", "MongoDB"],
        competitivePosition: "Emerging",
        acquisitionSuitability: 8,
        investmentPotential: 9,
        patents: 5,
        technicalDifferentiators: ["Clinical NLP", "EHR integration"],
      },
    ];

    let companiesCreated = 0;
    for (const company of demoCompanies) {
      await ctx.db.insert("companies", {
        ...company,
        createdBy: user?._id, // Optional - only set if user is authenticated
        lastUpdated: Date.now(),
      });
      companiesCreated++;
    }

    const allCompanies = await ctx.db.query("companies").collect();
    return {
      companiesCreated,
      message: `Successfully created ${companiesCreated} demo companies`,
      totalCompanies: allCompanies.length,
    };
  },
});