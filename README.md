# SSG CDS Operating Dashboard

Version: v0.3 September 2026 refresh

A lightweight static browser dashboard for the Coordinating Data Steward (CDS) role in WUR Social Sciences Group (SSG).

It is designed to help with:

- weekly task focus;
- issue and routing tracking;
- stakeholder cadence;
- first-year communication planning;
- DS coverage monitoring at group level;
- monthly brief generation for Laura / management updates;
- a decision log and operational timeline based on the June 2026 status handover, refreshed in September 2026.

## Important privacy note

This starter repository intentionally avoids storing confidential data. Do **not** commit the following to GitHub:

- named confidential DS lists;
- personal-data case notes;
- personal data;
- sensitive WUR-only documents;
- legal, privacy, information security, or unresolved incident details.

Use GitHub only for the dashboard code and generic configuration. Keep sensitive working files in approved WUR storage. The dashboard stores changes in your browser's local storage and allows JSON export/import for backup.

**Before you republish this refresh, check whether this repository and its GitHub Pages site are public or private.** A plain, unauthenticated clone of this repository succeeded during this review, which is normally only possible for a public repository. If this dashboard is meant to stay internal, confirm the visibility setting under Settings, General, Danger Zone, and be aware that GitHub Pages sites built from a private repository are still publicly reachable at their URL on most plan types; there is no way to restrict Pages access on a personal GitHub account. If you want this dashboard to be genuinely non-public, keep it as a local HTML file you open directly, or host it on WUR-approved infrastructure instead of GitHub Pages, rather than relying on repository visibility alone.

## Files

```text
index.html              Main page
styles.css              Dashboard styling
app.js                  Dashboard logic and local storage
data/defaultData.js     Baseline data, deliberately non-confidential
README.md               Setup notes
.gitignore              Basic ignore file
LICENSE                 Optional MIT license text
```

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `ssg-cds-dashboard`.
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/root`.
6. Click **Save**.
7. Wait a minute or two. GitHub will show the published URL.

## Updating the dashboard

This v0.3 package uses a new browser local-storage key (`ssg-cds-dashboard-v03`) so the September 2026 refresh appears cleanly. If you have made edits in the previous live dashboard, export them first and import them after replacing the files.

The dashboard runs fully in the browser. You can:

- add tasks and issues;
- mark items as done or closed;
- export a JSON backup;
- import a JSON backup on another browser or device.

For code changes, update the files in GitHub and the Pages site will redeploy.

## Recommended workflow with Claude or ChatGPT

Tell your assistant what changed, for example:

> Update my CDS dashboard data: Yoda DPIA is still follow-up needed; Nika contacted; first DS meeting held on 15 September with these outcomes; add a task to draft the October agenda.

Then ask it to update `data/defaultData.js` or help edit the exported JSON backup.

## Licence

Use internally as needed. If publishing publicly, review branding and institutional-policy implications first.

## v0.3 update notes (September 2026)

This refresh brings the dashboard from the June 2026 handover baseline up to date at a non-confidential level, using the same role-based routing style as the original (no named individuals added). Main changes:

- Communication track: RDM Espresso #1 and Data Espresso Issue #2 marked done; the RDM Navigator and the DMP writing SOP are recorded as produced.
- Tooling: Atlas.ti discontinued WUR-wide (22 June 2026) with QualCoder as the recommended replacement; research-side transition still pending.
- Contacts and routing: the SSG Information Security Officer vacancy is recorded as filled; the privacy/security routing address is updated to the combined privacy-security.ssg@wur.nl inbox.
- Compliance watch item: SmartPIA is expected to be replaced by a RoPA process under NIS2. This is flagged amber (Pending confirmation) throughout rather than rewritten, per the amber-flag-over-rebuild approach, pending a confirmed timeline from the SSG Privacy Officer.
- Stale dates: most stakeholder "next touchpoint" dates inherited from the June handover have now passed with no recorded outcome. Rather than inventing new dates, these are marked **Pending confirmation** so they surface for review instead of silently reading as on-schedule. The first SSG Data Steward meeting (scheduled 15 September 2026) is the most time-sensitive of these; confirm whether it took place and log the outcomes before the next refresh.
- Several June-dated tasks with no confirmed outcome on record are marked **Pending confirmation** rather than assumed Done, so the This Week overdue count reflects genuine uncertainty rather than either false completion or a wall of stale red overdue items.

Everything above is drawn from what has been discussed with Claude in the CDS Data Stewardship workspace; none of it should be treated as a substitute for checking directly with Laura, the Privacy Officer route, or the DS community before acting on any Pending confirmation item.
