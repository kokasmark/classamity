import json

stage = input("Stage: ").strip()
className = input("Class: ").strip()
item_name = input("Item: ").strip()

with open("data.json", "r+", encoding="utf-8") as d:
    data = json.load(d)
    item_removed = False

    for s in data:
        if s["title"] == stage:
            for c in s["classes"]:
                if c["class"] == className:
                    for category in ["weapons", "armor", "accessories", "buffsPotionsAmmo"]:
                        if category in c:
                            initial_length = len(c[category])
                            c[category] = [item for item in c[category] if item["name"] != item_name]
                            if len(c[category]) < initial_length:
                                item_removed = True
                                print(f"Removed item: {item_name} from {category}")
                    break
            else:
                print(f"Class '{className}' not found in stage '{stage}'")
            break
    else:
        print(f"Stage '{stage}' not found in the data")
    if item_removed:
        d.seek(0)
        d.truncate()
        json.dump(data, d, indent=4)
        print("Changes saved")
    else:
        print(f"Item '{item_name}' not found in the specified stage and class")
