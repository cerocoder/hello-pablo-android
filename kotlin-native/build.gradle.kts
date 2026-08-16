// Top-level build file: declares plugin versions once, applied per-module below.
//
// AGP 9.0+ has built-in Kotlin support: the standalone
// org.jetbrains.kotlin.android plugin is no longer required (and is
// rejected if applied). The Compose compiler plugin is still applied
// separately - see https://developer.android.com/build/migrate-to-built-in-kotlin
plugins {
    id("com.android.application") version "9.3.1" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.4.10" apply false
}
