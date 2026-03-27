import express from "express";

export const app = express();
app.use(express.json());

function workflowIssues(workflow = 'lead nurture') {
  return [
    `${workflow} depends on manual handoffs that create SLA drift`,
    'campaign attribution is fragmented across channels',
    'follow-up timing is inconsistent',
  ];
}

function scoreWorkflow(workflow = 'lead nurture', channels = []) {
  const base = workflow.toLowerCase().includes('inbound') ? 68 : 62;
  return Math.min(92, base + Math.min(channels.length, 4) * 4);
}

function blueprint(objective = 'improve conversion', stack = []) {
  return {
    objective,
    blueprint: [
      { phase: 'capture', systems: ['forms', 'CRM'], automation: 'normalize inbound lead data' },
      { phase: 'qualify', systems: ['AI scoring service'], automation: 'score intent and urgency' },
      { phase: 'nurture', systems: ['email', 'SMS'], automation: 'send adaptive follow-up sequences' },
      { phase: 'handoff', systems: ['CRM', 'calendar'], automation: 'route hot leads to sales automatically' }
    ],
    tools: Array.from(new Set(['Zapier', 'HubSpot', 'OpenAI', 'GA4', ...stack])),
  };
}

app.get('/health', (_req, res) => res.json({ status: 'healthy', service: 'marketing-workflow-automation', focus: 'workflow-ai-ops' }));

app.post('/workflow/audit', (req, res) => {
  const workflow = req.body.workflow || 'lead nurture';
  const channels = req.body.channels || [];
  const issues = workflowIssues(workflow);
  res.json({
    workflow,
    maturityScore: scoreWorkflow(workflow, channels),
    issues,
    aiOpportunities: ['lead scoring', 'content personalization', 'routing automation'],
    channels,
  });
});

app.post('/workflow/blueprint', (req, res) => {
  res.json(blueprint(req.body.objective, req.body.currentStack || []));
});

app.post('/workflow/backlog', (req, res) => {
  const objective = req.body.objective || 'improve conversion';
  res.json({
    objective,
    backlog: [
      { id: 'WF-1', title: 'Unify lead capture schema', owner: 'RevOps', priority: 'high' },
      { id: 'WF-2', title: 'Deploy AI scoring and urgency tags', owner: 'Automation', priority: 'high' },
      { id: 'WF-3', title: 'Trigger adaptive nurture sequences', owner: 'Marketing Ops', priority: 'medium' },
      { id: 'WF-4', title: 'Route sales-ready leads into CRM/calendar handoff', owner: 'Sales Ops', priority: 'high' },
    ],
  });
});

if (!process.env.OPENCLAW_TEST) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Marketing workflow automation listening on ${port}`));
}
