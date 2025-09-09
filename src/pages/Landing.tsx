import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthButton } from "@/components/auth/AuthButton";
import { 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Target, 
  Database, 
  Search,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  const handleDemo = () => {
    navigate("/demo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold">ReScoped</span>
          </Link>
          <AuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Market Research &{" "}
            <span className="text-primary">Deal Sourcing</span>{" "}
            Automation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build comprehensive databases of companies in your target niches, 
            analyze market opportunities, and identify the best acquisition and investment targets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton 
              trigger={
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            <Button variant="outline" size="lg" onClick={handleDemo}>
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Market Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From data collection to analysis, we provide the tools to make informed investment decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: "Company Database",
              description: "Store comprehensive data on 20-30 companies per niche including funding, growth metrics, and technical differentiators."
            },
            {
              icon: Search,
              title: "Data Collection",
              description: "Automated web scraping and API integrations with Crunchbase, LinkedIn, and other data sources."
            },
            {
              icon: BarChart3,
              title: "Market Analysis",
              description: "Visualize funding stages, growth patterns, and competitive landscapes with interactive charts."
            },
            {
              icon: Target,
              title: "Deal Sourcing",
              description: "Identify promising acquisition targets and investment opportunities based on growth and tech edge."
            },
            {
              icon: TrendingUp,
              title: "Growth Tracking",
              description: "Monitor revenue growth, employee growth, and funding progression over time."
            },
            {
              icon: Building2,
              title: "Industry Mapping",
              description: "Interactive market maps showing relationships, partnerships, and competitive positioning."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Perfect for Multiple Use Cases
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Venture Capital</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Track emerging startups in target sectors",
                    "Analyze funding patterns and valuations",
                    "Identify investment opportunities early",
                    "Monitor portfolio company competitors"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Corporate Development</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Source acquisition targets systematically",
                    "Analyze competitive landscape",
                    "Track technology trends and IP",
                    "Generate SWOT analyses for targets"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Market Intelligence
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the platform that's transforming how professionals approach market research and deal sourcing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton 
              trigger={
                <Button size="lg" className="gap-2">
                  Get Started Today <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            <Button variant="outline" size="lg" onClick={handleDemo}>
              Try Demo First
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="font-semibold">ReScoped</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2024 ReScoped. Built for market intelligence professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}