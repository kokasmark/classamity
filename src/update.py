import json

def add_item(item_added):
    with open("data.json", "r+") as file:
        data = json.load(file)
        flag = False
        modified = False

        for stage in data:
            if stage["title"] == item_added["from_stage"]:
                flag = True 
            if flag:
                for cls in stage["classes"]:
                    if cls["class"] == item_added["class_name"]:
                        if item_added["category"] not in cls:
                            print(f"Category {item_added['category']} not found in class {item_added['class_name']}. Skipping.")
                            continue
                        
                        cls[item_added['category']].append({
                            "name": item_added["name"],
                            "link": item_added["link"],
                            "icon": item_added["icon"],
                            "attributes": item_added["attributes"]
                        })
                        modified = True
                        print(f"Added item to class {item_added['class_name']}' in stage '{stage['title']} under {item_added['category']}.")
            
            if stage["title"] == item_added["to_stage"]:
                flag = False  

        if not modified:
            print(f"No changes made. Verify the stages, class name, or category provided.")
        else:
            file.seek(0)
            file.truncate()
            json.dump(data, file, indent=4)
            print("Changes successfully saved.")

def remove_item(removed_item):
    with open("data.json", "r+", encoding="utf-8") as d:
        data = json.load(d)
        item_removed = False

        for s in data:
            if s["title"] == removed_item["stage"]:
                for c in s["classes"]:
                    if c["class"] == removed_item["class_name"]:
                        for category in ["weapons", "armor", "accessories", "buffsPotionsAmmo"]:
                            if category in c:
                                initial_length = len(c[category])
                                c[category] = [item for item in c[category] if item["name"] != removed_item["item_name"]]
                                if len(c[category]) < initial_length:
                                    item_removed = True
                                    print(f"Removed item: {removed_item['item_name']} from {category}")
                        break
                else:
                    print(f"Class '{removed_item['class_name']}' not found in stage '{removed_item['stage']}'")
                break
        else:
            print(f"Stage '{removed_item['stage']}' not found in the data")
        if item_removed:
            d.seek(0)
            d.truncate()
            json.dump(data, d, indent=4)
            print("Changes saved")
        else:
            print(f"Item {removed_item['item_name']} not found in the specified stage and class")
    
def parse_removed_file(removed_content):
    removed_items = []
    current_item = {
        "stage": "",
        "class_name": "",
        "item_name": ""
    }
    
    lines = removed_content.strip().split("\n")
    for line in lines:
        if line.startswith("Stage:"):
            current_item["stage"] = line.split("Stage:")[1].strip()
        elif line.startswith("Class:"):
            current_item["class_name"] = line.split("Class:")[1].strip()
        elif line.startswith("Item:"):
            current_item["item_name"] = line.split("Item:")[1].strip()
        elif line.strip() == "Remove" and current_item["item_name"]:
            removed_items.append({
                "stage": current_item["stage"],
                "class_name": current_item["class_name"],
                "item_name": current_item["item_name"]
            })
            current_item = {  # Reset the current_item for the next entry
                "stage": "",
                "class_name": "",
                "item_name": ""
            }

    # Ensure the last item is added if not already added
    if current_item["item_name"]:
        removed_items.append({
            "stage": current_item["stage"],
            "class_name": current_item["class_name"],
            "item_name": current_item["item_name"]
        })
    
    return removed_items

def parse_added_file(added_content):
    added_items = []
    lines = added_content.strip().split("\n")

    stage = None
    class_name = None
    item_name =None
    link = None
    icon = None
    attributes = []
    
    # Iterate through each line
    for i, line in enumerate(lines):
        line = line.strip()

        if line.startswith("Stage:"):
            if item_name:
                added_items.append({
                    "from_stage": stage,
                    "to_stage": stage,
                    "category": 'weapons',
                    "class_name": class_name,
                    "name": item_name,
                    "link": link,
                    "icon": icon,
                    "attributes": attributes
                })
                
                stage = None
                class_name = None
                item_name =None
                link = None
                icon = None
                attributes = []
            
            stage = line.split("Stage:")[1].strip()
        
        elif line.startswith("Class:"):
            class_name = line.split("Class:")[1].strip()
        
        elif line.startswith("Item:"):
            item_name = line.split("Item:")[1].strip()
        
        elif line.startswith("http"):  # Link or Icon
            if not link:
                link = line.strip()  # First URL is the link
            else:
                icon = line.strip()  # Second URL is the icon
        
        elif line:  # This is an attribute (anything left over is considered an attribute)
            attributes.append(str(line.strip()).lower())

    # Append the last item if necessary
    if item_name:
        added_items.append({
            "from_stage": stage,
            "to_stage": stage,
            "category": 'weapons',
            "class_name": class_name,
            "name": item_name,
            "link": link,
            "icon": icon,
            "attributes": attributes
        })

    return added_items

def parse_suggestions(added_content, removed_content):
    # Parse both added.txt and removed.txt
    added_items = parse_added_file(added_content)
    removed_items = parse_removed_file(removed_content)
    
    return added_items, removed_items

added_content = ""
removed_content = ""
with open("added.txt","r") as f:
    added_content = f.read()
with open("removed.txt","r") as f:
    removed_content = f.read()

add_list, remove_list = parse_suggestions(added_content,removed_content)

print("Added items: \n")
for item_added in add_list:
    add_item(item_added)

print("Removed items: \n")
for item_removed in remove_list:
    remove_item(item_removed)