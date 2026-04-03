export const moduleLibrary = [
  {
    id: "smart-reporting",
    name: "Smart Reporting",
    tagline: "Report waste in seconds from a map pin.",
    desc: "Citizens can drop a pin, attach proof, and submit a clean report with GPS and image context.",
    heroDesc:
      "A map-first intake flow that captures location, image proof, category, and urgency in one smooth interaction. The system checks for duplicate reports before they hit the queue.",
    icon: "report",
    iconBg: "#E8FFF4",
    iconColor: "#0E9F6E",
    gradientCSS: "linear-gradient(135deg,#0E9F6E,#22C55E,#38BDF8)",
    stat: { value: "< 30 sec", label: "Average report time", desc: "Designed for frictionless public reporting on mobile and desktop." },
    features: [
      { name: "Map pin reporting", desc: "Click anywhere on the city map and capture the exact garbage location." },
      { name: "Photo and video proof", desc: "Attach visual evidence to improve trust and reduce false reports." },
      { name: "Auto GPS capture", desc: "Use geolocation when available and fall back to the selected map point." },
      { name: "Waste category tagging", desc: "Plastic, organic, hazardous, and e-waste categories keep triage organized." },
      { name: "Duplicate detection", desc: "The system highlights repeated submissions near the same coordinate window." },
      { name: "Mobile-friendly intake", desc: "The form is built to feel simple and fast on real phones, not just desktops." },
    ],
    personas: [
      { role: "Citizen", desc: "Report a problem in a few taps and get visibility into what happens next." },
      { role: "Community lead", desc: "Use the public feed to surface chronic hotspots and organize action." },
      { role: "Municipality", desc: "Receive structured reports instead of scattered messages across channels." },
    ],
    steps: ["Open the map", "Drop a pin and attach proof", "Submit a structured report"],
    metrics: ["< 30 sec report time", "GPS-assisted location capture", "Duplicate filter"],
    featureList: ["Map-based reporting", "Photo/video proof", "GPS and duplicate detection"],
    ctaAction: "launch live reporting across Delhi",
  },
  {
    id: "ai-triage",
    name: "AI Triage",
    tagline: "Prioritize what matters most, automatically.",
    desc: "AI classifies waste type and severity so urgent cases rise to the top immediately.",
    heroDesc:
      "Once a report lands, the triage engine estimates severity, waste type, and confidence score. That means urgent, hazardous, or high-volume reports can jump the queue before crews waste time on low-priority tasks.",
    icon: "ai",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    gradientCSS: "linear-gradient(135deg,#2563EB,#38BDF8,#0E9F6E)",
    stat: { value: "92%", label: "Classification confidence", desc: "Premium AI module for cleaner prioritization and less manual sorting." },
    features: [
      { name: "Waste type detection", desc: "Classify plastic, organic, hazardous, and e-waste from the uploaded image." },
      { name: "Severity scoring", desc: "Estimate spill size, blockage risk, and public impact from the report context." },
      { name: "Hotspot escalation", desc: "Repeated reports in the same area can be escalated automatically." },
      { name: "Confidence thresholding", desc: "Low-confidence predictions stay visible for human review." },
      { name: "Spam resistance", desc: "Duplicate and low-signal submissions are downranked before dispatch." },
      { name: "Priority labels", desc: "Turn noisy inboxes into a clean triage board for operations teams." },
    ],
    personas: [
      { role: "Operations manager", desc: "Focus on the most urgent items first without manually scanning every report." },
      { role: "AI reviewer", desc: "Audit classification results and tune thresholds over time." },
      { role: "Dispatcher", desc: "Use one score to turn many inputs into a practical action list." },
    ],
    steps: ["Analyze the upload", "Score severity and confidence", "Push the report into the right queue"],
    metrics: ["92% confidence", "Auto severity scoring", "Human-review fallback"],
    featureList: ["Image classification", "Severity scoring", "Duplicate resistance"],
    ctaAction: "activate AI triage",
  },
  {
    id: "route-optimizer",
    name: "Route Optimizer",
    tagline: "Turn dispatch into a smarter path.",
    desc: "Collection routes are reorganized by distance, priority, and traffic to cut waste and time.",
    heroDesc:
      "The optimizer blends priority, route length, and operational constraints into a practical pickup path. The goal is simple: fewer wasted kilometres, lower fuel burn, and faster pickup completion.",
    icon: "route",
    iconBg: "#FFF7E8",
    iconColor: "#D97706",
    gradientCSS: "linear-gradient(135deg,#D97706,#FACC15,#0E9F6E)",
    stat: { value: "-28%", label: "Estimated fuel waste", desc: "Route planning designed to reduce idle time and unnecessary backtracking." },
    features: [
      { name: "Priority-aware routing", desc: "Urgent and hazardous pickups can be elevated ahead of routine jobs." },
      { name: "Traffic-aware planning", desc: "Optional map APIs can keep the route aligned with live road conditions." },
      { name: "Shortest-path logic", desc: "Use Dijkstra or A* for route generation across a city graph." },
      { name: "Multi-stop optimization", desc: "Treat nearby reports as a route cluster instead of isolated tasks." },
      { name: "Estimated arrival time", desc: "Give crews and citizens a clearer picture of when cleanup happens." },
      { name: "Fuel and time summary", desc: "Show the business case for better routing in one glance." },
    ],
    personas: [
      { role: "Routing planner", desc: "Generate a route plan without manually juggling every stop." },
      { role: "Field supervisor", desc: "See the most efficient order for the day and adapt it quickly." },
      { role: "City admin", desc: "Track fuel, distance, and completion efficiency across the fleet." },
    ],
    steps: ["Collect all open jobs", "Optimize the pickup path", "Dispatch the route to the field team"],
    metrics: ["-28% fuel waste", "Traffic-aware planning", "ETA per stop"],
    featureList: ["Priority-aware routing", "A* / Dijkstra pathing", "Fuel and time estimates"],
    ctaAction: "optimize collection routes",
  },
  {
    id: "municipality-dashboard",
    name: "Municipality Dashboard",
    tagline: "One control room for city operations.",
    desc: "A live dashboard shows report status, map activity, assignments, and completion rates.",
    heroDesc:
      "The control room gives city teams a split view of live reports, route recommendations, and workload. It is designed to feel like an operations console, not a static admin panel.",
    icon: "dashboard",
    iconBg: "#F0FDF4",
    iconColor: "#15803D",
    gradientCSS: "linear-gradient(135deg,#15803D,#22C55E,#38BDF8)",
    stat: { value: "Live", label: "Status visibility", desc: "Track pending, assigned, and completed work from one dashboard." },
    features: [
      { name: "Live map layer", desc: "Reports appear on the city map with color-coded urgency states." },
      { name: "Worker assignment", desc: "Dispatch tasks to crews and keep the queue balanced." },
      { name: "Completion tracking", desc: "Close the loop with status updates and cleanup proof." },
      { name: "Response analytics", desc: "Measure average response time and backlog trends over time." },
      { name: "Hotspot insights", desc: "See where the city keeps generating repeat waste." },
      { name: "Public transparency", desc: "Expose report status to the community without overwhelming them." },
    ],
    personas: [
      { role: "Municipal officer", desc: "Monitor the city, assign crews, and keep the backlog visible." },
      { role: "Supervisor", desc: "Check status and progress without switching between spreadsheets." },
      { role: "Public viewer", desc: "Follow the cleanup journey and trust the process." },
    ],
    steps: ["Open the live board", "Assign the right crew", "Track completion and publish the update"],
    metrics: ["Live map view", "Backlog tracking", "Response analytics"],
    featureList: ["Live map", "Assignment system", "Completion tracking"],
    ctaAction: "open the city dashboard",
  },
  {
    id: "worker-panel",
    name: "Worker Panel",
    tagline: "A simple field app for crews on the move.",
    desc: "Daily route lists, navigation shortcuts, and proof-of-cleanup uploads keep the field team focused.",
    heroDesc:
      "The worker panel is intentionally minimal. It only shows what crews need in the field: today's route, navigation, task completion, and cleanup proof upload.",
    icon: "worker",
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
    gradientCSS: "linear-gradient(135deg,#6366F1,#38BDF8,#22C55E)",
    stat: { value: "Mobile-first", label: "Field readiness", desc: "Big actions, low clutter, and no admin noise." },
    features: [
      { name: "Route list", desc: "Show the day's assigned route in a clear order." },
      { name: "Navigation shortcut", desc: "Open the next stop in the user's preferred map app." },
      { name: "Mark complete", desc: "Close jobs as they are finished with one tap." },
      { name: "Cleanup proof", desc: "Upload a photo so the central dashboard can verify the cleanup." },
      { name: "Low-friction UI", desc: "Designed for crews working outdoors in motion and sunlight." },
      { name: "Shift summaries", desc: "End-of-day summaries make handoffs easier." },
    ],
    personas: [
      { role: "Truck crew", desc: "See the next stop fast and keep moving." },
      { role: "Field lead", desc: "Track progress and proof without calling the office." },
      { role: "Operations team", desc: "Get completion updates straight from the field." },
    ],
    steps: ["Review the route", "Navigate and clean", "Mark complete with proof"],
    metrics: ["Mobile-first flow", "One-tap completion", "Proof uploads"],
    featureList: ["Daily routes", "Navigation shortcut", "Cleanup proof upload"],
    ctaAction: "equip field crews",
  },
  {
    id: "rewards-analytics",
    name: "Rewards Analytics",
    tagline: "Incentives that make participation sticky.",
    desc: "Gamification, badges, and trend analytics help citizens stay engaged long term.",
    heroDesc:
      "Reward loops turn civic participation into a habit. Points, badges, and city-wide leaderboards make the platform feel alive while analytics reveal which neighborhoods respond best.",
    icon: "reward",
    iconBg: "#FFFBEB",
    iconColor: "#CA8A04",
    gradientCSS: "linear-gradient(135deg,#CA8A04,#FACC15,#22C55E)",
    stat: { value: "Eco points", label: "Participation lift", desc: "Optional reward layer for campaigns, schools, and community drives." },
    features: [
      { name: "Point system", desc: "Earn points for valid reports and cleanup engagement." },
      { name: "Badges and milestones", desc: "Celebrate helpers with visible city-level achievements." },
      { name: "Leaderboards", desc: "Create friendly competition between wards, groups, or schools." },
      { name: "Campaign tracking", desc: "Measure which engagement campaigns are actually working." },
      { name: "Reward logic", desc: "Keep the system optional so it can fit real municipal policy." },
      { name: "Behavior analytics", desc: "Learn when and where citizens are most likely to participate." },
    ],
    personas: [
      { role: "Community organizer", desc: "Use gamification to build local momentum." },
      { role: "City communicator", desc: "Run eco campaigns with measurable participation." },
      { role: "Student volunteer", desc: "Stay motivated with visible progress and rewards." },
    ],
    steps: ["Report responsibly", "Earn points and badges", "Track city-wide participation"],
    metrics: ["Point-based engagement", "City leaderboard", "Campaign analytics"],
    featureList: ["Badges and points", "Leaderboards", "Engagement analytics"],
    ctaAction: "grow community participation",
  },
];

export const navigationProducts = moduleLibrary.map(({ id, name, desc }) => ({ id, name, desc }));
export const products = moduleLibrary;

export const heroStats = [
  { value: "7 zones", label: "Delhi reporting grid" },
  { value: "< 4 min", label: "triage target" },
  { value: "24 crews", label: "live field response" },
  { value: "92%", label: "classification confidence" },
];

export const liveActivity = [
  { time: "08:12", title: "Connaught Place spill reported", detail: "A hazardous report near the outer circle was flagged and moved into the urgent queue." },
  { time: "08:18", title: "Delhi AI triage complete", detail: "The upload was scored with 0.92 confidence and routed to the control room review lane." },
  { time: "08:24", title: "Route updated for Okhla cluster", detail: "Nearby industrial pickups were grouped to cut backtracking and lower fuel burn." },
  { time: "08:39", title: "Mayur Vihar cleanup closed", detail: "The citizen received a Delhi cleanup update and reward points." },
];

export const workflowSteps = [
  {
    step: "1",
    title: "Capture the issue",
    icon: "pin",
    copy: "A resident drops a pin, adds a photo, and submits a report with automatic location context.",
  },
  {
    step: "2",
    title: "Classify and prioritize",
    icon: "brain",
    copy: "AI detects waste type, severity, and duplicate signals so operations teams know what to tackle first.",
  },
  {
    step: "3",
    title: "Optimize the route",
    icon: "route",
    copy: "The engine builds the shortest useful pickup path while respecting priority and traffic constraints.",
  },
  {
    step: "4",
    title: "Close the loop",
    icon: "check",
    copy: "Crews mark the pickup as complete, proof is stored, and the public status updates immediately.",
  },
];

export const dashboardPanels = [
  {
    title: "Live Delhi map",
    copy: "Heat points and priority markers show where Delhi is under pressure right now.",
  },
  {
    title: "Route control",
    copy: "The dispatch board recomputes routes so crews can stay efficient throughout the shift.",
  },
  {
    title: "Worker queue",
    copy: "Field crews see only the next stop, navigation shortcut, and completion action they need.",
  },
];

export const impactCards = [
  {
    title: "Predictive waste analytics",
    copy: "Spot repeat hotspots, forecast peak hours, and plan before the backlog grows.",
  },
  {
    title: "Transparency board",
    copy: "Publish report status and cleanup progress so citizens can see that the system is working.",
  },
  {
    title: "Gamified engagement",
    copy: "Reward participation with points, badges, and city-wide recognition that keeps the loop alive.",
  },
];

export const testimonials = [
  {
    quote: "EcoRoute AI makes Delhi feel responsive. Citizens know the report was seen, and crews know exactly which lane to clear next.",
    author: "Asha Mehta",
    role: "Delhi Operations Lead",
  },
  {
    quote: "The route optimizer turns Delhi's messy backlog into measurable field movement. That is what makes the platform feel real.",
    author: "Rohan Das",
    role: "Smart City Program Manager",
  },
  {
    quote: "The dashboard looks like a real civic control room instead of a concept screen, which gives the whole product more credibility.",
    author: "Priya Kapoor",
    role: "Urban Systems Mentor",
  },
];

export const footerLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Modules", href: "#modules" },
  { label: "Operations", href: "#operations" },
  { label: "Impact", href: "#impact" },
];

export const proofStats = heroStats;
export const howItWorks = workflowSteps;
export const suiteMetrics = [
  { value: "24/7", label: "Live reporting", source: "citizen intake" },
  { value: "4", label: "Core AI layers", source: "triage, routing, analytics, rewards" },
  { value: "18m", label: "Response target", source: "Delhi control room benchmark" },
  { value: "+28%", label: "Efficiency gain", source: "route optimizer" },
];
export const systemInsights = impactCards.map((card) => card.copy);
export const pricingPlans = [
  {
    name: "Launch",
    price: "Starter",
    blurb: "Best for a ward-level launch or a live Delhi command room prototype.",
    features: ["Report intake", "Delhi region API", "Live map", "Basic dashboard"],
  },
  {
    name: "Scale",
    price: "Custom",
    blurb: "For a municipality or long-term rollout.",
    features: ["AI triage", "Route optimization", "Worker panel", "Analytics"],
  },
];


