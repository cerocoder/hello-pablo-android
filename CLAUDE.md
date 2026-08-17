<!-- autopilot:start -->
# Hello Pablo — сравнение технологий сборки Android-приложений

Исследовательский проект: два независимых демо "Hello Pablo" (один статический экран) — на Kotlin/Compose и на Flutter, собираются и тестируются на эмуляторе только через GitHub Actions CI, плюс `REPORT.md` со сравнением. Для агента, который продолжает сборку, чинит CI или правит код.

## Команды

Локальной сборки нет и физически быть не может: на этой машине нет ни Android SDK, ни Flutter SDK, ни Gradle. Единственный способ пересобрать — запушить в GitHub, CI соберёт APK и прогонит тест на эмуляторе.

```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_key -o IdentitiesOnly=yes" git push origin HEAD:main
```

Remote: `git@github.com:cerocoder/hello-pablo-android.git`. Используй именно `HEAD:main` — если работаешь из git worktree (текущая ветка называется не `main`), `git push origin main` тихо промахивается мимо реальных изменений (кусало дважды за сборку).

Статус CI после пуша (репозиторий публичный, неавторизованный GET работает):
```bash
curl -s "https://api.github.com/repos/cerocoder/hello-pablo-android/actions/runs?branch=main&per_page=5"
```
Опрашивать до `status: completed`, смотреть `conclusion`. Логи упавшего шага (`.../actions/jobs/{id}/logs`) требуют токен даже для публичного репо — читать через веб-интерфейс GitHub вручную.

## Структура

```
kotlin-native/           — Kotlin + Jetpack Compose демо
  app/src/main/            MainActivity.kt — один @Composable, текст "Hello Pablo"
  app/src/androidTest/      MainActivityInstrumentedTest — Compose test API, assertIsDisplayed
  build.gradle.kts          AGP 9.3.1, Kotlin 2.4.10, Compose BOM 2026.08.00, compileSdk/targetSdk 37, minSdk 24, JDK 17, Gradle 9.7.0
flutter/                 — Flutter (Dart, stable) демо
  lib/main.dart             HelloPabloApp — один StatelessWidget, текст "Hello Pablo"
  integration_test/         app_test.dart — find.text('Hello Pablo') findsOneWidget
  android/                   Gradle-обвязка под Flutter, написана вручную (flutter create недоступен на машине)
.github/workflows/
  kotlin-build.yml          два джоба: build, instrumented-test (needs: build)
  flutter-build.yml         один джоб: build-and-test
REPORT.md                — статусы CI, ссылки на run/артефакты, плюсы/минусы обеих технологий
.autopilot/hello-pablo-android/interfaces.md — источник фактов о сборке и снэгах ниже
```

Модули независимы полностью, общего кода между `kotlin-native/` и `flutter/` нет и не планируется.

## Подводные камни

- AGP 9+ запрещает отдельный плагин `org.jetbrains.kotlin.android` (Kotlin support встроен) — билд падает с `InvalidUserCodeException`; в обоих `build.gradle.kts` его нет, `org.jetbrains.kotlin.plugin.compose` подключён отдельно.
- В `kotlin-native/` нет `gradle-wrapper.jar` — сборка через `gradle/actions/setup-gradle` (version 9.7.0), не `./gradlew`. В `flutter/android/` wrapper тоже не закоммичен — его генерирует тулинг Flutter при сборке.
- `ubuntu-latest`-раннер (~14GB) не вмещает system-image эмулятора поверх уже стоящего Flutter SDK — обязателен `jlumbroso/free-disk-space` перед шагом с эмулятором, с `tool-cache: false` (иначе он чистит `/opt/hostedtoolcache`, где лежит закэшированный Flutter SDK — сборка падает с exit 127) и `android: false`.
- `script:` у `reactivecircus/android-emulator-runner` выполняет каждую физическую строку YAML отдельным вызовом `sh -c` — переменные не переживают переход между строками. Весь script пишется одной физической строкой, без `| tee` (dash без PIPESTATUS теряет реальный exit code): вывод в файл через `>`, код забирается через `$?` сразу после.
- Логи упавшего шага CI без токена не читаются даже для публичного репозитория (см. «Команды») — только веб-интерфейс GitHub.
- Репозиторий должен быть публичным — иначе неавторизованный `GET /actions/runs` вернёт 404.
- Секретов в проекте нет вообще — только встроенный `GITHUB_TOKEN`, который GitHub сам выдаёт джобе; руками не трогать.
- Сборка только debug, release не нужен — требует подписывающего сертификата, заводить его вне рамок проекта.
- APK не коммитится, это артефакт CI-джоба (`actions/upload-artifact`) — см. `.gitignore`: `*.apk`, `build/`, `.gradle/`.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
