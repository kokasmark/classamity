import requests
import json
from bs4 import BeautifulSoup

def count_word_occurrences(url, word):
    response = requests.get(url)
    text = str(response.content).lower()
    word_count = text.count(word.lower())
    return word_count

def add_attribute_to_weapons(data, words, threshold=2):
    for stage in data:
        print(stage['title'])
        for cls in stage['classes']:
            print(f"\t{cls['class']}")
            for weapon in cls['weapons']:
                print(f"\t\t{weapon['name']}")
                link = weapon['link']
                for word in words:
                    for search in word["search"]:
                        word_count = count_word_occurrences(link, search)
                        if word_count >= threshold:
                            if 'attributes' not in weapon:
                                weapon['attributes'] = []
                            weapon['attributes'].append(word["attribute"])

with open('data.json', 'r') as file:
    data = json.load(file)

search_words = [{"attribute": "homing", "search": ["homing","home"]}, {"attribute": "piercing", "search": ["piercing","pierce"]}]

add_attribute_to_weapons(data, search_words)

with open('updated_data.json', 'w') as file:
    json.dump(data, file, indent=4)

