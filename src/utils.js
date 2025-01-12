function extractPrimaryColor(imageUrl, colorRank = 0, colorGranularity = 10){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, img.width, img.height);
            const pixels = imageData.data;

            const colorCount = {};
            const colors = [];

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3]; // Alpha channel

                if (a === 0) continue;

                const roundedR = Math.round(r / colorGranularity) * colorGranularity;
                const roundedG = Math.round(g / colorGranularity) * colorGranularity;
                const roundedB = Math.round(b / colorGranularity) * colorGranularity;

                const luminocity = (r + g + b) / 3;
                const key = `${roundedR},${roundedG},${roundedB}`;

                colorCount[key] = (colorCount[key] || 0) + 1;

                if (luminocity < 220 && luminocity > 30) {
                    colors.push({
                        key,
                        count: colorCount[key],
                        color: [roundedR, roundedG, roundedB],
                    });
                }
            }

            colors.sort((a, b) => b.count - a.count);
            const selectedColor = colors[colorRank]
                ? colors[colorRank].color
                : colors[colors.length - 1].color;

            resolve(`rgb(${selectedColor.join(",")})`);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };
    });
};


async function extractTerrariaBuildsFromHtml(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const stages = []; // Array to store stages

    // Get all stage headers (they are within <span class="mw-headline">)
    const stageHeaders = doc.querySelectorAll(".mw-headline");
    if (stageHeaders.length === 0) {
        console.error("No stage headers found!");
        return null;
    }

    for (const stageHeader of stageHeaders) {
        const color = await extractPrimaryColor(stageHeader.querySelector("a img").src);
        
        const currentStage = {
            title: stageHeader.innerText.trim(),
            icon: stageHeader.querySelector("a img").src,
            color: color,
            classes: []
        };

        // Find the next table after the stage header, skipping non-table elements
        let currentElement = stageHeader.parentElement.nextElementSibling;
        while (currentElement && !currentElement.classList.contains("terraria")) {
            currentElement = currentElement.nextElementSibling; // Move to the next sibling until we find the table
        }

        if (currentElement && currentElement.classList.contains("terraria")) {
            const currentTable = currentElement;
            const rows = currentTable.querySelectorAll("tbody tr"); // Get all rows in the table

            rows.forEach((row) => {
                const cells = row.querySelectorAll("td");

                if (cells.length > 0) {
                    const build = {
                        class: cells[0]?.innerText.trim() || "Unknown",
                        weapons: [],
                        armor: [],
                        accessories: [],
                        buffsPotionsAmmo: []
                    };

                    // Extract Weapons (only unique ones)
                    const weaponCell = cells[1];
                    const weaponLinks = Array.from(weaponCell.querySelectorAll("a")).filter(link => link.innerHTML && link.innerHTML.trim() != "");

                    const weaponNames = {}; // To avoid duplicates
                    weaponLinks.forEach((link, index) => {
                        const weaponName = link.title.trim();
                        if (weaponName) {
                            const weaponImage =  link.querySelector("img")?.src || ''; // Get the image URL
                            if(weaponImage != ''){
                            weaponNames[weaponName] = {
                                name: weaponName,
                                icon: weaponImage,
                                link: link.href // Link to the weapon page
                            };
                        }
                        }
                    });
                    build.weapons = Array.from(Object.values(weaponNames));

                    // Extract Armor (only unique ones)
                    const armorCell = cells[2];
                    const armorLinks = Array.from(armorCell.querySelectorAll("a")).filter(link => link.innerHTML && link.innerHTML.trim() != "");
                    const armorNames = {}; // To avoid duplicates
                    armorLinks.forEach((link, index) => {
                        const armorName = link.title.trim();
                        if (armorName) {
                            const armorImage =  link.querySelector("img")?.src || ''; // Get the image URL
                            if(armorImage != ""){
                                armorNames[armorName]={
                                    name: armorName,
                                    icon: armorImage,
                                    link: link.href // Link to the armor page
                                };
                            }
                        }
                    });
                    build.armor = Array.from(Object.values(armorNames));

                    // Extract Accessories (only unique ones)
                    const accessoryCell = cells[3];
                    const accessoryLinks = Array.from(accessoryCell.querySelectorAll("a")).filter(link => link.innerHTML && link.innerHTML.trim() != "");
                    const accessoryNames = {}; // To avoid duplicates
                    accessoryLinks.forEach((link, index) => {
                        const accessoryName = link.title.trim();
                        if (accessoryName) {
                            const accessoryImage = link.querySelector("img")?.src || ''; // Get the image URL
                            if(accessoryImage != ''){
                            accessoryNames[accessoryName]={
                                name: accessoryName,
                                icon: accessoryImage,
                                link: link.href // Link to the accessory page
                            };
                            }
                        }
                    });
                    build.accessories = Array.from(Object.values(accessoryNames));

                    // Extract Buffs, Potions, and Ammo (only unique ones)
                    const buffsCell = cells[4];
                    const buffsLinks = Array.from(buffsCell.querySelectorAll("a")).filter(link => link.innerHTML && link.innerHTML.trim() != "");
                    const buffsPotionsAmmoNames = {}; // To avoid duplicates
                    buffsLinks.forEach((link, index) => {
                        const buffName = link.title.trim();
                        if (buffName) {
                            const buffImage =  link.querySelector("img")?.src || ''; // Get the image URL
                            if(buffImage != ""){
                            buffsPotionsAmmoNames[buffName] = {
                                name: buffName,
                                icon: buffImage,
                                link: link.href // Link to the buff page
                            };
                            }
                        }
                    });
                    build.buffsPotionsAmmo = Array.from(Object.values(buffsPotionsAmmoNames));

                    // Add the build to the current stage's classes
                    const existingClass = currentStage.classes.find(cls => cls.class === build.class);
                    if (existingClass) {
                        existingClass.weapons = [...new Set([...existingClass.weapons, ...build.weapons])];
                        existingClass.armor = [...new Set([...existingClass.armor, ...build.armor])];
                        existingClass.accessories = [...new Set([...existingClass.accessories, ...build.accessories])];
                        existingClass.buffsPotionsAmmo = [...new Set([...existingClass.buffsPotionsAmmo, ...build.buffsPotionsAmmo])];
                    } else {
                        currentStage.classes.push(build);
                    }
                }
            });
        }

        // Add the current stage to the stages array
        stages.push(currentStage);
    };

    return stages;
}

// Parse from .html file
export default async function extractBuilds(filePath) {
    const response = await fetch(filePath);
    const htmlContent = await response.text();
    return extractTerrariaBuildsFromHtml(htmlContent);
}