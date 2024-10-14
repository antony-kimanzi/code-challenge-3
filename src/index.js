// Your code here


const movieTitle = document.querySelector("#title");
const movieRuntime = document.querySelector("#runtime");
const movieShowtime = document.querySelector("#showtime");
const movieDescription = document.querySelector("#film-info");
const tickets = document.querySelector("#ticket-num");
const button = document.querySelector("#buy-ticket");
const showingCard = document.querySelector("#showing");
const moviePoster = document.querySelector("#poster");

showingCard.addEventListener("click", (e) => {
  e.preventDefault();
});

// Display the movie details
function updateMovieDetails(film) {
  movieTitle.textContent = film.title;
  movieRuntime.textContent = `${film.runtime} minutes`;
  movieShowtime.textContent = film.showtime;
  movieDescription.textContent = film.description;
  tickets.textContent = film.capacity - film.tickets_sold;
  moviePoster.src = film.poster;
  moviePoster.alt = film.title;

  if (film.tickets_sold < film.capacity) {
    button.disabled = false;
    button.textContent = "Buy Ticket";
  } else {
    button.disabled = true;
    button.textContent = "Sold Out";
  }

  // Ticket purchase functionality
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const numTickets = Number(tickets.textContent);

    if (numTickets > 0) {
      film.tickets_sold += 1;
      alert("Ticket purchased!");

      // Update the number of tickets sold
      updateTicketsSold(film);
    } else {
      alert("Sorry, there are no tickets available.");
    }

      // POST new ticket to /tickets endpoint
    postNewTicket(film.id, 1); // Posting 1 ticket (for each purchase)
  });


}

// rendering the movie menu
const menu = document.querySelector("#films");
// clearing the menu
menu.innerHTML = "";

// create the menu
function movieMenu(film) {
  const menuItem = document.createElement("li");
  menuItem.textContent = film.title;
  menuItem.classList.add("film", "item", "list");
  //
  menuItem.setAttribute("data-id", film.id);

  if (film.tickets_sold === film.capacity) {
    menuItem.classList.add("sold-out");
  }

  //click event to update movie details when a menu item is clicked
  menuItem.addEventListener("click", () => {
    getMovieData(film.id); // Fetch the movie data when the menu item is clicked
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete");
  menuItem.appendChild(deleteButton);

  deleteButton.addEventListener("click", (e) => {
    e.target.parentElement.remove();
    deleteFilm(film); // Delete the movie data when the delete button is clicked
  });

  menu.appendChild(menuItem);
}

// Fetch movie data from server
function getMovieData(id = 1) {
  fetch(`http://localhost:3000/films/${id}`)
    .then((response) => response.json())
    .then((film) => updateMovieDetails(film));
}

// Initial render
function firstRender() {
  getMovieData();
}

firstRender();

// Fetch movie data from server and update the menu
function getMovieList() {
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((films) => films.forEach((film) => movieMenu(film)));
}

// Initial render of the menu items
function initializeMenu() {
  getMovieList();
}

initializeMenu();

function updateTicketsSold(film) {
  fetch(`http://localhost:3000/films/${film.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickets_sold: film.tickets_sold,
    }),
  }).then((response) => response.json());
}

function deleteFilm(film) {
  fetch(`http://localhost:3000/films/${film.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((film) => console.log(film));
}

// Function to POST a new ticket to the /tickets endpoint
function postNewTicket(film_id, number_of_tickets) {
  fetch("http://localhost:3000/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      film_id: film_id,
      number_of_tickets: number_of_tickets,
    }),
  })
    .then((res) => res.json())
    .then((ticket) => {
      console.log("New ticket added:", ticket);
      // Handle the response or display ticket info as needed
    });
}
