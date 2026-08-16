import 'package:flutter/material.dart';

void main() {
  runApp(const HelloPabloApp());
}

/// Root widget of the "Hello Pablo" demo app.
///
/// Deliberately minimal: one [StatelessWidget], one [Scaffold], one
/// static [Text]. No navigation, no input, no state.
class HelloPabloApp extends StatelessWidget {
  const HelloPabloApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello Pablo'),
        ),
      ),
    );
  }
}
