async function searchDatabase() {
    try {
        const gitlabToken = "glpat-AXyvHkunJMtQTPzz2DiX";
        const filePath = "Database Creation/SRC_json/purecomp_data.json";
        const projectID = "6900";
        const encodedFilePath = encodeURIComponent(filePath);

        const response = await fetch(`https://gitlab.gbar.dtu.dk/api/v4/projects/${projectID}/repository/files/${encodedFilePath}/raw?ref=master`, {
            headers: {
                "PRIVATE-TOKEN": gitlabToken
            }
        });

        //const response = await fetch('https://gitlab.gbar.dtu.dk/api/v4/projects/6900/repository/files/Database%20Creation%2FSRC_json%2Fpurecomp_data.json/raw?ref=master');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to load database: ${errorText}`);
        }

        const responseText = await response.text();
        console.log("Response Text:", responseText); // Log the response text

        const data = JSON.parse(responseText); // Parse the response text as JSON

        let chemForm = document.getElementById("searchChemForm").value.trim();
        let minTemp = parseFloat(document.getElementById("minTemp").value) || -Infinity;
        let maxTemp = parseFloat(document.getElementById("maxTemp").value) || Infinity;
        let minPres = parseFloat(document.getElementById("minPres").value) || -Infinity;
        let maxPres = parseFloat(document.getElementById("maxPres").value) || Infinity;
        let minConc = parseFloat(document.getElementById("minConc").value) || -Infinity;
        let maxConc = parseFloat(document.getElementById("maxConc").value) || Infinity;

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        if (chemForm === "") {
            resultsDiv.innerHTML = `<p>Please enter a component.</p>`;
            return;
        }

        let filteredData = data.filter(entry => 
            entry.ChemForm.toLowerCase().includes(chemForm.toLowerCase()) &&
            entry.Temp >= minTemp && entry.Temp <= maxTemp &&
            entry.Pres >= minPres && entry.Pres <= maxPres &&
            entry.Conc >= minConc && entry.Conc <= maxConc
        );

        if (filteredData.length === 0) {
            resultsDiv.innerHTML = `<p>No data available.</p>`;
            return;
        }

        let groupedData = {};
        filteredData.forEach(entry => {
            let reference = `${entry.Authors}, ${entry.Journal}, ${entry.Publication}`;
            if (!groupedData[reference]) {
                groupedData[reference] = [];
            }
            groupedData[reference].push(entry);
        });

        for (let reference in groupedData) {
            groupedData[reference].sort((a, b) => a.Conc - b.Conc);

            let dataPointCount = groupedData[reference].length;

            let tableHTML = `<h3>${reference}</h3>`;
            tableHTML += `<h4>Number of Data Points: ${dataPointCount}</h4>`
            tableHTML += `
                <table border="1">
                    <tr>
                        <th>UnitConc</th>
                        <th>UnitTemp</th>
                        <th>UnitPres</th>
                        <th>UnitDens</th>
                        <th>Data Quality</th>
                    </tr>
                    <tr>
                        <td>${groupedData[reference][0].UnitConc}</td>
                        <td>${groupedData[reference][0].UnitTemp}</td>
                        <td>${groupedData[reference][0].UnitPres}</td>
                        <td>${groupedData[reference][0].UnitDens}</td>
                        <td>${groupedData[reference][0].DataQuality}</td>
                    </tr>
                </table>
            `;

            tableHTML += `<table border="1"><tr><th>Conc</th><th>Temp</th><th>Pres</th><th>Density</th></tr>`;
            groupedData[reference].forEach(entry => {
                tableHTML += `
                    <tr>
                        <td>${entry.Conc.toFixed(4)}</td>
                        <td>${entry.Temp.toFixed(4)}</td>
                        <td>${entry.Pres.toFixed(4)}</td>
                        <td>${entry.Density.toFixed(4)}</td>
                    </tr>
                `;
            });
            tableHTML += `</table><br>`;
            resultsDiv.innerHTML += tableHTML;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("results").innerHTML = `<p>No data available.</p>`;
    }
}
