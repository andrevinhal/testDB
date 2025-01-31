async function searchDatabase() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/andrevinhal/testDB/refs/heads/main/purecomp_data.json');
        if (!response.ok) throw new Error("Failed to load database.");
        const data = await response.json();

        // Get the input values
        let chemForm = document.getElementById("searchChemForm").value.trim();
        let trivialName = document.getElementById("searchTrivialName").value.trim();
        let minMolWeight = parseFloat(document.getElementById("searchMinMolWeight").value) || -Infinity;
        let maxMolWeight = parseFloat(document.getElementById("searchMaxMolWeight").value) || Infinity;

        // Get the results container
        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        // Check if chemForm is empty
        if (chemForm === "") {
            resultsDiv.innerHTML = `<p>Please enter a component.</p>`;
            return;
        }

        // Filter the data based on user input
        let filteredData = data.filter(entry => 
            entry.ChemForm.toLowerCase().includes(chemForm.toLowerCase()) &&
            entry.TrivialName.toLowerCase().includes(trivialName.toLowerCase()) &&
            entry.MolWeight >= minMolWeight && entry.MolWeight <= maxMolWeight
        );

        // Handle case where no results are found
        if (filteredData.length === 0) {
            resultsDiv.innerHTML = `<p>No data available.</p>`;
            return;
        }

        // Create a table to display results
        const table = document.createElement("table");
        table.border = "1";
        const headerRow = table.insertRow();
        const headers = ["ChemForm", "TrivialName", "State", "MolWeight", "Gform", "Hform", "Cp0", "Cpa", "Cpb"];

        // Create table headers
        headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });

        // Populate the table with filtered data
        filteredData.forEach((item) => {
            const row = table.insertRow();
            headers.forEach((key) => {
                const cell = row.insertCell();
                if (typeof item[key] === "number") {
                    cell.textContent = item[key].toFixed(4); // Format numbers with 4 decimal places
                } else {
                    cell.textContent = item[key];
                }
            });
        });

        // Append the table to the results container
        resultsDiv.appendChild(table);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("results").innerHTML = `<p>Error loading data.</p>`;
    }
}
