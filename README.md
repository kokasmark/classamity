# Classamity

A fast and clean UI for the **Terraria** mod **Calamity** builds.

## Contributing
Help is only needed with the guide, for that only the `data.json` should be edited in the `/src` directory.

Pull request that edit something else wont be pulled!

- Fork the repository
- Edit `data.json`
  ```json
  "stages":[
      {
        "title": "Stage Name",
        "classes": [
            {
            "class": "Melee",
            "weapons": [
                {"name":"Weapon Name",
                 "link": "Weapon Link",
                 "icon": "/classamity/prehardmode_files/icon",
                 "attributes": ["homing","piercing"]},
                 {"name":"Weapon Name",
                 "link": "Weapon Link",
                 "icon": "/classamity/hardmode_files/icon",
                 "attributes": ["homing","piercing"]},
                 ...
            ],
            "armor": [
                    {
                        "name": "Armor Name",
                        "icon": "/classamity/postmoonlord_files/icon",
                        "link": "Armor Link"
                    }
                    ...
                ]}
                ...
        ]}
    ]
  ```
- Create a **Pull request**

![](./screenshots/screenshot.png)
![](./screenshots/screenshot1.png)
![](./screenshots/screenshot2.png)
