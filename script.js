const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");

async function loadShows() {
    const url = "https://api.tvmaze.com/shows?page=0"

    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`)
        }

        const shows = await res.json()
        shows.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
        shows.slice(0, 25)
        fillDropdown(shows.slice(0, 25))
        // keep only the first 25 shows after sorting
    }
    catch (error) {
        console.error(error)
    }
}

function fillDropdown(results) {
    showSelect.innerHTML = ""
    const selectAShow = document.createElement("option")
    selectAShow.textContent = "Select a show"
    selectAShow.value = ""
    showSelect.appendChild(selectAShow)

    for (let i = 0; i < results.length; i++) {
        const showSelectDropdown = document.createElement("option")
        showSelectDropdown.textContent = results[i].name
        showSelectDropdown.value = results[i].id
        showSelect.appendChild(showSelectDropdown)
    }

}

async function loadShowDetails(id) {
    const url = `https://api.tvmaze.com/shows/${id}`

    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`)
        }

        const show = await res.json()
        console.log(show)
    }
    catch (error) {
        console.error(error)
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value
    if (id === "") {
        return
    }

    loadShowDetails(id)
})

loadShows()