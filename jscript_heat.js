async function searchDatabase() {
    try{
        const response = await fetch('https://raw.githubusercontent.com/andrevinhal/testDB/refs/heads/main/heat_data.json');
        if (!response.ok) throw new Error("Failed to load database.");
        const data = await response.json();
        
        let chemForm = document.getElementById("searchChemForm").value.trim();
        let minTemp = parseFloat(document.getElementById("minTemp").value) || -Infinity;
        let maxTemp = parseFloat(document.getElementById("maxTemp").value) || Infinity;
        let minInitConc = parseFloat(document.getElementById("minInitConc").value) || -Infinity;
        let maxInitConc = parseFloat(document.getElementById("maxInitConc").value) || Infinity;
        let minFinalConc = parseFloat(document.getElementById("minFinalConc").value) || -Infinity;
        let maxFinalConc = parseFloat(document.getElementById("maxFinalConc").value) || Infinity;

        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        if (chemForm === ""){
            resultsDiv.innerHTML = `<p>Please enter a component.</p>`;
            return;
        }
        
        let filteredData = data.filter(entry => 
            entry.ChemForm.toLowerCase().includes(chemForm.toLowerCase()) &&
            entry.Temp >= minTemp && entry.Temp <= maxTemp &&
            entry.InitConc >= minInitConc && entry.InitConc <= maxInitConc
        );

        if (filteredData.length === 0){
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
            // Sort data by Concentration in ascending order
            groupedData[reference].sort((a, b) => a.InitConc - b.InitConc);
    
            // Count the number of data points
            let dataPointCount = groupedData[reference].length;
    
            let tableHTML = `<h3>${reference}</h3>`;
            tableHTML += `<h4>Number of Data Points: ${dataPointCount}</h4>`
            tableHTML += `
                <table border="1">
                    <tr>
                        <th>UnitConc</th>
                        <th>UnitTemp</th>
                        <th>UnitHeat</th>
                        <th>Data Quality</th>
                    </tr>
                    <tr>
                        <td>${groupedData[reference][0].UnitConc}</td>
                        <td>${groupedData[reference][0].UnitTemp}</td>
                        <td>${groupedData[reference][0].UnitHeat}</td>
                        <td>${groupedData[reference][0].DataQuality}</td>
                    </tr>
                </table>
            `;
    
            tableHTML += `<table border="1"><tr><th>InitConc</th><th>FinalConc</th><th>Temp</th><th>DilutionHeat</th></tr>`;
            groupedData[reference].forEach(entry => {
                tableHTML += `
                    <tr>
                        <td>${entry.InitConc.toFixed(4)}</td>
                        <td>${entry.FinalConc.toFixed(4)}</td>
                        <td>${entry.Temp.toFixed(4)}</td>
                        <td>${entry.DilutionHeat.toFixed(4)}</td>
                    </tr>
                `;
            });
            tableHTML += `</table><br>`;
            resultsDiv.innerHTML += tableHTML;
        }
    } catch(error){
        console.error("Error:", error);
        document.getElementById("results").innerHTML = `<p>No data available.</p>`;
    }
}
