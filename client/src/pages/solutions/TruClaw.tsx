import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Shield, AlertTriangle, Eye, Lock, Zap, Network, 
  TrendingUp, CheckCircle2, AlertCircle, GitBranch, Database, Layers
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import ArqenCommandDemo from "@/components/TruClawDemo";
import AgentGraphVisualization from "@/components/AgentGraphVisualization";

export default function ArqenCommand() {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Arqen Command™ AI Agent Governance | Agentic AI Security | Tyvanto"
        description="Arqen Command™ is Tyvanto's agentic AI governance and control layer within Arqen™. Stop Shadow AI, prevent autonomous agent exploitation, and enforce zero-trust for every AI agent across your enterprise."
        canonicalUrl="https://www.tyvanto.com/solutions/truclaw"
      />

      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">New — AI Governance Module</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="text-primary">Arqen Command™</span> Govern Every AI Agent.<br />Stop Every Shadow Agent.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Arqen Command™ is Tyvanto's agentic AI governance and control layer — built into Arqen™ — that monitors, constrains, and governs autonomous AI agents in real time, closing the attack surface opened by tools like OpenClaw and other open-source agentic frameworks before they can exploit your environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/platform">
                <Button size="lg" variant="outline">
                  Explore Arqen Platform
                </Button>
              </Link>
            </div>

            {/* Threat Banner */}
            <div className="bg-orange-50 border-l-4 border-l-orange-500 p-6 rounded-lg max-w-2xl mx-auto text-left">
              <div className="flex gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-orange-900 mb-2">The OpenClaw / Shadow AI Threat Is Real</h3>
                  <p className="text-orange-800">
                    Open-source agentic frameworks like <strong>OpenClaw (Clawdbot / Moltbot)</strong> enable autonomous AI agents to chain actions, execute code, traverse networks, and exfiltrate data — entirely outside traditional security controls. Conventional SIEMs are blind to agent-level behavior. Arqen Command was built to close that gap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Security Stack Wasn't Built for <span className="text-primary">AI Agents</span></h2>
            <p className="text-xl text-gray-600">
              Agentic AI introduces a category of threat that firewalls, EDR, and SIEM platforms were never designed to address. Every autonomous agent is a potential vector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🕵️</div>
                <h3 className="text-lg font-bold mb-2">Shadow AI Proliferation</h3>
                <p className="text-gray-600">Unauthorized AI agents and open-source agentic frameworks (OpenClaw, AutoGPT, LangChain-based tools) deploy undetected inside enterprise environments with no governance in place.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">💉</div>
                <h3 className="text-lg font-bold mb-2">Prompt Injection Attacks</h3>
                <p className="text-gray-600">Adversaries embed malicious instructions into documents, emails, and data feeds that hijack trusted AI agents, redirecting them to exfiltrate data or execute unauthorized commands.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🔓</div>
                <h3 className="text-lg font-bold mb-2">Unbounded Agent Privileges</h3>
                <p className="text-gray-600">Most organizations deploy AI agents with over-provisioned permissions. A single compromised agent can traverse networks, escalate privileges, and access sensitive systems laterally.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🔗</div>
                <h3 className="text-lg font-bold mb-2">Multi-Agent Chain Attacks</h3>
                <p className="text-gray-600">Sophisticated threat actors exploit agent-to-agent trust relationships, turning legitimate orchestration pipelines into attack chains that are invisible to traditional monitoring tools.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="text-lg font-bold mb-2">AI Supply Chain Risk</h3>
                <p className="text-gray-600">Malicious or tampered AI models, plugins, and toolchains introduce backdoors and poisoned instructions at the source, bypassing runtime security entirely.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-lg font-bold mb-2">Zero Audit Trail</h3>
                <p className="text-gray-600">When an AI agent acts — querying a database, calling an API, writing code — most organizations have no record of what it did, why, or with what authorization. Compliance becomes impossible.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is Arqen Command Section */}
      <section className="py-16 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Arqen Command™: <span className="text-primary">Agentic AI Governance</span> Inside Arqen™</h2>
            <p className="text-xl text-gray-600">
              Arqen Command is the AI governance and control layer within the Arqen™ platform — sitting between your AI agents and enterprise systems to enforce policy, log every action, and terminate unauthorized behavior in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Built on Arqen's patented dual-database architecture and an independent research organization graph intelligence heritage, Arqen Command extends graph-based threat intelligence to the agent layer — mapping AI agent relationships, permissions, actions, and dependencies the same way Arqen maps network threats.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Arqen Command integrates directly with Tyvanto's <strong>ELI (Ethical Layered Intelligence)</strong> framework to enforce configurable governance policies — giving security teams full, explainable control over every AI agent operating inside or adjacent to their environment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">an independent research organization ATLAS Aligned</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">Zero Trust for AI</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">ELI Integration</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">NIST AI RMF</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">Real-Time Enforcement</span>
              </div>
            </div>

            <Card className="bg-white border-2 border-primary/20">
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-6 text-gray-900">Arqen™ Platform Stack</h3>
                <div className="space-y-3">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm font-semibold text-gray-900">
                    🌐 External AI Agents / User Requests
                  </div>
                  <div className="text-center text-gray-400 text-xs">intercepted & analyzed</div>
                  <div className="bg-primary/20 border-2 border-primary rounded-lg p-3 text-sm font-semibold text-gray-900">
                    🦀 Arqen Command™ — AI Governance & Control Layer
                  </div>
                  <div className="text-center text-gray-400 text-xs">policy enforced via ELI</div>
                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 text-sm font-semibold text-gray-900">
                    🧠 ELI — Ethical Layered Intelligence
                  </div>
                  <div className="text-center text-gray-400 text-xs">context-enriched by Arqen</div>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm font-semibold text-gray-900">
                    📊 Arqen™ Graph + Relational DB Engine
                  </div>
                  <div className="text-center text-gray-400 text-xs">isolated & logged</div>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm font-semibold text-gray-900">
                    🏢 Enterprise Systems, APIs & Data
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Six Pillars of <span className="text-primary">AI Agent Governance</span></h2>
            <p className="text-xl text-gray-600">
              Arqen Command combines real-time monitoring, policy enforcement, and graph-based intelligence to give security teams unprecedented control over the agentic AI layer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <Eye className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Agent Behavior Monitoring</h3>
                <p className="text-gray-600">Continuous, real-time visibility into every AI agent action — API calls, data access, code execution, inter-agent communications — with full explainable audit trails. No agent action goes unrecorded.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Prompt Injection Defense</h3>
                <p className="text-gray-600">Arqen Command inspects all inputs to trusted AI agents in real time, detecting and blocking adversarial prompt injections before they redirect agent behavior — protecting both internal and externally-facing agents.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <AlertCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Shadow AI Detection</h3>
                <p className="text-gray-600">Automatically discovers unauthorized AI agents, open-source frameworks, and unsanctioned LLM integrations operating inside your network perimeter, surfacing Shadow AI that bypasses procurement controls.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Lock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Zero Trust Agent Policy</h3>
                <p className="text-gray-600">Enforce least-privilege for every AI agent. Arqen Command maps each agent's declared scope against actual behavior, flagging privilege creep and automatically quarantining agents that exceed authorization boundaries.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Database className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">AI Supply Chain Integrity</h3>
                <p className="text-gray-600">Validate the provenance, integrity, and version history of every AI model, plugin, and tool in your agent ecosystem. Detect tampered models and poisoned toolchains before they execute in your environment.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Network className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Multi-Agent Graph Mapping</h3>
                <p className="text-gray-600">Leveraging Arqen's graph database, Arqen Command visualizes trust relationships and communication patterns between AI agents — exposing lateral movement paths, rogue orchestration chains, and multi-agent attack progressions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">From Agent Discovery to <span className="text-primary">Real-Time Enforcement</span></h2>
            <p className="text-xl text-gray-600">
              Arqen Command operates in four continuous phases, building a living map of your AI agent ecosystem and enforcing governance policy at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { num: 1, title: "Discover & Inventory", desc: "Arqen Command scans your environment — cloud, on-prem, and hybrid — to build a complete inventory of all AI agents, LLM integrations, and agentic frameworks, authorized or otherwise." },
                { num: 2, title: "Map & Contextualize", desc: "Using Arqen's graph engine, Arqen Command maps each agent's permission scope, data access patterns, tool dependencies, and inter-agent relationships — giving you a complete picture of your agentic attack surface." },
                { num: 3, title: "Monitor & Detect", desc: "Every agent action is compared against its baseline and policy in real time. Arqen Command detects anomalies — unusual data access, privilege escalation, prompt injection indicators, and unauthorized tool use — as they occur." },
                { num: 4, title: "Enforce & Respond", desc: "When policy violations are detected, Arqen Command — guided by ELI governance rules — can alert, throttle, redirect, or quarantine the offending agent autonomously, with full documentation for compliance and incident response." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-white border-2 border-primary/20 h-fit">
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-6 text-gray-900">Arqen Command Detection Coverage</h3>
                <div className="space-y-4">
                  {[
                    { label: "Prompt Injection Detection", value: "99%" },
                    { label: "Shadow AI Discovery", value: "100%" },
                    { label: "Privilege Creep Detection", value: "97%" },
                    { label: "Multi-Agent Chain Detection", value: "95%" },
                    { label: "Supply Chain Integrity Checks", value: "100%" }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-bold text-primary">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: item.value }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">&lt;1s</div>
                    <div className="text-xs text-gray-600">Detection Latency</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-xs text-gray-600">Unlogged Agent Actions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">See Arqen Command in Action</h2>
            <p className="text-xl text-gray-600">
              Watch how Arqen Command discovers shadow AI agents, visualizes their relationships, and enforces governance policies in real time.
            </p>
          </div>
          <ArqenCommandDemo />
        </div>
      </section>

      {/* Agent Graph Visualization */}
      <section className="py-16 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">AI Agent Relationship Mapping</h2>
            <p className="text-xl text-gray-600">
              Arqen Command visualizes the complex relationships and communication patterns between AI agents, exposing lateral movement paths and multi-agent attack chains.
            </p>
          </div>
          <AgentGraphVisualization />
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Measurable AI Governance <span className="text-primary">From Day One</span></h2>
            <p className="text-xl text-gray-600">
              Most customers achieve full AI agent inventory and active policy enforcement within the first 30 days of Arqen Command deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "100%", label: "Agent Action Visibility", desc: "Every AI agent action logged, contextualized, and auditable" },
              { value: "<1s", label: "Policy Enforcement Latency", desc: "Real-time governance with sub-second response to violations" },
              { value: "90%", label: "Reduction in Shadow AI Risk", desc: "Unauthorized agentic frameworks discovered and governed on first scan" },
              { value: "30 Days", label: "Time to Full Governance", desc: "Complete agent inventory, policy baseline, and active enforcement" }
            ].map((metric, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{metric.label}</h3>
                  <p className="text-sm text-gray-600">{metric.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">No Other Platform Governs <span className="text-primary">AI Agents Like This</span></h2>
            <p className="text-xl text-gray-600">
              Existing security tools were built before autonomous AI agents existed. Arqen Command is built for the agentic AI era — purpose-designed from the ground up.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-4 font-bold text-gray-900">Capability</th>
                  <th className="text-left p-4 font-bold text-primary">Arqen Command™ (Tyvanto)</th>
                  <th className="text-left p-4 font-bold text-gray-900">Traditional SIEM</th>
                  <th className="text-left p-4 font-bold text-gray-900">Generic AI Security Tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cap: "Shadow AI Agent Discovery", tc: "✓ Automated, real-time", siem: "✗ Not designed for agents", generic: "✗ Limited to known vendors" },
                  { cap: "Prompt Injection Detection", tc: "✓ Real-time interception", siem: "✗ Not applicable", generic: "⚠️ Partial coverage only" },
                  { cap: "Agent Privilege Enforcement", tc: "✓ Zero Trust per agent", siem: "✗ Network-level only", generic: "⚠️ Policy definition only" },
                  { cap: "Multi-Agent Chain Visualization", tc: "✓ Graph-based mapping", siem: "✗ No agent awareness", generic: "✗ Single-agent only" },
                  { cap: "AI Supply Chain Integrity", tc: "✓ Model + plugin validation", siem: "✗ Not applicable", generic: "⚠️ Vendor-specific only" },
                  { cap: "Explainable AI Governance", tc: "✓ Full audit trail via ELI", siem: "⚠️ Log-based, no context", generic: "⚠️ Black-box decisions" },
                  { cap: "an independent research organization ATLAS Alignment", tc: "✓ Native integration", siem: "✗ an independent research organization ATT&CK only", generic: "✗ Not aligned" },
                  { cap: "Real-Time Autonomous Response", tc: "✓ Quarantine, throttle, alert", siem: "⚠️ Alert only", generic: "⚠️ Alert only" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-900">{row.cap}</td>
                    <td className="p-4 text-primary font-semibold">{row.tc}</td>
                    <td className="p-4 text-gray-600">{row.siem}</td>
                    <td className="p-4 text-gray-600">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Arqen Command Across <span className="text-primary">Every Industry</span></h2>
            <p className="text-xl text-gray-600">
              Wherever autonomous AI agents operate, Arqen Command provides the governance layer that keeps them within sanctioned boundaries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏛️", title: "Government & Defense", desc: "Enforce strict governance over AI agents operating in classified or sensitive environments, with an independent research organization ATLAS-aligned detection and full FedRAMP-ready audit trails." },
              { icon: "🏥", title: "Healthcare", desc: "Control AI agents accessing EHR systems and patient data. Prevent unauthorized data exfiltration and enforce HIPAA-compliant agent permissions in clinical AI deployments." },
              { icon: "🏦", title: "Financial Services", desc: "Govern AI trading agents, fraud detection models, and customer-facing LLMs. Detect prompt injection attempts targeting financial AI and enforce SOC 2-aligned agent policies." },
              { icon: "⚡", title: "Critical Infrastructure", desc: "Protect OT/ICS environments from AI agents operating beyond their sanctioned scope. Graph-map agent relationships to SCADA systems to detect and prevent cross-domain lateral movement." },
              { icon: "🏙️", title: "Smart Cities", desc: "Govern hundreds of concurrent AI agents managing cameras, sensors, traffic systems, and public safety platforms. Ensure no single rogue agent can affect city-wide operations." },
              { icon: "🔬", title: "Enterprise R&D", desc: "Control internal AI coding agents, research assistants, and automation tools. Prevent IP exfiltration, enforce data residency policies, and maintain full audit trails for compliance." }
            ].map((useCase, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">{useCase.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm">{useCase.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Govern Your AI Agents?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Schedule a demo to see how Arqen Command protects your enterprise from autonomous AI threats.
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
