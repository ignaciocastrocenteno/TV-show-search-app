const form = document.querySelector("#searchForm");

const requestData = async (userInput) => {
  try {
    /*  const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${userInput}`
        );
        const data = await response.json();
        console.log(response);
        const imgURL = data[0].show.image.medium; */

    /* To keep the code DRY, always add the 'Query String' inside the second argument object that's being sent to the 
    API, under the property name 'params'. It's the same object we use to send the 'HTTP Headers' */
    const config = {params: {q: userInput}, headers: {}};
    const response = await axios.get(
      // `https://api.tvmaze.com/search/shows?q=${userInput}`,
      "https://api.tvmaze.com/search/shows",
      config
    );
    console.log(response);
    return response;
  } catch (e) {
    return 0;
  }
};

const createItems = (showsData) => {
  if (showsData.length >= 1) {
    for (let i = 0; i < showsData.length; i++) {
      // Sometimes the 'image property' is already set to null, having no image to show. We've got to handle that case
      if (showsData[i].show.image !== null) {
        const imgURL = showsData[i].show.image.medium;
        console.log(imgURL);
        const newImg = document.createElement("img");
        newImg.setAttribute("src", imgURL);
        newImg.classList.add("show-photo");
        showItem(newImg);
      } else {
        // Whether no image is available to display, we create a div that works as a holder
        const newDiv = document.createElement("div");
        const showTitle = document.createElement("h3");
        showTitle.innerHTML = `<em>${showsData[i].show.name}</em>`;
        showTitle.classList.add("show-photo-availability");
        const notAvailable = document.createElement("h4");
        notAvailable.innerHTML = "<br/><strong>(Image not available)</strong>";
        notAvailable.classList.add("show-photo-availability");
        newDiv.append(showTitle, notAvailable);
        newDiv.classList.add("show-photo");
        showItem(newDiv);
      }
    }
    document.querySelector("#showsContainer").style.display = "flex";
  } else {
    alert("NO RESULTS FOUND!");
  }
};

const showItem = (itemToAdd) => {
  document.querySelector("#showsContainer").append(itemToAdd);
};

// We could either use a click or submit events to listen to the submition of the form
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Extracting the data from the input field - there're different ways to achieve this goal
  // Recalling the 'elements property' which is always available in the object where the event had been applied
  const userInput = this.elements.searchBar.value;
  //const userInput = document.querySelector("input[name="query"]");
  if (userInput) {
    console.log("THE FORM SUBMITTION WAS SUCCESSFULLY");
    const response = await requestData(userInput);
    if (Array.isArray(response.data)) {
      createItems(response.data);

      // Cleaning up the input search field, right after the search was performed
      this.elements.searchBar.value = "";
    }
  }
});

// Creating a function to clear all the shows currently being displayed on the chart
const cleaningButton = document.querySelector("#cleaningButton");
cleaningButton.addEventListener("click", (e) => {
  e.preventDefault();
  const itemsToDelete = document.querySelector("#showsContainer");

  // Quick way to delete all the HTML tags which live inside other tags
  itemsToDelete.innerHTML = "";

  // Hiding the shows chart again after the cleaning was performed
  itemsToDelete.style.display = "none";
});
