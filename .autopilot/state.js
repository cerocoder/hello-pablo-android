window.STATE =
{
  "slug": "hello-pablo-android",
  "title": "Hello Pablo — сравнение технологий сборки Android-приложений",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T1",
  "briefFile": "2026-08-16-brief.md",
  "memoryFile": "CLAUDE.md",
  "startedAt": "2026-08-16T23:42:39+02:00",
  "updatedAt": "2026-08-17T00:06:02+02:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-16T23:42:39+02:00", "finishedAt": "2026-08-16T23:43:44+02:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-16T23:43:44+02:00", "finishedAt": "2026-08-16T23:44:20+02:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-08-16T23:44:20+02:00", "finishedAt": "2026-08-16T23:56:44+02:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-16T23:56:44+02:00", "finishedAt": "2026-08-17T00:02:18+02:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-17T00:02:18+02:00", "finishedAt": "2026-08-17T00:04:27+02:00", "note": "3 тикета, ярус T1" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-17T00:04:27+02:00" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 16, "done": 0, "inTicket": 16, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "Kotlin: Hello Pablo + сборка/эмуляция в CI", "requirements": ["R01","R02","R03","R04","R05","R06","R06.1","R07","R08","R08.1","R05i","R06i","G01","G02"],
      "blockedBy": [], "wave": 1, "zone": ["kotlin-native/", ".github/workflows/kotlin-build.yml"], "status": "in-progress", "startedAt": "2026-08-17T00:06:02+02:00", "retries": 0 },
    { "id": "02", "title": "Flutter: Hello Pablo + сборка/эмуляция в CI", "requirements": ["R01","R02","R03","R04","R05","R06","R06.1","R07","R08","R08.1","R05i","R06i","G01","G02"],
      "blockedBy": [], "wave": 1, "zone": ["flutter/", ".github/workflows/flutter-build.yml"], "status": "in-progress", "startedAt": "2026-08-17T00:06:02+02:00", "retries": 0 },
    { "id": "03", "title": "Итоговый отчёт (REPORT.md)", "requirements": ["R09","R10","R11"],
      "blockedBy": ["01","02"], "wave": 2, "zone": ["REPORT.md"], "status": "pending", "retries": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": { "found": 1, "fixed": 1, "deferred": 0 },
  "blind": null
}
