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
  "updatedAt": "2026-08-17T10:15:10+02:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-16T23:42:39+02:00", "finishedAt": "2026-08-16T23:43:44+02:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-16T23:43:44+02:00", "finishedAt": "2026-08-16T23:44:20+02:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-08-16T23:44:20+02:00", "finishedAt": "2026-08-16T23:56:44+02:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-16T23:56:44+02:00", "finishedAt": "2026-08-17T00:02:18+02:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-17T00:02:18+02:00", "finishedAt": "2026-08-17T00:04:27+02:00", "note": "3 тикета, ярус T1" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-17T00:04:27+02:00", "note": "2 из 3 тасков готово" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 17, "done": 13, "inTicket": 4, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "Kotlin: Hello Pablo + сборка/эмуляция в CI", "requirements": ["R01","R02","R03","R04","R05","R06","R06.1","R07","R08","R08.1","R05i","R06i","G01","G02"],
      "blockedBy": [], "wave": 1, "zone": ["kotlin-native/", ".github/workflows/kotlin-build.yml"],
      "status": "done", "startedAt": "2026-08-17T00:06:02+02:00", "finishedAt": "2026-08-17T00:57:22+02:00",
      "retries": 0, "repairs": 0, "handoffs": 0,
      "files": ["kotlin-native/settings.gradle.kts", "kotlin-native/build.gradle.kts", "kotlin-native/gradle.properties", "kotlin-native/app/build.gradle.kts", "kotlin-native/app/src/main/AndroidManifest.xml", "kotlin-native/app/src/main/java/com/cerocoder/hellopablo/MainActivity.kt", "kotlin-native/app/src/androidTest/java/com/cerocoder/hellopablo/MainActivityInstrumentedTest.kt", ".github/workflows/kotlin-build.yml"],
      "tests": { "passed": 1, "failed": 0 },
      "commit": "2ea4665",
      "concerns": ["дублирование шагов checkout/JDK/Gradle между двумя джобами workflow (структурно, не блокирует)", "actions/upload-artifact@v4 таргетирует устаревший Node 20 (предупреждение, не ошибка)"]
    },
    { "id": "02", "title": "Flutter: Hello Pablo + сборка/эмуляция в CI", "requirements": ["R01","R02","R03","R04","R05","R06","R06.1","R07","R08","R08.1","R05i","R06i","G01","G02"],
      "blockedBy": [], "wave": 1, "zone": ["flutter/", ".github/workflows/flutter-build.yml"],
      "status": "done", "startedAt": "2026-08-17T00:06:02+02:00", "finishedAt": "2026-08-17T10:14:26+02:00",
      "retries": 0, "repairs": 2, "handoffs": 0,
      "files": ["flutter/pubspec.yaml", "flutter/lib/main.dart", "flutter/integration_test/app_test.dart", "flutter/android/**", ".github/workflows/flutter-build.yml"],
      "tests": { "passed": 1, "failed": 0 },
      "commit": "2c36bd2",
      "concerns": ["jlumbroso/free-disk-space с tool-cache:true конфликтовал с кэшем Flutter SDK — исправлено (tool-cache:false)", "reactivecircus/android-emulator-runner выполняет каждую строку script: отдельным sh -c — два красных прогона из-за потери переменных между строк, исправлено (одна физическая строка)"]
    },
    { "id": "03", "title": "Итоговый отчёт (REPORT.md)", "requirements": ["R09","R10","R11"],
      "blockedBy": ["01","02"], "wave": 2, "zone": ["REPORT.md"], "status": "in-progress", "startedAt": "2026-08-17T10:15:10+02:00", "retries": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": { "found": 1, "fixed": 1, "deferred": 0 },
  "blind": null
}
