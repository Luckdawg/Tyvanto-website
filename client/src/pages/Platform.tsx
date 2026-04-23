import { Button } from "@/components/ui/button";
import Tour, { TourStep } from "@/components/Tour";
import TourButton from "@/components/TourButton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Network, Cloud, Database, Zap, Lock, Brain, Cpu } from "lucide-react";
import FollowUs from "@/components/FollowUs";
import { SchemaHead } from "@/components/SchemaHead";
import { SEOHead } from "@/components/SEOHead";
import { organizationSchema, softwareApplicationSchema, createBreadcrumbSchema, createServiceSchema } from "@/lib/schema";

export default function Platform() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://tyvanto.com" },
    { name: "Platform", url: "https://tyvanto.com/platform" }
  ]);

  const tourSteps: TourStep[] = [
    {
      target: ".platform-hero",
      title: "Arqen Platform Overview",
      content: "Explore our agentic AI-powered intelligence platform with dual database architecture that delivers unmatched performance and capabilities.",
      placement: "bottom"
    },
    {
      target: ".dual-database",
      title: "Dual Database Architecture",
      content: "Our patented architecture combines graph database for real-time relationships with relational database for persistent analytics—delivering 4x faster query performance.",
      placement: "top"
    },
    {
      target: ".agentic-ai",
      title: "Agentic AI Capabilities",
      content: "Autonomous AI agents plan and execute complex workflows without human intervention, from icon generation to multi-step threat investigations.",
      placement: "top"
    },
    {
      target: ".platform-features",
      title: "Core Platform Features",
      content: "Discover our comprehensive feature set including real-time processing, advanced analytics, video intelligence, and enterprise security.",
      placement: "top"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Arqen Platform | Agentic AI Intelligence Platform | Tyvanto"
        description="Enterprise-grade dual database architecture combining graph and relational databases. Real-time threat detection, predictive intelligence, and multi-dimensional correlation for cybersecurity and business analytics."
        canonicalUrl="https://www.tyvanto.com/platform"
      />
      <SchemaHead schema={organizationSchema} />
      <SchemaHead schema={softwareApplicationSchema} />
      <SchemaHead schema={breadcrumbSchema} />
      <Tour steps={tourSteps} tourId="platform" />
      <TourButton tourId="platform" label="Platform Tour" />
      {/* Hero Section */}
      <section className="platform-hero gradient-hero py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              The Arqen <span className="text-primary">Platform</span>
            </h1>
            <p className="text-lg md:text-xl font-bold italic text-primary mb-8">
              Arqen: From Data Chaos to Decision Confidence.
            </p>
            <p className="text-xl text-gray-600 mb-8">
              Agentic AI-powered intelligence platform with dual database architecture that transforms data into actionable insights across cyber, physical, and operational domains
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="dual-database py-8 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Dual Database Architecture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Arqen is built on a revolutionary dual database architecture combining graph database for real-time network relationships with relational database for persistent storage and analytics. This patented scalable multi-layered approach processes billions of events with joins and aggregations in real-time, providing unmatched context and performance that conventional platforms cannot match.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                originally developed for enterprise security operations, Arqen brings enterprise-grade intelligence capabilities to enterprise organizations with automatic synchronization and zero data loss.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-primary" />
                  <span className="font-semibold">graph database Graph DB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-secondary" />
                  <span className="font-semibold">relational database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Real-time Sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-secondary" />
                  <span className="font-semibold">Zero Data Loss</span>
                </div>
              </div>
            </div>

          </div>

          {/* Agentic AI Section */}
          <div className="agentic-ai bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-12">
            <div className="text-center mb-12">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Agentic AI at the Core
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Arqen features autonomous AI agents that continuously analyze threats, recommend actions, and automate workflows without human intervention. Our agentic AI capabilities set us apart as a leader in AI-driven cybersecurity solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Cpu className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Agents</h3>
                  <p className="text-gray-600">
                    Autonomous agents that analyze threats, identify patterns, and execute response workflows automatically
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-secondary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Dashboards</h3>
                  <p className="text-gray-600">
                    Intelligent dashboards that adapt to user roles and automatically surface critical insights
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Icon Generation</h3>
                  <p className="text-gray-600">
                    Dual API system with Recraft.ai and Gemini for automated icon generation and asset management
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Features */}
          <div className="platform-features grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Database className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Real-Time Processing</h3>
                <p className="text-gray-600">
                  Process billions of events in real-time with advanced joins, aggregations, and complex queries across multiple data sources using our dual database architecture
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Network className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Advanced Graph Analytics</h3>
                <p className="text-gray-600">
                  Interactive network graphs with multiple layout algorithms (Cola, ELK, Klay) and dynamic styling based on threat levels and relationships
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Kafka Ecosystem</h3>
                <p className="text-gray-600">
                  Incorporates rapid high throughput and scalable processing via the Kafka ecosystem for enterprise-scale deployments with live data synchronization
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Cloud className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Geospatial Intelligence</h3>
                <p className="text-gray-600">
                  Persistent geographic coordinate assignment with dual database storage, real-time map updates, and continuous integration capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Threat Path Analysis</h3>
                <p className="text-gray-600">
                  Comprehensive attack chain visualization and analysis with an independent research organization ATT&CK integration for threat-informed defense strategies
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Multi-View Dashboards</h3>
                <p className="text-gray-600">
                  Tailored dashboard views for Executive, SOC, Threat Analysis, Geographic Map, AI Agents, and AI-driven insights
                </p>
              </CardContent>
            </Card>
          </div>

          {/* an independent research organization Heritage */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-10">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built on Enterprise-Grade Technology
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                originally developed for enterprise security operations. This connection establishes immediate trust and validates the platform's robustness for federal agencies and critical infrastructure operators.
              </p>
              <div className="flex justify-center">
                <img 
                  src="/mitre_attack_logo.webp" 
                  alt="an independent research organization ATT&CK" 
                  className="h-16"
                />
              </div>
            </div>
          </div>

          {/* Deployment Options */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Flexible Deployment Options</h2>
            <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Cloud className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Cloud-Native SaaS</h3>
                  <p className="text-gray-600">
                    Deploy on AWS, Azure, or GCP with full scalability and managed services
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Lock className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">On-Premises</h3>
                  <p className="text-gray-600">
                    Virtual appliances for complete data control and network segmentation
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Network className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Hybrid & Edge</h3>
                  <p className="text-gray-600">
                    Hybrid deployments and edge computing for low-latency applications
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Arqen Platform Suite */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{color: '#2D7FF9'}}>ARQEN PLATFORM SUITE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Five Modules. One Unified Intelligence Platform.</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Each Arqen module is purpose-built for a specific intelligence domain, and all five work together as a single, unified operating system for your organization.</p>
            <div className="arqen-divider w-24 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Arqen Vision */}
            <div className="product-vision rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-vision" style={{background: 'rgba(123,97,255,0.12)'}}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#7B61FF" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="1" fill="#7B61FF"/></svg>
              </div>
              <div className="mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#7B61FF'}}>ARQEN</span>
                <h3 className="text-xl font-bold" style={{color: '#7B61FF'}}>VISION™</h3>
              </div>
              <p className="text-gray-500 text-sm mb-3">Video and sensor intelligence</p>
              <p className="text-gray-700 text-sm">AI-powered video analytics, multi-camera correlation, and real-time sensor fusion for physical security and situational awareness.</p>
            </div>

            {/* Arqen Sentinel */}
            <div className="product-sentinel rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-sentinel" style={{background: 'rgba(0,209,178,0.12)'}}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#00D1B2" strokeWidth={2}><path d="M12 2l7 4v6c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V6l7-4z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#00D1B2'}}>ARQEN</span>
                <h3 className="text-xl font-bold" style={{color: '#00A896'}}>SENTINEL™</h3>
              </div>
              <p className="text-gray-500 text-sm mb-3">Cyber threat detection and protection</p>
              <p className="text-gray-700 text-sm">Graph-based threat detection, NIST-compliant security analytics, and real-time cyber defense for enterprise and government environments.</p>
            </div>

            {/* Arqen Trace */}
            <div className="product-trace rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-trace" style={{background: 'rgba(255,157,0,0.12)'}}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#FF9D00" strokeWidth={2}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div className="mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#FF9D00'}}>ARQEN</span>
                <h3 className="text-xl font-bold" style={{color: '#CC7A00'}}>TRACE™</h3>
              </div>
              <p className="text-gray-500 text-sm mb-3">Supply chain, logistics and mineral tracing</p>
              <p className="text-gray-700 text-sm">End-to-end supply chain visibility, provenance tracking, and logistics intelligence with real-time anomaly detection.</p>
            </div>

            {/* Arqen Command */}
            <div className="product-command rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-command" style={{background: 'rgba(123,97,255,0.12)'}}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#7B61FF" strokeWidth={2}><polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/></svg>
              </div>
              <div className="mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#7B61FF'}}>ARQEN</span>
                <h3 className="text-xl font-bold" style={{color: '#7B61FF'}}>COMMAND™</h3>
              </div>
              <p className="text-gray-500 text-sm mb-3">Decision intelligence and agent orchestration</p>
              <p className="text-gray-700 text-sm">Autonomous AI agent governance, multi-step decision orchestration, and intelligent workflow automation across your enterprise.</p>
            </div>

            {/* Arqen Grid */}
            <div className="product-grid rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-grid" style={{background: 'rgba(45,127,249,0.12)'}}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#2D7FF9" strokeWidth={2}><circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="6" y1="6" x2="10" y2="11"/><line x1="18" y1="6" x2="14" y2="11"/><line x1="6" y1="18" x2="10" y2="13"/><line x1="18" y1="18" x2="14" y2="13"/></svg>
              </div>
              <div className="mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color: '#2D7FF9'}}>ARQEN</span>
                <h3 className="text-xl font-bold" style={{color: '#1E5FC8'}}>GRID™</h3>
              </div>
              <p className="text-gray-500 text-sm mb-3">Infrastructure and smart systems</p>
              <p className="text-gray-700 text-sm">Smart city operations, critical infrastructure monitoring, and IoT/OT network intelligence for connected urban and industrial environments.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 italic">All five modules share a unified graph database, Kafka streaming backbone, and agentic AI layer — giving you complete cross-domain intelligence in a single platform.</p>
          </div>
        </div>
      </section>

      {/* Data Sovereignty Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Data Sovereignty & Ethical Intelligence
              </h2>
              <p className="text-lg text-gray-700">
                Maintaining local control while enabling secure collaboration
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-l-primary">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Tyvanto' Arqen platform addresses data sovereignty challenges through its <span className="font-semibold">Ethical Layered Intelligence (ELI)</span> technology, which incorporates a proprietary framework designed to maintain local control over data while facilitating secure, inter-jurisdictional collaboration.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Local Data Ownership
                  </h3>
                  <p className="text-gray-700">
                    Arqen enables municipalities and other entities to retain full ownership and control of their jurisdictional data, preventing unauthorized centralization or external access.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
                    <Network className="h-6 w-6 mr-2" />
                    Granular Access Control
                  </h3>
                  <p className="text-gray-700">
                    Role-based sharing mechanisms provide granular, auditable permissions for data access based on operational needs, ensuring privacy is balanced with coordination in applications like public safety surveillance networks.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-primary mr-2" />
                  Ethical Safeguards for High-Stakes Environments
                </h3>
                <p className="text-gray-700">
                  The platform's focus on ethical safeguards, including verifiable audit trails, further supports sovereign data management in high-stakes environments such as cybersecurity and critical infrastructure, reducing risks associated with data breaches or misuse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <FollowUs />

      {/* Platform Components CTA */}
      <section className="py-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Explore Platform Capabilities</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover how Arqen's agentic AI-powered features and video intelligence transform your operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/platform/ai-capabilities">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                AI Capabilities
              </Button>
            </Link>
            <Link href="/platform/tru-insight">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Arqen Vision™ Video Intelligence
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
