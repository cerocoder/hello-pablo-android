package com.cerocoder.hellopablo

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import org.junit.Rule
import org.junit.Test

/**
 * Instrumented test run on a real Android emulator (see
 * .github/workflows/kotlin-build.yml). Asserts, through the public Compose
 * test API, that the text "Hello Pablo" is actually displayed on screen —
 * not merely that the Activity launched without crashing.
 */
class MainActivityInstrumentedTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun helloPabloTextIsDisplayed() {
        composeTestRule
            .onNodeWithText("Hello Pablo")
            .assertIsDisplayed()
    }
}
