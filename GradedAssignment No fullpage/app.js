function createBookCard(book) {
  const isReserved = book.reserved || false; // Check if the book is initially reserved

  return `
    <div class="col-md-4 mb-4">
      <div class="card" data-book-id="${
        book.id
      }" data-bs-toggle="modal" data-bs-target="#bookModal">
        <img src="${book.image}" class="card-img-top" alt="${book.title}">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-peach btn-block reserve-btn" type="button" ${
            isReserved ? "disabled" : ""
          } data-bs-dismiss="modal">
            ${isReserved ? "Reserved" : "Reserve"}
          </button>
        </div>
      </div>
    </div>
  `;
}
// Add event listener to open modal when clicking on card
function addCardClickListener() {
  $(".card").on("click", function () {
    const bookId = $(this).data("book-id");
    const book = booksData.find((book) => book.id === bookId);
    if (book) {
      // Open the modal with the book details
      $("#exampleModalLabel").text(book.title);
      $("#author").text(book.author);
      $("#description").text(book.description);
      // You might need to update other modal content here
      $("#bookModal").modal("show");
    }
  });
}

function addAudioButtonListeners() {
  $("#bookModal").on("shown.bs.modal", function () {
    // Add event listener to the "Play Audio" button inside the modal
    $("#playAudio").on("click", function () {
      console.log("Button clicked"); // Debug message
      const title = $("#exampleModalLabel").text();
      const author = $("#author").text();
      const description = $("#description").text();

      const contentToSpeak = `${title}. Author: ${author}. Description: ${description}`;

      console.log("Content to speak:", contentToSpeak); // Debug message

      speakContent(contentToSpeak);
    });
  });
}

// Function to speak the content
function speakContent(content) {
  const utterance = new SpeechSynthesisUtterance(content);
  speechSynthesis.speak(utterance);
}
function filterBookCards(searchInput) {
  const filteredBooks = booksData.filter((book) => {
    const searchValue = searchInput.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue) ||
      book.genre.toLowerCase().includes(searchValue) ||
      book.year.toString().includes(searchValue) ||
      book.type.toLowerCase().includes(searchValue)
    );
  });
  return filteredBooks;
}
// Function to filter book cards based on search input
function filterBookCards(searchInput) {
  const filteredBooks = booksData.filter((book) => {
    const searchValue = searchInput.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue) ||
      book.genre.toLowerCase().includes(searchValue) ||
      book.year.toString().includes(searchValue) ||
      book.type.toLowerCase().includes(searchValue)
    );
  });
  return filteredBooks;
}

// Function to render filtered books
function renderFilteredBooks(filteredBooks) {
  const bookCardsContainer = $("#bookCardsContainer");
  const maxCards = 6;

  // Show only the first 6 filtered books
  const filteredSlice = filteredBooks.slice(0, maxCards);

  // Clear the existing cards
  bookCardsContainer.empty();

  // Render and animate book cards
  filteredSlice.forEach((book, index) => {
    const bookCardHTML = createBookCard(book);
    const $bookCard = $(bookCardHTML).css({ opacity: 0 });

    // Append the card to the container
    bookCardsContainer.append($bookCard);

    // Animate the card
    anime({
      targets: $bookCard[0],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: index * 100,
      easing: "easeOutQuad",
    });

    // Initialize Tippy.js tooltips after rendering filtered cards
    initTooltips();

    // Add event listener for Reserve buttons in filtered cards
    $bookCard.find(".reserve-btn").on("click", function () {
      const card = $(this).closest(".card");
      const bookId = card.data("book-id");
      const book = filteredBooks.find((book) => book.id === bookId);

      if (book && !book.reserved) {
        // Update the button and book data
        $(this).text("Reserved").prop("disabled", true);
        book.reserved = true;
        console.log(`Book ${book.title} reserved.`);
      }
    });
  });
}

// Call the function to render filtered books when the page loads
$(document).ready(function () {
  const searchInput = $("#searchInput").val();
  const filteredBooks = filterBookCards(searchInput);
  renderFilteredBooks(filteredBooks); // Corrected function call
  addAudioButtonListeners();
});
// Function to add event listeners for audio buttons inside the modal
function addAudioButtonListeners() {
  // Add event listener to the "Play Audio" button inside the modal
  $("#bookModal").on("click", "#playAudio", function () {
    // Get the text content from the modal
    const title = $("#exampleModalLabel").text();
    const author = $("#author").text();
    const description = $("#description").text();

    // Concatenate the content to speak
    const contentToSpeak = `${title}. Author: ${author}. Description: ${description}`;

    // Speak the content
    speakContent(contentToSpeak);
  });
}

// app.js

// Function to render book cards on the page with animation

function initTooltips() {
  tippy(".card", {
    content: "Loading...", // You can customize the loading content
    onShow(instance) {
      const bookId = $(instance.reference).data("book-id");
      const book = booksData.find((book) => book.id === bookId);

      if (book) {
        // Display only the book title in the tooltip
        instance.setContent(book.title);

        // Replace the title in the modal with the book title
        $("#exampleModalLabel").text(book.title);

        // Set author and description content in the modal
        $("#author").text(book.author);
        $("#description").text(book.description);
      } else {
        instance.setContent("Book information not available");
      }
    },
  });
}

$(document).ready(function () {
  $("#searchBtn").on("click", function () {
    const searchInput = $("#searchInput").val();
    const filteredBooks = filterBookCards(searchInput);
    renderFilteredBooks(filteredBooks);
  });
});
function generateReservationChartData() {
  const genres = [...new Set(booksData.map((book) => book.genre))]; // Get unique genres

  // Function to generate a random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const data = {
    labels: genres,
    datasets: [
      {
        label: "Books Yet to Be Reserved",
        data: genres.map((genre) => {
          const booksInGenre = booksData.filter(
            (book) => book.genre === genre && !book.reserved
          );
          return booksInGenre.length;
        }),
        backgroundColor: genres.map(() => getRandomColor()), // Generate random colors for each genre
        borderColor: "rgba(75, 192, 192, 1)", // You can set a border color if needed
        borderWidth: 1,
      },
    ],
  };

  return data;
}

function initReservationChart() {
  const ctx = document.getElementById("reservationChart").getContext("2d");
  const data = generateReservationChartData();

  new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      scales: {
        x: { title: { display: true, text: "Genre" } },
        y: { title: { display: true, text: "Number of Books" } },
      },
    },
  });
}

function initInventoryTable(data) {
  $("#inventoryTable").DataTable({
    data: data,
    columns: [
      { data: "title" },
      { data: "author" },
      { data: "genre" },
      { data: "year" },
      { data: "type" },
    ],
    pageLength: 10,
    lengthMenu: [10, 20, 50],
    dom: '<"top"lf>rt<"bottom"ip>',
    lengthChange: false,
    language: {
      emptyTable: "No data available in table",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: "Showing 0 to 0 of 0 entries",
      infoFiltered: "(filtered from _MAX_ total entries)",
      zeroRecords: "No matching records found",
      search: "Search:",
      paginate: {
        previous: "Previous",
        next: "Next",
      },
    },
    drawCallback: function () {
      // Apply background color to odd rows after table is drawn
      $("#inventoryTable tbody tr:odd").css("background-color", "peachpuff");

      // Add a class to the title row for custom styling
      $("#inventoryTable thead tr").addClass("table-peachpuff");
    },
  });
}
// Function to fetch and format data from booksData.js
function fetchAndFormatInventoryData() {
  // Assuming booksData.js is included before app.js
  if (typeof booksData !== "undefined" && Array.isArray(booksData)) {
    // Format the data to match the DataTable structure
    const inventoryData = booksData.map((book) => ({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      type: book.type,
    }));

    // Call the function to initialize the DataTable with inventoryData
    initInventoryTable(inventoryData);
  } else {
    console.error("booksData is not defined or not an array.");
  }
}
$(document).ready(function () {
  fetchAndFormatInventoryData();
});
$(document).ready(() => {
  const bookCardsContainer = $("#bookCardsContainer");
  const maxCards = 6;

  function renderFilteredBooks(filteredBooks) {
    const bookCardsContainer = $("#bookCardsContainer");
    const maxCards = 6;

    // Show only the first 6 filtered books
    const filteredSlice = filteredBooks.slice(0, maxCards);

    // Clear the existing cards
    bookCardsContainer.empty();

    // Render and animate book cards
    filteredSlice.forEach((book, index) => {
      const bookCardHTML = createBookCard(book);
      const $bookCard = $(bookCardHTML).css({ opacity: 0 });

      // Append the card to the container
      bookCardsContainer.append($bookCard);

      // Animate the card
      anime({
        targets: $bookCard[0],
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: index * 100,
        easing: "easeOutQuad",
      });

      // Initialize Tippy.js tooltips after rendering filtered cards
      initTooltips();

      // Add event listener for Reserve buttons in filtered cards
      $bookCard.find(".reserve-btn").on("click", function () {
        const card = $(this).closest(".card");
        const bookId = card.data("book-id");
        const book = filteredBooks.find((book) => book.id === bookId);

        if (book && !book.reserved) {
          // Update the button and book data
          $(this).text("Reserved").prop("disabled", true);
          book.reserved = true;
          console.log(`Book ${book.title} reserved.`);
        }
      });
    });
  }

  renderFilteredBooks(booksData);

  // Event listener for search input changes
  $("#loadMoreBtn").on("click", function () {
    const searchInput = $("#searchInput").val();
    const filteredBooks = filteredBooks(searchInput);

    const currentCount = $("#bookCardsContainer").children().length;
    const nextBooks = filteredBooks.slice(currentCount, currentCount + 6);

    // Render the next set of books
    nextBooks.forEach((book) => {
      const bookCardHTML = createBookCard(book);
      $("#bookCardsContainer").append(bookCardHTML);
    });

    // Show/Hide "Load More" button based on the number of filtered books
    if (filteredBooks.length > currentCount + 6) {
      $("#loadMoreBtn").show();
    } else {
      $("#loadMoreBtn").hide();
    }
  });
  initReservationChart();
});

// Add an event listener for the dark mode toggle button
$(document).ready(function () {
  // Check if the user has a preference for dark mode
  const darkModePreferred = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;

  // Set initial dark mode based on user preference
  if (darkModePreferred) {
    enableDarkMode();
  }

  // Toggle dark mode on button click
  $("#darkModeToggle").on("click", function () {
    if ($("body").hasClass("dark-mode")) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  // Function to enable dark mode
  function enableDarkMode() {
    $("body").addClass("dark-mode");
  }

  // Function to disable dark mode
  function disableDarkMode() {
    $("body").removeClass("dark-mode");
  }
});
/*
$(document).ready(function () {
  $('#fullpage').fullpage({
    // Set options for fullPage.js
    scrollOverflow: true, // Enable scroll inside sections if their content exceeds the viewport height
    scrollOverflowReset: true, // Reset scroll overflow content on section change
    normalScrollElements: '.fp-scrollable', // Specify elements inside sections that should be scrollable

    // Set callbacks for fullPage.js events
    afterLoad: function (origin, destination, direction) {
      // Enable or disable scrolling based on the active section
      if (destination.index == 0) {
        $.fn.fullpage.setAllowScrolling(true, 'down, up');
      } else {
        $.fn.fullpage.setAllowScrolling(false);
      }
    },
  });
});
*/
