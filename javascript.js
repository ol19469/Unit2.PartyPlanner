const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-FTB-MT-WEB-PT/events`;

const state = {
  parties: [],
};

async function getParties() {
  try {
    const data = await fetch(API_URL);
    if (!data.ok) throw new Error(`Error: ${data.status}`);
    const parties = await data.json();
    state.parties = parties.data;
    renderParties();
  } catch (error) {
    console.error("Failed to fetch parties:", error);
  }
}

async function addParties(party) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(party),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    console.log("Party added successfully!");
    await getParties(); // Fetch updated data after adding a party
  } catch (error) {
    console.error("Failed to add party:", error);
  }
}

function renderParties() {
  const partyList = document.querySelector("#parties");

  if (!partyList) {
    console.error("Element with ID 'parties' not found");
    return;
  }

  if (state.parties.length === 0) {
    partyList.innerHTML = "<li>No parties added yet.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const card = document.createElement("li");
    card.innerHTML = `
        <h2>${party.name}</h2>
        <p><strong>Description:</strong> ${party.description}</p>
        <p><strong>Date:</strong> ${party.date}</p>
        <p><strong>Location:</strong> ${party.location}</p>
      `;
    return card;
  });

  partyList.replaceChildren(...partyCards);
}

async function render() {
  await getParties();
}
render();
const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const party = {
    name: form.eventName.value,
    description: form.description.value,
    date: new Date(form.date.value).toISOString(),
    location: form.location.value,
  };
  await addParties(party);
});
