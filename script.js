async function generateIdeas() {

    const niche = document.getElementById("nicheInput").value;

    const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ niche })
    });

    const data = await response.json();

    document.getElementById("results").innerText = data.ideas.join("\n");
}
