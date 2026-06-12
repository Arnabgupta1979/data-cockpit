window.DEFAULT_CDS_DATA = {
  meta: {
    title: "SSG CDS Operating Dashboard",
    owner: "Arnab Gupta",
    version: "0.1 starter",
    lastUpdated: "2026-06-12",
    weeklyHoursMin: 2,
    weeklyHoursMax: 4,
    roleCharter: "The SSG CDS coordinates, informs, routes, and improves RDM support across SSG. The CDS does not replace data stewards, privacy officers, information security officers, legal counsel, or project-level responsibility."
  },
  coverage: [
    { unit: "DSS/WU", totalGroups: 21, activeDS: 17, gaps: "Philosophy chair group; Law chair group", priority: "Follow up chair holders to appoint DS" },
    { unit: "WSER", totalGroups: 12, activeDS: 0, gaps: "No active DS currently recorded", priority: "Prepare phased DS appointment plan with WSER leadership" }
  ],
  stakeholders: [
    { name: "Laura de Graaf", role: "Head, SSG Liaison Office", cadence: "Monthly for first 6 months; then bi-monthly", purpose: "Role visibility, management decisions, open risks", nextTouchpoint: "2026-06-30", notes: "Keep brief: one-page dashboard only." },
    { name: "Maria Juliana Gallego Rebellon", role: "Outgoing CDS / handover source", cadence: "Intensive during Q1 transition; then as needed", purpose: "Open cases, context, DS list, protocols", nextTouchpoint: "2026-06-20", notes: "Use focused handover questions." },
    { name: "SSG Data Stewards", role: "Core coordination constituency", cadence: "Quarterly meeting + monthly digest", purpose: "Share updates, collect recurring issues, build community", nextTouchpoint: "2026-09-15", notes: "First meeting: role boundary, routing, open issues." },
    { name: "Privacy Officers SSG", role: "Personal data / SmartPIA / GDPR routing", cadence: "Monthly or bi-monthly; ad hoc on cases", purpose: "Route and align on recurring personal-data issues", nextTouchpoint: "2026-07-10", notes: "Use privacy.SSG@wur.nl for routing." },
    { name: "Information Security route", role: "Classification / secure storage / incidents", cadence: "Bi-monthly once role is filled; interim as needed", purpose: "Route security issues and flag recurring risks", nextTouchpoint: "2026-07-15", notes: "SSG ISO vacancy: use agreed interim route." },
    { name: "WUR Library / WDCC / CDS network", role: "WUR-wide RDM coordination", cadence: "Every ~2 months", purpose: "Bring WUR updates into SSG and SSG issues into network", nextTouchpoint: "2026-08-01", notes: "One CDS must attend." },
    { name: "REC", role: "Ethics review integration", cadence: "Ad hoc; one structured follow-up in 2026", purpose: "Align DMP, SmartPIA and ethics review early", nextTouchpoint: "2026-09-30", notes: "Focus on DSS/WU REC-RDM integration." },
    { name: "TDCC Social Sciences", role: "External DS network and resources", cadence: "Invite once annually / ad hoc", purpose: "Expose DS community to TDCC support", nextTouchpoint: "2026-08-15", notes: "Consider guest slot in DS meeting." }
  ],
  routing: [
    { type: "General RDM / DMP", firstRoute: "Local data steward or data@wur.nl", cdsRole: "Guide and connect" },
    { type: "Personal data / SmartPIA / GDPR", firstRoute: "Privacy Officers via privacy.SSG@wur.nl", cdsRole: "Route; do not advise" },
    { type: "Data classification / secure storage", firstRoute: "Information Security route / IT Servicedesk if urgent", cdsRole: "Route; flag recurring issues" },
    { type: "Legal / data sharing agreement", firstRoute: "SSG Legal / Liaison Office", cdsRole: "Connect and follow up" },
    { type: "Ethics review / REC integration", firstRoute: "rec@wur.nl", cdsRole: "Encourage early DMP + SmartPIA alignment" },
    { type: "Yoda training and onboarding", firstRoute: "Yoda training contact / data@wur.nl", cdsRole: "Promote and coordinate" },
    { type: "Publishing / repository / DOI / Pure", firstRoute: "data@wur.nl / data librarians / local Pure route", cdsRole: "Share guidance; route" },
    { type: "AI tools / EU AI Act", firstRoute: "SSG Legal Counsel / AI compliance route + ISO", cdsRole: "Route and flag" },
    { type: "Unknown or cross-cutting", firstRoute: "Triage; escalate if needed", cdsRole: "Log in issue tracker" }
  ],
  tasks: [
    { id: "t-001", title: "Set up CDS working folder structure", area: "Foundation", due: "2026-06-18", status: "Open", priority: "High", estimatedHours: 0.75, notes: "Governance, DS list, communications, meetings, issue tracker." },
    { id: "t-002", title: "Map DS list and confirm coverage gaps", area: "DS coverage", due: "2026-06-24", status: "Open", priority: "High", estimatedHours: 1.0, notes: "Keep personal DS list outside GitHub and dashboard repo." },
    { id: "t-003", title: "Follow up Philosophy and Law DS appointments", area: "DS coverage", due: "2026-06-28", status: "Open", priority: "High", estimatedHours: 0.5, notes: "Prepare short reminder to chair holders." },
    { id: "t-004", title: "Contact Yoda training route for SSG schedule", area: "Training", due: "2026-07-05", status: "Open", priority: "Medium", estimatedHours: 0.5, notes: "Ask what is available for SSG groups." },
    { id: "t-005", title: "Prepare RDM Espresso #1: When do I need a DMP?", area: "Communication", due: "2026-07-20", status: "Open", priority: "Medium", estimatedHours: 1.25, notes: "One practical tip, one action, one contact." },
    { id: "t-006", title: "Prepare first SSG Data Steward meeting", area: "Meeting", due: "2026-09-01", status: "Open", priority: "Medium", estimatedHours: 1.5, notes: "Agenda: role boundary, DS map, recurring questions, tools, awareness topics." }
  ],
  issues: [
    { id: "i-001", title: "DSS/WU DM Protocol update", type: "General RDM / DMP", owner: "CDS + data@wur.nl", status: "Awaiting feedback", risk: "Medium", opened: "2026-06-01", nextAction: "Check status of feedback and capture implications for SSG dashboard." },
    { id: "i-002", title: "DSS/WU RDM Flowchart update", type: "Ethics review / REC integration", owner: "CDS", status: "In progress", risk: "Medium", opened: "2026-06-01", nextAction: "Track compliance steps and differences from WSER flowchart." },
    { id: "i-003", title: "Yoda DPIA assessment and raw personal data constraint", type: "Personal data / SmartPIA / GDPR", owner: "PO/ISO/Yoda route", status: "Follow-up needed", risk: "High", opened: "2026-06-01", nextAction: "Follow up with relevant PO/ISO/Yoda stakeholders; do not give independent privacy advice." },
    { id: "i-004", title: "WSER active DS gap", type: "General RDM / DMP", owner: "CDS + WSER leadership", status: "Open", risk: "High", opened: "2026-06-01", nextAction: "Prepare light-touch plan for DS appointment or nominated focal points." },
    { id: "i-005", title: "Permanent deletion / Teams backup uncertainty", type: "Data classification / secure storage", owner: "PO/ISO/IT route", status: "Open", risk: "High", opened: "2026-06-01", nextAction: "Keep as risk item; route technical/legal claims to PO/ISO/IT." }
  ],
  campaign: [
    { month: "June 2026", allSSG: "Introductory email: new CDS for SSG — what this means and where to get help", dataStewards: "Map DS list; identify WU/WR gaps; reminders for Philosophy and Law", status: "Planned" },
    { month: "July 2026", allSSG: "RDM Espresso #1: When do I need a Data Management Plan?", dataStewards: "Short DS survey: top 3 recurring issues; contact Yoda training and TDCC routes", status: "Planned" },
    { month: "August 2026", allSSG: "Infographic #1: Where should I store my research data?", dataStewards: "Prepare first DS meeting; confirm routing matrix", status: "Planned" },
    { month: "September 2026", allSSG: "RDM Espresso #2: Personal data — pause before you collect", dataStewards: "DS Meeting 1: introductions, routing, open issues", status: "Planned" },
    { month: "October 2026", allSSG: "Infographic #2: RDM, SmartPIA and ethics — how they connect", dataStewards: "PO/ISO check-in; issue tracker update; Yoda DPIA follow-up", status: "Planned" },
    { month: "November 2026", allSSG: "RDM Espresso #3: GenAI and research data — what WUR policy says", dataStewards: "WUR-wide CDS debrief; check storage/TAPE questions", status: "Planned" },
    { month: "December 2026", allSSG: "Infographic #3: Open, restricted or closed?", dataStewards: "DS Meeting 2: reflection and 2027 priorities; brief to Laura", status: "Planned" },
    { month: "January 2027", allSSG: "RDM Espresso #4: Teams is not an archive", dataStewards: "DS survey: top issues for 2027; PhD outreach check", status: "Planned" },
    { month: "February 2027", allSSG: "Infographic #4: Who do I contact for what?", dataStewards: "WUR-wide CDS meeting; REC integration follow-up", status: "Planned" },
    { month: "March 2027", allSSG: "RDM Espresso #5: Do not let your data leave with you", dataStewards: "DS Meeting 3: tools, Yoda, TAPE, recurring cases", status: "Planned" },
    { month: "April 2027", allSSG: "Infographic #5: Before you leave WUR: data handover checklist", dataStewards: "DS digest summary of 2026/27 activity", status: "Planned" },
    { month: "May 2027", allSSG: "Year-review message: Five RDM moments that mattered this year", dataStewards: "DS Meeting 4: annual review and year-two planning", status: "Planned" }
  ],
  templates: [
    { name: "Monthly Laura brief", content: "Dear Laura,\n\nHere is the monthly CDS update for SSG.\n\n1. What moved this month\n- \n\n2. Main recurring questions / risks\n- \n\n3. Routing and coordination\n- \n\n4. Decisions or support needed\n- \n\n5. Focus for next month\n- \n\nBest,\nArnab" },
    { name: "RDM Espresso skeleton", content: "Subject: RDM Espresso: [topic]\n\nDear colleagues,\n\nThis month’s practical RDM reminder is about [topic].\n\nThe key point: [one sentence].\n\nWhat you can do now: [one practical action].\n\nWhere to get help: [contact/route].\n\nBest,\nArnab" },
    { name: "Data Steward Digest skeleton", content: "Subject: SSG Data Steward Digest — [month]\n\nDear colleagues,\n\nA short update from the SSG CDS role.\n\n1. Main update\n- \n\n2. Recurring question or issue\n- \n\n3. Training / tools\n- \n\n4. What I need from you\n- \n\nBest,\nArnab" }
  ]
};
