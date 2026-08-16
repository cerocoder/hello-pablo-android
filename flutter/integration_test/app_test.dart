import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:hello_pablo/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Hello Pablo text is visible on screen', (tester) async {
    await tester.pumpWidget(const HelloPabloApp());
    await tester.pumpAndSettle();

    expect(find.text('Hello Pablo'), findsOneWidget);
  });
}
