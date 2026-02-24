export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  pdfUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "age-of-agentic-ai-arrived",
    title: "The Age of Agentic AI Has Arrived — And the Stakes Have Never Been Higher",
    date: "February 2026",
    category: "CEO Corner",
    excerpt: "The cybersecurity world is waking up to a new reality. Agentic AI — systems that can reason, plan, act, and adapt across multi-step workflows without waiting for human approval — has moved from buzzword to battlefield. Organizations that get it right will be the ones that built governance into the foundation, not bolted it on as an afterthought.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/9ToVRQjMdqZoBv8RKWjKzg-img-1_1771967697000_na1fn_YmxvZ19hZ2VudGljX2FpX2Fycml2ZWQ.png",
    pdfUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663028236186/NLuyxTJGNKdTszdA.pdf"
  },
  {
    id: "architectures-of-autonomy",
    title: "The Architectures of Autonomy: Visium #TruContext and the 2026 Pivot to Agentic Intelligence",
    date: "February 2026",
    category: "CEO Corner",
    excerpt: "The technological landscape of early 2026 is defined by a decisive shift from generative AI toward agentic intelligence. This comprehensive analysis explores TruContext's military pedigree, dual database innovation, and real-world deployments across critical infrastructure, smart cities, and government operations.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/9ToVRQjMdqZoBv8RKWjKzg-img-2_1771967693000_na1fn_YmxvZ19hdXRvbm9teV9hcmNoaXRlY3R1cmVz.png",
    pdfUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663028236186/nLsxsvxahfboztem.pdf"
  },
  {
    id: "human-factor-insider-threats",
    title: "The Human Factor: How Agentic AI and Graph Analytics Mitigate Insider Threats",
    date: "December 2025",
    category: "Cyber Security",
    excerpt: "Insider threats—malicious, negligent, or compromised users—remain a top cause of breaches and loss. Visium TruContext combines persistent multi-layer graph modeling with agentic AI to turn noisy user telemetry into precise, prioritized actions that stop insider incidents before they escalate.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/9ToVRQjMdqZoBv8RKWjKzg-img-3_1771967690000_na1fn_YmxvZ19pbnNpZGVyX3RocmVhdHM.png",
    pdfUrl: "/blog_human_factor.pdf"
  },
  {
    id: "chaos-to-clarity-attack-surface",
    title: "From Chaos to Clarity: Visualizing and Acting on Your Attack Surface with TruContext",
    date: "November 2025",
    category: "Cyber Security",
    excerpt: "The enterprise perimeter no longer exists. Cloud, mobile, and IoT growth have created a sprawling, dynamic attack surface full of hidden assets and fast-moving threats. TruContext transforms that chaos into operational clarity by combining multi-layer graph modeling, continuous discovery, and agentic AI.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/9ToVRQjMdqZoBv8RKWjKzg-img-4_1771967692000_na1fn_YmxvZ19hdHRhY2tfc3VyZmFjZQ.png",
    pdfUrl: "/blog_chaos_to_clarity.pdf"
  },
  {
    id: "supply-chain-risk-management",
    title: "Beyond the Breach: Agentic AI for Proactive Supply Chain Risk Management",
    date: "September 25, 2025",
    category: "Cyber Security",
    excerpt: "With supply chain attacks doubling since April 2025, organizations need more than visibility—they need autonomous intelligence that can detect, reason, and act on risk in real time. TruContext's agentic AI transforms supply chain security from reactive to proactive.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/9ToVRQjMdqZoBv8RKWjKzg-img-5_1771967696000_na1fn_YmxvZ19zdXBwbHlfY2hhaW4.png",
    pdfUrl: "/blog_beyond_breach.pdf"
  },
  {
    id: "ransomware-2-0-multi-extortion",
    title: "Ransomware 2.0: Fighting Multi-Extortion Attacks with Predictive, Agentic AI",
    date: "September 2025",
    category: "Cyber Security",
    excerpt: "Ransomware has evolved into multi-extortion campaigns that combine encryption, data exfiltration, and public shaming. Traditional defenses focused on recovery are no longer enough. TruContext defends with continuous attack-surface modeling, predictive analytics, and agentic AI.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/mRAvye78Ihg02nMHtC9xiz-img-1_1771967757000_na1fn_YmxvZ19yYW5zb213YXJl.png",
    pdfUrl: "/blog_ransomware.pdf"
  },
  {
    id: "campus-security-video-intelligence",
    title: "Reimagining Campus Security: Ethical AI-Driven Real-Time Video Intelligence",
    date: "December 2025",
    category: "Smart Cities",
    excerpt: "Traditional campus security systems reveal significant gaps in video surveillance coverage and real-time threat detection. TruContext and IREX ELI transform passive camera networks into proactive, real-time, ethically governed video intelligence systems.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/mRAvye78Ihg02nMHtC9xiz-img-2_1771967764000_na1fn_YmxvZ19jYW1wdXNfc2VjdXJpdHk.png",
    pdfUrl: "/blog_campus_security.pdf"
  },
  {
    id: "critical-infrastructure-state-sponsored",
    title: "Securing Critical Infrastructure in the Age of State-Sponsored Attacks",
    date: "September 5, 2025",
    category: "Cyber Security",
    excerpt: "Critical infrastructure has become a prime target for state-sponsored cyberattacks. TruContext is an agentic AI system that autonomously defends critical infrastructure by combining graph analytics with intelligent agents that continuously map, monitor, and mitigate cyber risk.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/mRAvye78Ihg02nMHtC9xiz-img-3_1771967754000_na1fn_YmxvZ19jcml0aWNhbF9pbmZyYXN0cnVjdHVyZQ.png",
    pdfUrl: "/blog_critical_infrastructure.pdf"
  },
  {
    id: "connected-city-agentic-ai",
    title: "Securing the Connected City: Agentic AI That Sees, Reasons, and Acts",
    date: "September 5, 2025",
    category: "Smart Cities",
    excerpt: "Smart cities promise safer, more efficient urban life through connected systems, but connectivity creates an exponentially larger attack surface. TruContext delivers agentic AI that continuously maps the city's digital relationships, reasons about risk, and takes timely action to prevent harm.",
    image: "https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/mRAvye78Ihg02nMHtC9xiz-img-4_1771967770000_na1fn_YmxvZ19zbWFydF9jaXR5.png",
    pdfUrl: "/blog_connected_city.pdf"
  }
];
