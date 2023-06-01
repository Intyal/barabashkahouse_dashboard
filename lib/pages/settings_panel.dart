import 'package:flutter/material.dart';

class SettingsPanel extends StatefulWidget {
  const SettingsPanel({super.key});

  @override
  State<SettingsPanel> createState() => _SettingsPanelState();
}

class _SettingsPanelState extends State<SettingsPanel> {
  bool light = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Настройки'),
        ),
        body: Center(
            child: Column(
                children: <Widget>[
                  const Card(
                    child: ListTile(
                      leading: Icon(Icons.ad_units),
                      title: Text('MQTT брокеры'),
                    ),
                  ),
                  const Card(
                    child: ListTile(
                      leading: Icon(Icons.add_business),
                      title: Text('Темы'),
                    ),
                  ),
                  Card(
                    child: ListTile(
                      leading: const Icon(Icons.add_business),
                      title: const Text('Переключатель'),
                        trailing: Switch (
                          value: light,
                          activeColor: Colors.red,
                          onChanged: (bool value) {
                            // This is called when the user toggles the switch.
                            setState(() {
                              light = value;
                            });
                          },
                        )
                    ),
                  ),
                  Card(
                    child: ListTile(
                      title: const Text('Пример 1'),
                      trailing: IconButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/test1');
                        },
                        icon: const Icon(Icons.exit_to_app),
                      ),
                    ),
                  ),
                  Card(
                    child: ListTile(
                      title: const Text('Панель управления'),
                      trailing: const Icon(Icons.dashboard),
                      onTap: () {
                        Navigator.pushNamed(context, '/dashboard1');
                      },
                    ),
                  ),
                ]
            )
        )
    );
  }
}