
let recordIds = {};

const JSONBIN_MASTER_KEY = "$2a$10$hORAwDmKLYlTkmX63b1hxu6Yw2wlOyE8eVbn5xEDAlv7zk76EdkSS"";
const JSONBIN_BIN_ID = "69dceb31856a6821892bc2eb";

async function loadRecordIds() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/xl/b/${JSONBIN_BIN_ID}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY,
                'X-Bin-Meta': 'false'
            }
        });
        const data = await response.json();
        recordIds = data[recordPageKey] || {};
        console.log("Loaded record IDs for page:", recordIds);
    } catch (error) {
        console.error("Failed to load record IDs:", error);
        recordIds = {};
    }
}

async function saveRecordIds() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/xl/b/${JSONBIN_BIN_ID}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY,
                'X-Bin-Meta': 'false'
            }
        });
        const allIds = await response.json();

        allIds[recordPageKey] = recordIds;

        await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY
            },
            body: JSON.stringify(allIds)
        });
        console.log("Record IDs saved");
    } catch (error) {
        console.error("Failed to save record IDs:", error);
    }
}


// Function to handle button click
function handleDynamicButtonClick(INI) {
    // Get the corresponding input element
    const textbox = document.getElementById(`input-${INI}`);
    console.log(textbox.value)
    let currentValue = textbox.value;

    // Step a) Copy the current value to clipboard if it's not empty
    if (currentValue.trim() !== '') {
        copyToClipboard(currentValue)
    }

    // Step b) Increment the value by 1
    let incrementedValue = parseInt(currentValue, 10) || 0; // Default to 0 if not a valid number
    incrementedValue++;

    // Step c) Update the textbox value
    textbox.value = incrementedValue;

    // Step d) Save the new value in json
    recordIds[INI] = incrementedValue;
    saveRecordIds();
}

// Function to populate inputs and buttons dynamically
function populateDynamicInputs(list) {
    const container = document.getElementById('dynamic-container');

    list.forEach(INI => {
        // Create a wrapper div
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'flex-start';
        div.style.gap = '10px';
        div.style.marginBottom = '10px'; // Add space after each row

        // Create label or span for INI
        const label = document.createElement('span');
        label.textContent = INI + ":";
        // label.style.fontWeight = 'bold';    // Optional: Make the label bold
        label.style.minWidth = '20px';    // Optional: Fixed width for alignment
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${INI}`;
        input.placeholder = `Enter next number...`;
        input.style.padding = '5px';
        input.style.width = '120px';

        const savedValue = recordIds[INI];
        if (savedValue !== undefined && savedValue !== null && savedValue !== "") {
            input.value = savedValue;
        }

        // Create button element
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.onclick = () => handleDynamicButtonClick(INI);

        // Append label, input and button to wrapper div
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(button);

        // Append wrapper div to container
        container.appendChild(div);
    });
    // Create a wrapper div
    const resetDiv  = document.createElement('div');
    resetDiv .style.display = 'flex';
    resetDiv .style.alignItems = 'center';
    resetDiv .style.justifyContent = 'flex-start';
    resetDiv .style.gap = '10px';
    resetDiv .style.marginBottom = '10px'; // Add space after each row

    // Create button element
    const resetButton  = document.createElement('button');
    resetButton .textContent = 'Reset IDs';
    resetButton .style.padding = '5px 10px';
    resetButton .style.cursor = 'pointer';
    resetButton .onclick = () => {
        window.open('clear_storage.html', '_blank');
    };
    // Append button to div
    resetDiv .appendChild(resetButton );
    // Append wrapper div to container
    container.appendChild(resetDiv );
}


// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    await loadRecordIds();
    populateDynamicInputs(pageRecordTypes);
});
