import 'package:flutter/material.dart';

import 'package:barabashkahouse_dashboard/pages/my_home_page.dart';
import 'package:barabashkahouse_dashboard/pages/settings_panel.dart';
import 'package:barabashkahouse_dashboard/pages/animated_toggle_switch_test.dart';
import 'package:barabashkahouse_dashboard/pages/dashboard_panel.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MyHomePage(title: 'Барабашка'),
        '/settings': (context) => const SettingsPanel(),
        '/test1': (context) => Test1(title: 'Example'),
        '/dashboard1': (context) => DashboardPanel(title: 'Панель управления'),
      },
    );
  }
}

