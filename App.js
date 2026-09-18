const STORAGE_KEY = "ssg-cds-dashboard-v03";
let state = loadState();
let currentView = "overview";

const app = document.getElementById("app");
const navButtons = [...document.querySelectorAll(".nav-btn")];

document.addEventListener("DOMContentLoaded", () => {
  wireGlobalControls();
  wireNavigation();
  render();
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normaliseState(JSON.parse(raw));
  } catch (error) {
    console.warn("Could not load local dashboard data", error);
  }
  return normaliseState(structuredClone(window.DEFAULT_CDS_DATA));
}

function normaliseState(data) {
  const base = structuredClone(window.DEFAULT_CDS_DATA);
  const merged = { ...base, ...data, meta: { ...base.meta, ...(data.meta || {}) } };
  ["coverage", "stakeholders", "routing", "tasks", "issues", "campaign", "templates", "decisions", "timeline"].forEach(key => {
    if (!Array.isArray(merged[key])) merged[key] = base[key] || [];
  });
  return merged;
}


function saveState() {
  state.meta.lastUpdated = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function wireGlobalControls() {
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("importInput").addEventListener("change", importData);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset this browser dashboard to the starter data? Export first if you want a backup.")) return;
    state = structuredClone(window.DEFAULT_CDS_DATA);
    saveState();
    render();
    toast("Starter data restored");
  });
}

function wireNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      navButtons.forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });
}

function render() {
  const views = {
    overview: renderOverview,
    tasks: renderTasks,
    issues: renderIssues,
    routing: renderRouting,
    stakeholders: renderStakeholders,
    decisions: renderDecisions,
    timeline: renderTimeline,
    campaign: renderCampaign,
    coverage: renderCoverage,
    brief: renderBrief,
    templates: renderTemplates,
    settings: renderSettings
  };
  app.innerHTML = views[currentView]();
  bindViewEvents();
}

function bindViewEvents() {
  if (currentView === "tasks") bindTaskEvents();
  if (currentView === "issues") bindIssueEvents();
  if (currentView === "brief") bindBriefEvents();
  if (currentView === "templates") bindTemplateEvents();
  if (currentView === "settings") bindSettingsEvents();
}

function renderOverview() {
  const today = dateOnly(new Date());
  const tasksOpen = state.tasks.filter(t => t.status !== "Done");
  const overdue = tasksOpen.filter(t => t.due && t.due < today);
  const dueWeek = tasksOpen.filter(t => isWithinDays(t.due, 7));
  const highRisks = state.issues.filter(i => i.risk === "High" && !["Closed", "Done"].includes(i.status));
  const nextStakeholders = [...state.stakeholders]
    .filter(s => s.nextTouchpoint)
    .sort((a, b) => a.nextTouchpoint.localeCompare(b.nextTouchpoint))
    .slice(0, 4);
  const plannedHours = dueWeek.reduce((sum, t) => sum + Number(t.estimatedHours || 0), 0);
  const hoursClass = plannedHours > state.meta.weeklyHoursMax ? "alert" : plannedHours > state.meta.weeklyHoursMin ? "warn" : "";
  const hourPct = Math.min(100, Math.round((plannedHours / state.meta.weeklyHoursMax) * 100));

  return `
    <div class="grid">
      <section class="card">
        <p class="eyebrow">Role charter</p>
        <h2>${escapeHTML(state.meta.roleCharter)}</h2>
        <p class="muted">Keep this sentence visible. It protects your time and clarifies that the CDS function is coordination and routing, not replacing specialist roles.</p>
      </section>

      <section class="grid grid-4">
        ${metric("Open tasks", tasksOpen.length, "", "blue")}
        ${metric("Due this week", dueWeek.length, "", "orange")}
        ${metric("Overdue", overdue.length, "", overdue.length ? "red" : "")}
        ${metric("High risks", highRisks.length, "", highRisks.length ? "red" : "")}
      </section>

      <section class="grid grid-2">
        <div class="card">
          <div class="toolbar"><h2>This week’s load</h2><span class="badge ${hoursClass === "alert" ? "high" : hoursClass === "warn" ? "medium" : "low"}">${plannedHours.toFixed(1)} h planned</span></div>
          <p class="muted">Target role capacity: ${state.meta.weeklyHoursMin}–${state.meta.weeklyHoursMax} hours/week. Use this as an early warning against scope creep.</p>
          <div class="progress-outer"><div class="progress-inner ${hoursClass}" style="width:${hourPct}%"></div></div>
          <h3>Next actions</h3>
          ${taskList(dueWeek.slice(0, 5))}
        </div>
        <div class="card">
          <div class="toolbar"><h2>Upcoming touchpoints</h2><button class="btn btn-secondary" onclick="switchView('stakeholders')">Open cadence</button></div>
          <div class="timeline">
            ${nextStakeholders.map(s => `
              <div class="timeline-item">
                <div class="timeline-month">${formatDate(s.nextTouchpoint)}</div>
                <div><strong>${escapeHTML(s.name)}</strong><br><span class="muted small">${escapeHTML(s.purpose)}</span></div>
                <span class="badge open">${escapeHTML(s.cadence.split(";")[0])}</span>
              </div>`).join("") || `<p class="muted">No upcoming stakeholder touchpoints recorded.</p>`}
          </div>
        </div>
      </section>

      <section class="grid grid-2">
        <div class="card">
          <div class="toolbar"><h2>Open risks</h2><button class="btn btn-secondary" onclick="switchView('issues')">Open tracker</button></div>
          ${issueList(highRisks.concat(state.issues.filter(i => i.risk !== "High")).slice(0, 5))}
        </div>
        <div class="card">
          <div class="toolbar"><h2>DS coverage snapshot</h2><button class="btn btn-secondary" onclick="switchView('coverage')">Open coverage</button></div>
          <div class="grid grid-2">
          ${state.coverage.map(c => {
            const pct = c.totalGroups ? Math.round((c.activeDS / c.totalGroups) * 100) : 0;
            const cls = pct < 50 ? "alert" : pct < 80 ? "warn" : "";
            return `<div class="card compact"><h3>${escapeHTML(c.unit)}</h3><div class="metric-value">${c.activeDS}/${c.totalGroups}</div><p class="muted small">Active DS / groups</p><div class="progress-outer"><div class="progress-inner ${cls}" style="width:${pct}%"></div></div><p class="small"><strong>Gap:</strong> ${escapeHTML(c.gaps)}</p></div>`;
          }).join("")}
          </div>
        </div>
      </section>
    </div>`;
}

function renderTasks() {
  return `
    <section class="card">
      <div class="toolbar">
        <div><p class="eyebrow">Operational control</p><h2>Tasks</h2></div>
        <button class="btn btn-primary" id="addTaskBtn">Add task</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Task</th><th>Area</th><th>Due</th><th>Status</th><th>Priority</th><th>Hours</th><th>Notes</th><th>Actions</th></tr></thead>
          <tbody>${state.tasks.sort(byDue).map(t => `
            <tr>
              <td><strong>${escapeHTML(t.title)}</strong></td>
              <td>${escapeHTML(t.area || "")}</td>
              <td>${formatDate(t.due)}</td>
              <td>${statusBadge(t.status)}</td>
              <td>${priorityBadge(t.priority)}</td>
              <td>${Number(t.estimatedHours || 0).toFixed(1)}</td>
              <td class="small muted">${escapeHTML(t.notes || "")}</td>
              <td><div class="action-row">
                <button class="icon-btn" data-action="toggle-task" data-id="${t.id}">${t.status === "Done" ? "↩" : "✓"}</button>
                <button class="icon-btn delete" data-action="delete-task" data-id="${t.id}">×</button>
              </div></td>
            </tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="card" id="taskFormCard" hidden>
      <h2>New task</h2>
      <form id="taskForm" class="form-grid">
        <label>Task title<input name="title" required placeholder="e.g. Prepare first DS meeting" /></label>
        <label>Area<input name="area" placeholder="Communication / Risk / Meeting" /></label>
        <label>Due date<input name="due" type="date" required /></label>
        <label>Status<select name="status"><option>Open</option><option>In progress</option><option>Done</option></select></label>
        <label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label>
        <label>Estimated hours<input name="estimatedHours" type="number" min="0" step="0.25" value="0.5" /></label>
        <label class="full">Notes<textarea name="notes"></textarea></label>
        <div class="full action-row"><button class="btn btn-primary" type="submit">Save task</button><button class="btn btn-ghost" type="button" id="cancelTaskBtn">Cancel</button></div>
      </form>
    </section>`;
}

function bindTaskEvents() {
  const add = document.getElementById("addTaskBtn");
  const card = document.getElementById("taskFormCard");
  if (add) add.addEventListener("click", () => card.hidden = false);
  const cancel = document.getElementById("cancelTaskBtn");
  if (cancel) cancel.addEventListener("click", () => card.hidden = true);
  const form = document.getElementById("taskForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    state.tasks.push({ ...data, id: crypto.randomUUID(), estimatedHours: Number(data.estimatedHours || 0) });
    saveState(); render(); toast("Task added");
  });
  app.querySelectorAll("[data-action='toggle-task']").forEach(btn => btn.addEventListener("click", () => {
    const t = state.tasks.find(item => item.id === btn.dataset.id);
    t.status = t.status === "Done" ? "Open" : "Done";
    saveState(); render();
  }));
  app.querySelectorAll("[data-action='delete-task']").forEach(btn => btn.addEventListener("click", () => {
    state.tasks = state.tasks.filter(item => item.id !== btn.dataset.id);
    saveState(); render(); toast("Task removed");
  }));
}

function renderIssues() {
  return `
    <section class="card">
      <div class="toolbar">
        <div><p class="eyebrow">Route, don’t absorb</p><h2>Issue tracker</h2></div>
        <button class="btn btn-primary" id="addIssueBtn">Add issue</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Issue</th><th>Type</th><th>Route / owner</th><th>Status</th><th>Risk</th><th>Opened</th><th>Next action</th><th>Actions</th></tr></thead>
          <tbody>${state.issues.map(i => `
            <tr>
              <td><strong>${escapeHTML(i.title)}</strong></td>
              <td>${escapeHTML(i.type)}</td>
              <td>${escapeHTML(i.owner || suggestRoute(i.type))}</td>
              <td>${statusBadge(i.status)}</td>
              <td>${priorityBadge(i.risk)}</td>
              <td>${formatDate(i.opened)}</td>
              <td class="small muted">${escapeHTML(i.nextAction || "")}</td>
              <td><div class="action-row">
                <button class="icon-btn" data-action="close-issue" data-id="${i.id}">${i.status === "Closed" ? "↩" : "✓"}</button>
                <button class="icon-btn delete" data-action="delete-issue" data-id="${i.id}">×</button>
              </div></td>
            </tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="card" id="issueFormCard" hidden>
      <h2>New issue</h2>
      <form id="issueForm" class="form-grid">
        <label>Issue title<input name="title" required /></label>
        <label>Type<select name="type">${state.routing.map(r => `<option>${escapeHTML(r.type)}</option>`).join("")}</select></label>
        <label>Owner / first route<input name="owner" placeholder="Leave empty to use routing matrix suggestion" /></label>
        <label>Status<select name="status"><option>Open</option><option>In progress</option><option>Awaiting feedback</option><option>Follow-up needed</option><option>Closed</option></select></label>
        <label>Risk<select name="risk"><option>Medium</option><option>High</option><option>Low</option></select></label>
        <label>Opened<input name="opened" type="date" value="${dateOnly(new Date())}" /></label>
        <label class="full">Next action<textarea name="nextAction"></textarea></label>
        <div class="full action-row"><button class="btn btn-primary" type="submit">Save issue</button><button class="btn btn-ghost" type="button" id="cancelIssueBtn">Cancel</button></div>
      </form>
    </section>`;
}

function bindIssueEvents() {
  const add = document.getElementById("addIssueBtn");
  const card = document.getElementById("issueFormCard");
  if (add) add.addEventListener("click", () => card.hidden = false);
  const cancel = document.getElementById("cancelIssueBtn");
  if (cancel) cancel.addEventListener("click", () => card.hidden = true);
  const form = document.getElementById("issueForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    state.issues.push({ ...data, id: crypto.randomUUID(), owner: data.owner || suggestRoute(data.type) });
    saveState(); render(); toast("Issue added");
  });
  app.querySelectorAll("[data-action='close-issue']").forEach(btn => btn.addEventListener("click", () => {
    const issue = state.issues.find(item => item.id === btn.dataset.id);
    issue.status = issue.status === "Closed" ? "Open" : "Closed";
    saveState(); render();
  }));
  app.querySelectorAll("[data-action='delete-issue']").forEach(btn => btn.addEventListener("click", () => {
    state.issues = state.issues.filter(item => item.id !== btn.dataset.id);
    saveState(); render(); toast("Issue removed");
  }));
}

function renderRouting() {
  return `
    <section class="card">
      <p class="eyebrow">Time-protection backbone</p>
      <h2>Routing matrix</h2>
      <p class="muted">Use this when an issue arrives. The CDS logs, guides and connects; specialist advice stays with the appropriate support role.</p>
      <div class="grid grid-3">
        ${state.routing.map(r => `
          <div class="card compact route-card">
            <h3>${escapeHTML(r.type)}</h3>
            <p><strong>First route:</strong><br>${escapeHTML(r.firstRoute)}</p>
            <p class="muted small"><strong>CDS role:</strong> ${escapeHTML(r.cdsRole)}</p>
          </div>`).join("")}
      </div>
    </section>`;
}

function renderStakeholders() {
  return `
    <section class="card">
      <p class="eyebrow">Engagement rhythm</p>
      <h2>Stakeholders and cadence</h2>
      <p class="muted">Keep this light. The dashboard is meant to remind you when to connect, not to create more meetings.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Stakeholder</th><th>Role</th><th>Cadence</th><th>Purpose</th><th>Next touchpoint</th><th>Notes</th></tr></thead>
          <tbody>${state.stakeholders.sort((a, b) => (a.nextTouchpoint || "9999").localeCompare(b.nextTouchpoint || "9999")).map(s => `
            <tr><td><strong>${escapeHTML(s.name)}</strong></td><td>${escapeHTML(s.role)}</td><td>${escapeHTML(s.cadence)}</td><td>${escapeHTML(s.purpose)}</td><td>${formatDate(s.nextTouchpoint)}</td><td class="small muted">${escapeHTML(s.notes || "")}</td></tr>
          `).join("")}</tbody>
        </table>
      </div>
    </section>`;
}

function renderDecisions() {
  const decisions = state.decisions || [];
  return `
    <section class="card">
      <p class="eyebrow">Settled decisions and active constraints</p>
      <h2>Decision log</h2>
      <p class="muted">Use this to keep the September 2026 baseline stable. Decisions here should be factual and short; sensitive details stay outside GitHub.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Decision</th><th>Detail</th><th>Status</th></tr></thead>
          <tbody>${decisions.map(d => `
            <tr>
              <td>${escapeHTML(d.date || "")}</td>
              <td><strong>${escapeHTML(d.decision || "")}</strong></td>
              <td class="small muted">${escapeHTML(d.detail || "")}</td>
              <td>${statusBadge(d.status || "Settled")}</td>
            </tr>`).join("") || `<tr><td colspan="4" class="muted">No decisions recorded.</td></tr>`}</tbody>
        </table>
      </div>
    </section>`;
}

function renderTimeline() {
  const timeline = state.timeline || [];
  return `
    <section class="card">
      <p class="eyebrow">From handover to first-year execution</p>
      <h2>Operational timeline</h2>
      <p class="muted">This is the dashboard version of the status handover timeline: what is settled, what is immediate, and what is coming next.</p>
      <div class="timeline">
        ${timeline.map(item => `
          <div class="timeline-item">
            <div class="timeline-month">${escapeHTML(item.when || "")}</div>
            <div>
              <strong>${escapeHTML(item.phase || "Timeline")}</strong><br>
              <span class="muted small">${escapeHTML(item.event || "")}</span>
            </div>
            ${statusBadge(item.status || "Planned")}
          </div>`).join("") || `<p class="muted">No timeline items recorded.</p>`}
      </div>
    </section>`;
}

function renderCampaign() {
  return `
    <section class="card">
      <p class="eyebrow">Awareness campaign</p>
      <h2>First-year communication calendar</h2>
      <p class="muted">One strong monthly message is better than a noisy stream. Keep the two audiences separate: all SSG staff and SSG data stewards.</p>
      <div class="timeline">
        ${state.campaign.map(c => `
          <div class="timeline-item">
            <div class="timeline-month">${escapeHTML(c.month)}</div>
            <div>
              <strong>All SSG:</strong> ${escapeHTML(c.allSSG)}<br>
              <strong>Data stewards:</strong> ${escapeHTML(c.dataStewards)}
            </div>
            ${statusBadge(c.status)}
          </div>`).join("")}
      </div>
    </section>`;
}

function renderCoverage() {
  return `
    <section class="card">
      <p class="eyebrow">Do not store personal DS lists in this repo</p>
      <h2>Data steward coverage</h2>
      <p class="muted">This view tracks group-level coverage only. Keep named DS contact lists in approved WUR storage, not in GitHub.</p>
      <div class="grid grid-2">
        ${state.coverage.map(c => {
          const pct = c.totalGroups ? Math.round((c.activeDS / c.totalGroups) * 100) : 0;
          const cls = pct < 50 ? "alert" : pct < 80 ? "warn" : "";
          return `<div class="card compact">
            <h3>${escapeHTML(c.unit)}</h3>
            <div class="metric-value">${pct}%</div>
            <p class="metric-label">${c.activeDS} active DS across ${c.totalGroups} groups</p>
            <div class="progress-outer"><div class="progress-inner ${cls}" style="width:${pct}%"></div></div>
            <p><strong>Gap:</strong> ${escapeHTML(c.gaps)}</p>
            <p><strong>Priority:</strong> ${escapeHTML(c.priority)}</p>
          </div>`;
        }).join("")}
      </div>
    </section>`;
}

function renderBrief() {
  const brief = generateBrief();
  return `
    <section class="card">
      <div class="toolbar">
        <div><p class="eyebrow">Copy-paste output</p><h2>Monthly brief to Laura</h2></div>
        <button class="btn btn-primary" id="copyBriefBtn">Copy brief</button>
      </div>
      <p class="muted">This draft is generated from the current task, issue and campaign data. Edit before sending.</p>
      <div id="briefText" class="brief-box">${escapeHTML(brief)}</div>
    </section>`;
}

function bindBriefEvents() {
  document.getElementById("copyBriefBtn")?.addEventListener("click", () => copyText(generateBrief(), "Brief copied"));
}

function renderTemplates() {
  return `
    <section class="card">
      <p class="eyebrow">Reusable text</p>
      <h2>Templates</h2>
      <div class="grid grid-2">
        ${state.templates.map((t, index) => `
          <div class="card compact">
            <div class="toolbar"><h3>${escapeHTML(t.name)}</h3><button class="btn btn-secondary" data-action="copy-template" data-index="${index}">Copy</button></div>
            <div class="template-box small">${escapeHTML(t.content)}</div>
          </div>`).join("")}
      </div>
    </section>`;
}

function bindTemplateEvents() {
  app.querySelectorAll("[data-action='copy-template']").forEach(btn => btn.addEventListener("click", () => {
    copyText(state.templates[Number(btn.dataset.index)].content, "Template copied");
  }));
}

function renderSettings() {
  return `
    <section class="card">
      <p class="eyebrow">Local configuration</p>
      <h2>Settings</h2>
      <form id="settingsForm" class="form-grid">
        <label>Owner<input name="owner" value="${escapeAttr(state.meta.owner)}" /></label>
        <label>Version<input name="version" value="${escapeAttr(state.meta.version)}" /></label>
        <label>Minimum weekly hours<input name="weeklyHoursMin" type="number" min="0" step="0.25" value="${state.meta.weeklyHoursMin}" /></label>
        <label>Maximum weekly hours<input name="weeklyHoursMax" type="number" min="0" step="0.25" value="${state.meta.weeklyHoursMax}" /></label>
        <label class="full">Role charter<textarea name="roleCharter">${escapeHTML(state.meta.roleCharter)}</textarea></label>
        <div class="full action-row"><button class="btn btn-primary" type="submit">Save settings</button></div>
      </form>
    </section>
    <section class="card">
      <h2>Data storage note</h2>
      <p>This dashboard stores updates in your browser’s local storage. Export a JSON backup regularly. Do not put confidential DS lists, personal-data cases, or sensitive institutional notes into the GitHub repository.</p>
    </section>`;
}

function bindSettingsEvents() {
  document.getElementById("settingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    state.meta = { ...state.meta, ...data, weeklyHoursMin: Number(data.weeklyHoursMin), weeklyHoursMax: Number(data.weeklyHoursMax) };
    saveState(); render(); toast("Settings saved");
  });
}

function generateBrief() {
  const today = new Date();
  const month = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const openTasks = state.tasks.filter(t => t.status !== "Done").sort(byDue).slice(0, 5);
  const highRisks = state.issues.filter(i => i.risk === "High" && i.status !== "Closed");
  const openIssues = state.issues.filter(i => i.status !== "Closed").slice(0, 6);
  const nextCampaign = state.campaign.find(c => c.status !== "Done") || state.campaign[0];
  const coverage = state.coverage.map(c => `- ${c.unit}: ${c.activeDS}/${c.totalGroups} active DS; gap: ${c.gaps}`).join("\n");

  return `Subject: SSG CDS monthly update — ${month}\n\nDear Laura,\n\nHere is a short CDS update for SSG.\n\n1. Current focus\n${openTasks.map(t => `- ${t.title} (${t.area}; due ${formatDate(t.due)})`).join("\n") || "- No open tasks recorded."}\n\n2. DS coverage snapshot\n${coverage}\n\n3. Open issues and risks\n${openIssues.map(i => `- ${i.title}: ${i.status}; risk ${i.risk}; next action: ${i.nextAction}`).join("\n") || "- No open issues recorded."}\n\n4. High-risk items needing visibility\n${highRisks.map(i => `- ${i.title}`).join("\n") || "- None currently marked high risk."}\n\n5. Communication focus\n- Next campaign item: ${nextCampaign ? `${nextCampaign.month} — ${nextCampaign.allSSG}` : "No campaign item recorded."}\n\n6. Support or decision needed\n- [Add short decision request, if any.]\n\nBest,\n${state.meta.owner}`;
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ssg-cds-dashboard-backup-${dateOnly(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Data exported");
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      validateImport(imported);
      state = normaliseState(imported);
      saveState();
      render();
      toast("Data imported");
    } catch (error) {
      alert(`Could not import this file: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function validateImport(data) {
  const required = ["meta", "tasks", "issues", "routing", "stakeholders", "campaign", "coverage"];
  for (const key of required) {
    if (!(key in data)) throw new Error(`Missing '${key}' section`);
  }
}

function metric(label, value, note = "", color = "") {
  return `<div class="card metric ${color}"><div class="metric-label">${escapeHTML(label)}</div><div class="metric-value">${value}</div>${note ? `<p class="muted small">${escapeHTML(note)}</p>` : ""}</div>`;
}

function taskList(tasks) {
  if (!tasks.length) return `<p class="muted">Nothing due in the next 7 days.</p>`;
  return `<div class="timeline">${tasks.map(t => `<div class="timeline-item"><div class="timeline-month">${formatDate(t.due)}</div><div><strong>${escapeHTML(t.title)}</strong><br><span class="muted small">${escapeHTML(t.notes || "")}</span></div>${priorityBadge(t.priority)}</div>`).join("")}</div>`;
}

function issueList(issues) {
  if (!issues.length) return `<p class="muted">No open risk items recorded.</p>`;
  return `<div class="timeline">${issues.map(i => `<div class="timeline-item"><div class="timeline-month">${escapeHTML(i.risk)}</div><div><strong>${escapeHTML(i.title)}</strong><br><span class="muted small">${escapeHTML(i.nextAction || "")}</span></div>${statusBadge(i.status)}</div>`).join("")}</div>`;
}

function statusBadge(status = "Open") {
  const normalized = String(status).toLowerCase();
  let cls = "open";
  if (["done", "closed", "settled"].includes(normalized)) cls = "done";
  else if (normalized.includes("risk") || normalized.includes("constraint")) cls = "high";
  else if (normalized.includes("progress") || normalized.includes("await") || normalized.includes("follow-up") || normalized.includes("pending") || normalized.includes("planned")) cls = "progress";
  return `<span class="badge ${cls}">${escapeHTML(status)}</span>`;
}

function priorityBadge(priority = "Medium") {
  const cls = priority === "High" ? "high" : priority === "Low" ? "low" : "medium";
  return `<span class="badge ${cls}">${escapeHTML(priority)}</span>`;
}

function byDue(a, b) {
  return (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31");
}

function suggestRoute(type) {
  const route = state.routing.find(r => r.type === type);
  return route ? route.firstRoute : "Triage; escalate if needed";
}

function isWithinDays(dateString, days) {
  if (!dateString) return false;
  const today = new Date(dateOnly(new Date()));
  const date = new Date(dateString);
  const diff = (date - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

function dateOnly(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function escapeAttr(value = "") { return escapeHTML(value); }

function copyText(text, message = "Copied") {
  navigator.clipboard.writeText(text).then(() => toast(message)).catch(() => alert("Could not copy to clipboard."));
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2200);
}

window.switchView = function(view) {
  currentView = view;
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.view === view));
  render();
};