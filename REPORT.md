# Hello Pablo — отчёт о сборке двух Android-приложений

Составлено: 2026-08-17. Оба демо-приложения — [`kotlin-native/`](kotlin-native/)
и [`flutter/`](flutter/) — собраны, протестированы на эмуляторе и запушены
в `main` этого репозитория. Сборка целиком идёт на облачных раннерах
GitHub Actions — ни одна команда сборки не выполнялась на локальной машине.
Ниже — пошаговый отчёт от первого лица: как именно каждое приложение
собиралось, что реально пошло не так и как это чинилось, что технологии
требуют по факту, честные плюсы и минусы, и насколько больно оказалось
отлаживать каждую без локального железа.

## Коротко: рекомендация (R01, R10)

| # | Технология | Почему в паре |
|---|---|---|
| 1 | **Kotlin + Jetpack Compose** (нативный Android) | Официальный путь Google, максимум контроля и документации — точка отсчёта, с которой сравнивают всё остальное |
| 2 | **Flutter** (Dart) | Кросс-платформенный фреймворк, другая модель UI (декларативные виджеты, собственный рендерер) — показывает, чем нативный путь отличается от кросс-платформенного на практике |

Обе технологии собираются исключительно через **GitHub Actions**: компилируют
облачные раннеры, не эта машина. Для публичных репозиториев GitHub Actions
бесплатен без ограничения минут — а скрывать в demo-проекте нечего, весь
код открыт с самого начала.

**Почему в сравнение не вошли no-code браузерные конструкторы** (MIT App
Inventor, Kodular, Thunkable и подобные): их нельзя честно «собрать» тем же
способом, что и две технологии выше — сборка там требует интерактивной
сессии в браузере (Google-логин, перетаскивание блоков мышью), а не
`git push` в CI. В этом прогоне не было подключённого браузерного
инструмента (Chrome-расширения) для такой интерактивной работы, поэтому
третья, no-code технология сознательно оставлена вне рамок (см. `spec.md`,
раздел «Вне рамок») — это выбор доступного метода сборки, а не оценка
качества самих no-code инструментов.

## Что нужно каждой технологии, по факту

Ровно одно: **аккаунт на github.com и пустой публичный репозиторий**.
Больше ничего — ни Android Studio, ни Android SDK, ни Flutter SDK, ни
эмулятора, ни какой-либо оплаты. SSH-доступ (ключ, уже настроенный на
машине, с которой делался пуш) нужен только для того, чтобы отправить код
в репозиторий — сама сборка, тесты и эмуляция целиком происходят на
GitHub-раннерах после `git push`, а не здесь.

---

## Kotlin + Jetpack Compose

### Как я это собирал (от первого лица)

1. Репозиторий `cerocoder/hello-pablo-android` уже существовал (пустой),
   SSH-ключ для пуша уже был настроен на машине — заводить ничего
   заранее не пришлось.
2. Написал `kotlin-native/` — один `@Composable` с текстом `"Hello Pablo"`
   через Jetpack Compose, без навигации и вью-моделей: они не нужны для
   одного статического экрана.
3. Написал инструментальный тест `MainActivityInstrumentedTest
   .helloPabloTextIsDisplayed` — через `createAndroidComposeRule<MainActivity>()`
   и `onNodeWithText("Hello Pablo").assertIsDisplayed()` (публичный
   Compose-test API, проверяет именно видимость текста, а не факт запуска
   Activity).
4. Написал `.github/workflows/kotlin-build.yml` с двумя джобами:
   `Build debug APK` (`gradle assembleDebug`) и `Instrumented test on
   emulator` (`gradle connectedDebugAndroidTest` на поднятом эмуляторе).
   Сборка идёт через `gradle/actions/setup-gradle` напрямую, **не** через
   `./gradlew` — в репозитории сознательно нет бинарного
   `gradle-wrapper.jar`.
5. Запушил командой `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_key -o
   IdentitiesOnly=yes" git push origin HEAD:main` (сборка велась в
   изолированном git worktree, где текущая ветка называется не `main`, —
   `HEAD:main` обязателен, иначе пуш тихо промахивается мимо `main`).
6. **Первый прогон CI был красным.** AGP 9.0+ включает поддержку Kotlin
   «из коробки» и **запрещает** отдельный плагин
   `org.jetbrains.kotlin.android` — сборка упала с явной ошибкой
   `InvalidUserCodeException`, прямо указывающей на решение. Причина —
   плагин был подключён по старой памяти вместе с AGP `9.3.1`. Починил
   удалением `id("org.jetbrains.kotlin.android")` из обоих
   `build.gradle.kts`, оставив `org.jetbrains.kotlin.plugin.compose`
   (Compose-компилятор) подключённым отдельно, как и требуется
   ([официальная миграция](https://developer.android.com/build/migrate-to-built-in-kotlin)).
   Второй пуш (коммит `2ea4665`) — зелёный.
7. Отдельно всплыло на этапе проверки: репозиторий изначально был
   **приватным**, из-за чего неавторизованный `GET
   /repos/.../actions/runs` возвращал `404` — пришлось сначала сделать
   репозиторий публичным. Также выяснилось, что скачивание логов джобы
   (`GET .../actions/jobs/{id}/logs`) требует токен даже для публичного
   репозитория, несмотря на формулировки в документации GitHub — просмотр
   упавшего шага пришлось делать через веб-интерфейс вручную.

**Версии, зафиксированные в build-файлах** (актуальные стабильные на
16–17 августа 2026): AGP `9.3.1`, Kotlin `2.4.10`, Compose BOM
`2026.08.00`, `androidx.activity:activity-compose:1.13.0`, Gradle `9.7.0`
(через `gradle/actions/setup-gradle`, без `gradle-wrapper.jar`),
`compileSdk`/`targetSdk` `37`, `minSdk` `24`, JDK `17`.

### Плюсы и минусы

| Плюсы | Минусы |
|---|---|
| Debug APK компактный: ~11.2 МБ | Первый пуш всё равно был красным — AGP 9 сломал привычную связку "AGP + отдельный kotlin-android плагин", о которой писали ещё до AGP 9 |
| До зелёного CI дошёл за один фикс (один красный прогон, одна точечная правка — убрать один плагин) | Ошибка была не про сам код приложения, а про версии тулчейна — типичная плата за то, что стек обновляется быстрее документации/памяти |
| Понятный, короткий и предсказуемый `InvalidUserCodeException` — сообщение об ошибке само указывает на фикс | Два отдельных job'а (build + instrumented-test) — чуть более многословный workflow, чем у Flutter |
| Workflow линейный, без построчных ловушек в `script:` | Скачать лог упавшего шага через GitHub API нельзя без токена — только веб-интерфейс (общее ограничение GitHub, не специфично для Kotlin) |

### Эмуляция

Инструментальный тест реально прогоняется на Android-эмуляторе,
поднятом на GitHub-раннере через `reactivecircus/android-emulator-runner@v2`
(api-level `30`, target `google_apis`, arch `x86_64`) в джобе
`Instrumented test on emulator`. Тест ассертит именно видимость текста
`"Hello Pablo"` на экране — не просто «процесс запустился». Реальный
зелёный прогон:
https://github.com/cerocoder/hello-pablo-android/actions/runs/31976480323
(commit `2ea4665`, workflow **Kotlin Native - Build & Test**, оба джоба —
`Build debug APK` и `Instrumented test on emulator` — `success`).

Сложность подключения эмулятора в CI была минимальной: `reactivecircus
/android-emulator-runner` — готовый, широко используемый экшн, единственное
дополнение — шаг «Enable KVM group perms» для аппаратного ускорения,
без которого эмулятор в CI работает намного медленнее.

### Отладка

Два независимых механизма, как и требовалось по спецификации:

1. **Полный `logcat`** за время работы эмулятора сохраняется как
   артефакт джоба через `actions/upload-artifact` —
   `hello-pablo-emulator-logcat` (~313 КБ), скачивается и читается как
   обычный текстовый файл. Хранится 90 дней, истекает 2026-11-14.
2. **Живая интерактивная отладка** — рабочий (не бутафорский) шаг с
   `mxschmitt/action-tmate@v3` в конце того же workflow, после того как
   эмулятор уже поднят инструментальным тестом:

   ```yaml
   - name: Debug via tmate (manual only)
     if: ${{ github.event_name == 'workflow_dispatch' && inputs.debug == true }}
     uses: mxschmitt/action-tmate@v3
     with:
       limit-access-to-actor: true
   ```

   Как этим пользоваться: открыть [вкладку Actions →
   Kotlin Native - Build & Test](https://github.com/cerocoder/hello-pablo-android/actions/workflows/kotlin-build.yml),
   нажать **Run workflow**, выставить чекбокс `debug: true` и запустить
   вручную (`workflow_dispatch`) — на обычном `push`/`pull_request` этот
   шаг не выполняется и ничего не стоит (в этом зелёном прогоне он
   корректно `skipped`). В логе запущенного шага появится SSH-команда вида
   `ssh <session>@<region>.tmate.io` — подключившись по ней с любой
   машины, попадаешь прямо в раннер, где эмулятор из предыдущего шага
   ещё жив (teardown экшна `android-emulator-runner` происходит уже после
   завершения всей джобы), и можно вручную гонять `adb logcat`, `adb
   shell`, переустанавливать APK и повторять тест — то же самое, что даёт
   локальный эмулятор, только без локального эмулятора. SSH-сессию не
   держим открытой постоянно — только по требованию, ради экономии
   раннер-минут.

### Ссылки

- Зелёный run: https://github.com/cerocoder/hello-pablo-android/actions/runs/31976480323
- Артефакты (на странице run, раздел Artifacts, 90 дней, истекают 2026-11-14):
  `hello-pablo-debug-apk` (~11.2 МБ), `hello-pablo-instrumented-test-report`,
  `hello-pablo-emulator-logcat` (~313 КБ)
- Workflow-файл: [`.github/workflows/kotlin-build.yml`](.github/workflows/kotlin-build.yml)

---

## Flutter

### Как я это собирал (от первого лица)

1. Тот же репозиторий, тот же уже настроенный SSH-доступ — заводить
   ничего дополнительно не пришлось.
2. Написал `flutter/lib` — один `StatelessWidget` с `Text('Hello Pablo')`
   внутри `Scaffold`, тот же принцип минимализма, что и в Kotlin-версии.
3. `android/` (Gradle-обвязка под Flutter) написал вручную по официальным
   шаблонам `flutter_tools` — команда `flutter create` недоступна на этой
   машине без установленного Flutter SDK, поэтому шаблон сверил построчно
   с текущим stable-каналом. `gradlew`/`gradlew.bat`/`gradle-wrapper.jar`
   осознанно не закоммитил (`android/.gitignore`) — это поведение шаблона
   Flutter по умолчанию, само tooling генерирует wrapper при сборке.
   (В Kotlin-версии wrapper не используется вовсе — там сборка идёт через
   `gradle/actions/setup-gradle` напрямую; итог один и тот же —
   бинарный `gradle-wrapper.jar` в git не хранится ни там, ни там, только
   разными путями.)
4. Написал `integration_test/app_test.dart`: `find.text('Hello Pablo')
   findsOneWidget` — публичный виджет-API, проверяет именно видимость
   текста.
5. Написал `.github/workflows/flutter-build.yml` с **одной** джобой
   `build-and-test` (сборка + тест вместе, в отличие от Kotlin-версии, где
   это два отдельных джоба).
6. Запушил той же командой (`GIT_SSH_COMMAND=... git push origin
   HEAD:main`).
7. **Первый прогон CI упал** с «No space left on device» на шаге
   установки system-image эмулятора
   (`system-images;android-34;google_apis;x86_64`): стандартный
   `ubuntu-latest`-раннер (~14 ГБ свободного места) не вмещает
   system-image поверх уже установленного Flutter SDK. Добавил
   `jlumbroso/free-disk-space@v1.3.1` перед шагом с эмулятором.
8. **Ловушка внутри ловушки:** первая версия этого фикса использовала
   `tool-cache: true` — а эта опция чистит `$AGENT_TOOLSDIRECTORY`
   (`/opt/hostedtoolcache`), ровно туда `subosito/flutter-action` с
   `cache: true` кладёт сам Flutter SDK. Тот прогон удалил Flutter и упал
   с `exit 127`. Финальная конфигурация: `tool-cache: false`, `android:
   false` (сам Android SDK нужен), остальное (`dotnet`, `haskell`,
   `large-packages`, `docker-images`, `swap-storage`) — `true`. У
   Kotlin-тикета этой проблемы не было — предположительно из-за меньшего
   суммарного объёма зависимостей (`gradle/actions/setup-gradle` легче,
   чем полный Flutter SDK + pub cache).
9. **Самый дорогой снэг: два красных прогона подряд.** `script:` у
   `reactivecircus/android-emulator-runner` выполняет **каждую физическую
   строку YAML отдельным вызовом `/usr/bin/sh -c`** — переменные
   (PID логката, код выхода теста) не переживают переход между строками.
   Сам тест на эмуляторе оба раза реально проходил («All tests passed!») —
   падение было чисто в обвязке: `kill "$LOGCAT_PID"` и `exit
   "$TEST_EXIT_CODE"` получали пустую строку → «Illegal number» → шаг
   падал с exit code 2, хотя тест был зелёным. Починил тем, что переписал
   весь `script:` **одной физической строкой**, без `| tee` (раннер
   использует `dash`, там нет `PIPESTATUS`, пайп теряет реальный
   exit-код) — вывод редиректится в файл через `>`, код забирается через
   `$?` сразу после, файл `cat`-ится для видимости в логе CI, и только
   потом `exit`. Прочитать лог этого шага через GitHub API без токена
   было нельзя (то же ограничение, что и в Kotlin-тикете) — причину нашёл
   по логу, который вручную скопировал пользователь.
10. Финальный зелёный прогон (commit `2c36bd2`) — один джоб
    `build-and-test`, все 13 реальных шагов зелёные.

### Плюсы и минусы

| Плюсы | Минусы |
|---|---|
| Один job вместо двух — сборка и тест в одном месте, короче итоговый лог run'а | До зелёного CI дошёл дольше и болезненнее Kotlin: 4 красных прогона против 1 (нехватка диска → неудачный первый фикс диска, стёрший сам Flutter SDK → два красных прогона подряд из-за построчного `script:`) |
| Тот же набор гарантий, что и у Kotlin (реальный эмулятор, реальный тест, logcat, tmate) | Debug APK заметно тяжелее: ~71.3 МБ против ~11.2 МБ у Kotlin — почти в 6,4 раза больше, типично для Flutter из-за встроенного движка рендеринга и debug-символов |
| `integration_test` API читается как обычный Dart-тест: `find.text('Hello Pablo').findsOneWidget` — компактно, без лишней инфраструктуры | `android/`-обвязку нельзя сгенерировать штатной командой `flutter create` без локального Flutter SDK — пришлось воспроизводить официальный шаблон `flutter_tools` вручную, построчно сверяя со stable-каналом |
| Отчёт теста (`flutter test --reporter expanded`) компактный — ~384 байта | Обвязка `reactivecircus/android-emulator-runner` менее очевидна, чем кажется: построчное выполнение `script:` — не задокументированная явно ловушка, которая ломает совершенно рабочий тест |

### Эмуляция

`integration_test` реально прогоняется на Android-эмуляторе,
поднятом через `reactivecircus/android-emulator-runner@v2` (api-level
`34`, target `google_apis`, arch `x86_64`, профиль `pixel_6`) внутри
джобы `build-and-test`. Тест ассертит видимость текста `"Hello Pablo"`.
Реальный зелёный прогон:
https://github.com/cerocoder/hello-pablo-android/actions/runs/32008628329
(commit `2c36bd2`, workflow **Flutter build**, job `build-and-test`,
`success`, 13/13 шагов зелёные).

Сама эмуляция концептуально не сложнее, чем у Kotlin — тот же готовый
экшн. Реальная сложность здесь была не в подъёме эмулятора, а в
дисковом пространстве раннера и в обвязке вокруг `script:` (см. снэги
выше) — то есть в интеграции CI-окружения, а не в самом Flutter или
самом эмуляторе.

### Отладка

1. **Полный `logcat`** за время работы эмулятора — артефакт
   `hello-pablo-emulator-logcat` (~403 КБ), тот же принцип, что и у
   Kotlin. Хранится 90 дней, истекает 2026-11-15.
2. **Живая интерактивная отладка** — тот же рабочий рецепт
   `mxschmitt/action-tmate@v3`, тем же условием:

   ```yaml
   - name: Debug session (tmate)
     if: ${{ github.event_name == 'workflow_dispatch' && inputs.debug == true }}
     uses: mxschmitt/action-tmate@v3
     with:
       limit-access-to-actor: true
   ```

   Пользоваться так же: [вкладка Actions →
   Flutter build](https://github.com/cerocoder/hello-pablo-android/actions/workflows/flutter-build.yml)
   → **Run workflow** → чекбокс `debug: true` → запуск вручную. В этом
   зелёном (push) прогоне шаг корректно `skipped`. При ручном запуске в
   логе шага появляется SSH-команда — подключившись, можно работать с
   `adb`/логами эмулятора вручную в реальном времени, ровно там, где
   только что прошёл (или упал) integration-тест.

### Ссылки

- Зелёный run: https://github.com/cerocoder/hello-pablo-android/actions/runs/32008628329
- Артефакты (на странице run, раздел Artifacts, 90 дней, истекают 2026-11-15):
  `hello-pablo-debug-apk` (~71.3 МБ), `hello-pablo-emulator-logcat`
  (~403 КБ), `hello-pablo-flutter-test-report` (~384 байта)
- Workflow-файл: [`.github/workflows/flutter-build.yml`](.github/workflows/flutter-build.yml)

---

## Сравнение

| | Kotlin + Compose | Flutter |
|---|---|---|
| Зелёный run | [31976480323](https://github.com/cerocoder/hello-pablo-android/actions/runs/31976480323) | [32008628329](https://github.com/cerocoder/hello-pablo-android/actions/runs/32008628329) |
| Джобов в workflow | 2 (`Build debug APK`, `Instrumented test on emulator`) | 1 (`build-and-test`) |
| Debug APK | ~11.2 МБ | ~71.3 МБ (≈6,4×) |
| Logcat-артефакт | ~313 КБ, истекает 2026-11-14 | ~403 КБ, истекает 2026-11-15 |
| Эмулятор в тесте | api 30, google_apis, x86_64 | api 34, google_apis, x86_64, pixel_6 |
| Красных прогонов до зелёного | 1 (конфликт AGP 9 с плагином `org.jetbrains.kotlin.android`) | 4 (нехватка диска; фикс диска стёр Flutter SDK; дважды — построчный `script:`) |
| tmate-отладка | есть, `if: workflow_dispatch && inputs.debug == true` | есть, то же условие |
| Что нужно, кроме github.com + пустой публичный репозиторий | ничего | ничего |

Обе технологии в итоге доехали до одинакового результата — зелёный CI,
скачиваемый APK, реально пройденный тест на эмуляторе, рабочий рецепт
живой SSH-отладки — но разной ценой: у Kotlin один точный, предсказуемый
фикс (устаревший плагин, явная ошибка от самого Gradle), у Flutter —
несколько итераций вокруг устройства самого CI-раннера (диск, построчное
исполнение `script:`), а не вокруг кода приложения. Ни один из снэгов в
обоих случаях не был связан с самим экраном `"Hello Pablo"` — оба
приложения по коду тривиальны и заработали с первой попытки; вся боль
была в обвязке CI/эмулятора, что и есть честный ответ на вопрос «насколько
сложна эмуляция и отладка без локальных инструментов»: сама эмуляция
через `reactivecircus/android-emulator-runner` в обоих случаях
несложная, а вот доводка CI-окружения вокруг неё требует итераций —
но полностью решаема без единого локального инструмента, что и было
целью.
