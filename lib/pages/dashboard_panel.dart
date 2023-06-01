import 'package:flutter/material.dart';

class DashboardPanel extends StatefulWidget {
  const DashboardPanel({super.key, required this.title});

  final String title;

  @override
  State<DashboardPanel> createState() => _DashboardPanelState();
}

class _DashboardPanelState extends State<DashboardPanel> {
  bool light = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Center(
            child: Column(
                children: const <Widget>[
                  Image(image: AssetImage('assets/images/bender3.png'), width: 256, height:256,),
                ]
            )
        )
    );
  }
}