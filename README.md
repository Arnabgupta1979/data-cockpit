# SSG CDS Operating Dashboard

Version: v0.2 June 2026 baseline

A lightweight static browser dashboard for the Coordinating Data Steward (CDS) role in WUR Social Sciences Group (SSG).

It is designed to help with:

- weekly task focus;
- issue and routing tracking;
- stakeholder cadence;
- first-year communication planning;
- DS coverage monitoring at group level;
- monthly brief generation for Laura / management updates;
- a decision log and operational timeline based on the June 2026 status handover.

## Important privacy note

This starter repository intentionally avoids storing confidential data. Do **not** commit the following to GitHub:

- named confidential DS lists;
- personal-data case notes;
- personal data;
- sensitive WUR-only documents;
- legal, privacy, information security, or unresolved incident details.

Use GitHub only for the dashboard code and generic configuration. Keep sensitive working files in approved WUR storage. The dashboard stores changes in your browser's local storage and allows JSON export/import for backup.

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

This v0.2 package uses a new browser local-storage key (`ssg-cds-dashboard-v02`) so the June 2026 baseline appears cleanly. If you have made edits in the previous live dashboard, export them first and import them after replacing the files.


The dashboard runs fully in the browser. You can:

- add tasks and issues;
- mark items as done or closed;
- export a JSON backup;
- import a JSON backup on another browser or device.

For code changes, update the files in GitHub and the Pages site will redeploy.

## Recommended workflow with ChatGPT

Tell ChatGPT what changed, for example:

> Update my CDS dashboard data: Yoda DPIA is still follow-up needed; Nika contacted; first DS meeting planned for 15 September; add a task to draft the September agenda by 1 September.

Then ask ChatGPT to update `data/defaultData.js` or help edit the exported JSON backup.

## Licence

Use internally as needed. If publishing publicly, review branding and institutional-policy implications first.


## v0.2 update notes

This update incorporates the June 2026 CDS status handover at a non-confidential level: aggregate DS coverage, settled decisions, live inherited open items, first-year timeline, stakeholder cadence, and updated tasks. It avoids storing the named confidential DS list or sensitive case notes in the GitHub Pages files.
