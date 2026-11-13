const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const flexBox = document.getElementById("flexbox")
const message = document.getElementById("message")

async function loadShows() {
    const url = "https://api.tvmaze.com/shows?page=0"

    try {
        message.style.display = "block"
        message.classList.remove("error")
        message.textContent = "Loading . . ."
        const res = await fetch(url)

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(`404: Show not found`)
            }
            throw new Error(`Request failed with status ${res.status}`)
        }

        const shows = await res.json()
        shows.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
        message.style.display = "none"
        message.innerHTML = ""
        fillDropdown(shows.slice(0, 25))
    }
    catch (error) {
        message.classList.add("error")
        message.textContent = error.message
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
        message.style.display = "block"
        message.classList.remove("error")
        message.textContent = "Loading . . ."
        const res = await fetch(url)

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(`404: Show not found`)
            }
            throw new Error(`Request failed with status ${res.status}`)
        }

        const show = await res.json()
        message.style.display = "none"
        message.innerHTML = ""
        displayDetails(show)
    }
    catch (error) {
        message.classList.add("error")
        message.textContent = error.message
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

function displayDetails(show) {
    showDetails.innerHTML = ""
    const showContent = document.createElement("div")
    showContent.classList.add("card")

    const showName = document.createElement("h1")
    showName.textContent = show.name
    showContent.appendChild(showName)

    const showImg = document.createElement("img")
    if (show.image) {
        showImg.src = show.image.medium
        showImg.alt = `${show.name} poster`
        showDetails.appendChild(showImg)
    }
    else {
        const noImg = document.createElement("p")
        noImg.textContent = "No poster available"
        showDetails.appendChild(noImg)
    }

    const showSummary = document.createElement("p")
    showSummary.id = "summary"
    showSummary.innerHTML = show.summary
    showContent.appendChild(showSummary)

    const showStats = document.createElement("p")
    showStats.id = "stats"
    if (show.genres.length > 0) {
        showStats.textContent = `Generes: ${show.genres.join(", ")}.`
    }
    else {
        showStats.textContent = "Not listed."
    }

    if (show.premiered) {
        showStats.textContent += ` Premier date: ${show.premiered}.`
    }
    else {
        showStats.textContent += " Premier date: Unknown."
    }

    showStats.textContent += ` Status: ${show.status}.`

    if (show.rating.average) {
        const score = show.rating.average
        let ratingClass = "rating-low"
        if (score >= 8.0) {
            ratingClass = "rating-high"
        }
        else if (score >= 6.0) {
            ratingClass = "rating-mid"
        }
        showStats.innerHTML += ` Rating: <span class="rating-badge ${ratingClass}">${score}</span>`
    }
    else {
        showStats.innerHTML += ` Rating: Not rated.`
    }
    showContent.appendChild(showStats)
    showDetails.appendChild(showContent)

}

loadShows()