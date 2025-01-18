import requests
import json
from bs4 import BeautifulSoup

# Function to count occurrences of the word in the page content
def count_word_occurrences(url, word):
    response = requests.get(url)
    text = str(response.content).lower()
    word_count = text.count(word.lower())
    return word_count

# Function to add attributes if the threshold is exceeded
def add_attribute_to_weapons(data, words, threshold=3):
    for stage in data:
        print(stage['title'])
        for cls in stage['classes']:
            print(f"\t{cls['class']}")
            for weapon in cls['weapons']:
                print(f"\t\t{weapon['name']}")
                link = weapon['link']
                for word in words:
                    word_count = count_word_occurrences(link, word)
                    if word_count >= threshold:
                        print(f"Found '{word}' {word_count} times in {weapon['name']} ({link})")
                        if 'attributes' not in weapon:
                            weapon['attributes'] = []
                        weapon['attributes'].append(word)

# Load the data.json file
with open('data.json', 'r') as file:
    data = json.load(file)

# List of words to search for
search_words = ["homing", "piercing"]

# Run the function to update the weapons data
add_attribute_to_weapons(data, search_words)

# Save the updated data back to the file (optional)
with open('updated_data.json', 'w') as file:
    json.dump(data, file, indent=4)

