import json

stage = input("Stage: ")
className = input("Class: ")
category = input("Category: ")

name = input("Name: ")
link = input("Link: ")
icon = input("Icon: ")
attributes = input("Attributes: ")

with open("data.json","r+") as d:
    data = json.loads(d.read())
    for s in data:
        if s["title"] == stage:
            for c in s["classes"]:
                if c["class"] == className:
                    c[category].append({"name": name, "link": link, "icon": icon, "attributes": attributes.split(",")})

    d.seek(0)
    d.truncate()
    json.dump(data, d, indent=4)

print("Saved")
    