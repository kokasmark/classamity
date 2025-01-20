import json

from_stage = input("From Stage: ")
to_stage = input("To Stage (leave empty to use From Stage): ")
to_stage = to_stage if to_stage else from_stage
class_name = input("Class: ")
category = input("Category (weapons/armor): ")

name = input("Item Name: ")
link = input("Item Link: ")
icon = input("Item Icon URL: ")
attributes = input("Attributes (comma-separated): ")

with open("data.json", "r+") as file:
    data = json.load(file)
    flag = False
    modified = False

    for stage in data:
        if stage["title"] == from_stage:
            flag = True 
        if flag:
            for cls in stage["classes"]:
                if cls["class"] == class_name:
                    if category not in cls:
                        print(f"Category '{category}' not found in class '{class_name}'. Skipping.")
                        continue
                    
                    cls[category].append({
                        "name": name,
                        "link": link,
                        "icon": icon,
                        "attributes": attributes.split(",")
                    })
                    modified = True
                    print(f"Added item to class '{class_name}' in stage '{stage['title']}' under '{category}'.")
        
        if stage["title"] == to_stage:
            flag = False  

    if not modified:
        print(f"No changes made. Verify the stages, class name, or category provided.")
    else:
        file.seek(0)
        file.truncate()
        json.dump(data, file, indent=4)
        print("Changes successfully saved.")

print("\n--- Summary of Changes ---")
if modified:
    print(f"Added item '{name}' to class '{class_name}' under '{category}' from '{from_stage}' to '{to_stage}'.")
else:
    print("No modifications were made.")

    