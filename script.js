async function fetchData() {
    const url = "https://raw.githubusercontent.com/andrevinhal/testDB/refs/heads/main/data.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Render table
        const container = document.getElementById("github-data");
        container.innerHTML =
            "<table border='1'>" +
            "<tr><th>ID</th><th>Name</th><th>Description</th><th>Price</th></tr>" +
            data.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.price}</td>
                </tr>
            `).join("") +
            "</table>";

        // Add filter functionality
        document.getElementById("filter-input").addEventListener("input", (event) => {
            const query = event.target.value.toLowerCase();
            const filteredData = data.filter(item =>
                item.name.toLowerCase().includes(query)
            );

            container.innerHTML =
                "<table border='1'>" +
                "<tr><th>ID</th><th>Name</th><th>Description</th><th>Price</th></tr>" +
                filteredData.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>${item.price}</td>
                    </tr>
                `).join("") +
                "</table>";
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("github-data").innerText = "Failed to load data.";
    }
}

fetchData();
