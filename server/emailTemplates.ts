export type EmailTemplate = {
  subject: string;
  body: string;
};

export type CampaignStage = "day1" | "day3" | "day7";

export function getEmailTemplate(
  stage: CampaignStage,
  leadName: string,
  leadEmail: string,
  leadCompany: string
): EmailTemplate {
  const templates: Record<CampaignStage, EmailTemplate> = {
    day1: {
      subject: `Thank you for downloading the Arqen Architecture Whitepaper`,
      body: `Hi ${leadName},

Thank you for downloading our Arqen Architecture Whitepaper! We hope you found the technical details about our patented Scalable Multi-Layered Graph Database architecture insightful.

At Visium Technologies, we're pioneering agentic AI-driven cybersecurity solutions that combine Neo4j's relationship intelligence with PostgreSQL's time-series efficiency to deliver unmatched threat detection and response capabilities.

**Additional Resources for ${leadCompany}:**

📊 **Interactive Graph Visualization Demo**
Explore how Arqen correlates threats across cyber and physical domains:
https://arqen.manus.space/resources/graph-demo

📹 **Product Demo Videos**
Watch our platform in action with real-world use cases:
https://arqen.manus.space/resources/videos

💰 **ROI Calculator**
See potential cost savings and efficiency gains for your organization:
https://arqen.manus.space/why/roi

**Ready to see Arqen in your environment?**

Schedule a personalized technical deep dive with our solutions architects:
https://arqen.manus.space/demo

We'd love to discuss how Arqen can address ${leadCompany}'s specific cybersecurity and data analytics challenges.

Best regards,

Visium Technologies Sales Team
Email: info@tyvanto.com
Phone: +1 (888) 344-9850
Website: https://arqen.manus.space

---
You're receiving this email because you downloaded the Arqen Architecture Whitepaper. If you'd prefer not to receive follow-up information, please reply to let us know.`,
    },
    day3: {
      subject: `${leadCompany} + Arqen: Real-World Success Stories`,
      body: `Hi ${leadName},

Following up on the Arqen Architecture Whitepaper you downloaded, I wanted to share some real-world examples of how organizations similar to ${leadCompany} are leveraging our platform.

**Use Case Scenarios Relevant to Your Industry:**

🏭 **Energy Grid Protection**
How Arqen could secure critical infrastructure with real-time threat correlation and predictive analytics. Our dual database architecture enables 75% faster incident investigation.
https://arqen.manus.space/why/case-studies/energy-grid

🚦 **Intelligent Transportation Systems**
Discover how Arqen may enable smart city operations with cyber-physical integration and video intelligence capabilities.
https://arqen.manus.space/why/case-studies/intelligent-transportation

🚨 **Public Safety & Emergency Response**
See how Arqen would provide unified situational awareness across multiple data sources with defense-grade provenance.
https://arqen.manus.space/why/case-studies/public-safety

**Why Organizations Choose Arqen:**

✓ **20 QPS graph query performance** vs 5 QPS traditional SIEM
✓ **90% reduction in manual analysis time** with agentic AI automation
✓ **99.97% system uptime** with enterprise-grade reliability
✓ **MITRE ATT&CK framework integration** for threat-informed defense

**Compare Arqen vs Traditional Solutions:**
https://arqen.manus.space/why/comparison

Have questions about how Arqen fits ${leadCompany}'s specific needs? I'm happy to schedule a brief call to discuss your cybersecurity and analytics challenges.

Best regards,

Visium Technologies Sales Team
Email: info@tyvanto.com
Phone: +1 (888) 344-9850

P.S. Our technical team is available for architecture discussions and proof-of-concept planning.`,
    },
    day7: {
      subject: `Last chance: Schedule your Arqen demo for ${leadCompany}`,
      body: `Hi ${leadName},

I wanted to reach out one final time regarding Arqen for ${leadCompany}.

Over the past week, you've had the opportunity to review our architecture whitepaper and explore our platform's capabilities. Many prospects at this stage are ready to see Arqen in action with their own data and use cases.

**What happens in a Arqen demo:**

1️⃣ **Discovery Session** (15 min)
   We learn about ${leadCompany}'s current cybersecurity stack, pain points, and objectives

2️⃣ **Live Platform Walkthrough** (30 min)
   See real-time threat correlation, graph analytics, and agentic AI automation in action

3️⃣ **Custom Use Case Discussion** (15 min)
   Explore how Arqen addresses your specific challenges with our dual database architecture

4️⃣ **ROI Analysis** (10 min)
   Review potential cost savings and efficiency gains based on your environment

**Schedule Your Personalized Demo:**
https://arqen.manus.space/demo

**Quick Stats That Matter:**

• **30 days** average time to actionable insights
• **$10,000** minimum monthly investment (scales with node count)
• **100,000+ events/second** throughput capacity
• **1,200+ video streams** simultaneous processing

**Not ready for a demo yet?**

No problem! Feel free to explore more resources at your own pace:

📚 Platform Overview: https://arqen.manus.space/platform
🎯 Industry Solutions: https://arqen.manus.space/solutions
💡 Why Arqen: https://arqen.manus.space/why/advantages

If you have any questions or would like to discuss Arqen further, I'm just an email or phone call away.

Best regards,

Visium Technologies Sales Team
Email: info@tyvanto.com
Phone: +1 (888) 344-9850
Website: https://arqen.manus.space

---
This is our final automated follow-up. If you'd like to continue the conversation, please reach out anytime. We're here to help ${leadCompany} achieve better cybersecurity outcomes.`,
    },
  };

  return templates[stage];
}

export function getNotificationContent(
  stage: CampaignStage,
  leadName: string,
  leadEmail: string,
  leadCompany: string,
  leadId: number
): { title: string; content: string } {
  const template = getEmailTemplate(stage, leadName, leadEmail, leadCompany);
  
  const stageLabels: Record<CampaignStage, string> = {
    day1: "Day 1 Follow-Up",
    day3: "Day 3 Follow-Up",
    day7: "Day 7 Final Follow-Up",
  };

  return {
    title: `${stageLabels[stage]}: ${leadCompany} - Ready to Send`,
    content: `Time to send the ${stageLabels[stage].toLowerCase()} email to your whitepaper lead.

**Lead Information:**
- **Name:** ${leadName}
- **Email:** ${leadEmail}
- **Company:** ${leadCompany}
- **Lead ID:** ${leadId}
- **Campaign Stage:** ${stageLabels[stage]}

**Pre-Written Email Template:**

---

**To:** ${leadEmail}
**From:** info@tyvanto.com
**Subject:** ${template.subject}

${template.body}

---

**Action Required:**

1. Copy the email template above
2. Send from info@tyvanto.com to ${leadEmail}
3. Track response in your CRM system

**Quick Actions:**
- Reply to this lead: mailto:${leadEmail}
- Schedule demo: https://arqen.manus.space/demo
- View all leads: [Admin Dashboard]

This automated reminder helps you maintain consistent follow-up with high-intent prospects who downloaded technical documentation.`,
  };
}
