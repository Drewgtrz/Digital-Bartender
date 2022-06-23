var vodkaButton = document.getElementById("vodka-btn");
var tequilaButton = document.getElementById("tequila-btn");
var rumButton = document.getElementById("rum-btn");
var whiskeyButton = document.getElementById("whiskey-btn");
var scotchButton = document.getElementById("scotch-btn");
var ginButton = document.getElementById("gin-btn");
vodkaButton.addEventListener("click", function () {
  getDrinkList("vodka");
});
tequilaButton.addEventListener("click", function () {
  getDrinkList("tequila");
});
rumButton.addEventListener("click", function () {
  getDrinkList("rum");
});
whiskeyButton.addEventListener("click", function () {
  getDrinkList("whiskey");
});
scotchButton.addEventListener("click", function () {
  getDrinkList("scotch");
});
ginButton.addEventListener("click", function () {
  getDrinkList("gin");
});
let displayContainer = document.getElementById("display-container");

//******************functions for fetching data******************
//this fetches list on initial load. fetches the list of drinks and pushes them into the array. displayList fn will render the data and setupPagination will create the pagination

var list_items = [];
//fetches for initial load of the drink list
fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=vodka`)
  .then((res) => res.json())
  .then(function (data) {
    let drinkList = data.drinks;
    list_items = [];
    for (let index = 0; index < drinkList.length; index++) {
      list_items.push(drinkList[index]);
    }
    console.log("list items:", list_items);
    DisplayList(list_items, list_element, rows, current_page);
    SetupPagination(list_items, pagination_element, rows);
  })
  .catch((err) => console.log(err));

// this fn with fetch the list when event occurs to change the drink type
function getDrinkList(drink) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`)
    .then((res) => res.json())
    .then(function (data) {
      let drinkList = data.drinks;
      list_items = [];
      for (let index = 0; index < drinkList.length; index++) {
        list_items.push(drinkList[index]);
      }
      console.log("list items:", list_items);
      DisplayList(list_items, list_element, rows, current_page);
      SetupPagination(list_items, pagination_element, rows);
    })
    .catch((err) => console.log(err));
}

// *********************************************************************
//store the elements where the data will be rendered
var list_element = document.getElementById("list");
var pagination_element = document.getElementById("pagination");
//declare current page and row
let current_page = 1;
let rows = 10;
//function will display the items per page
function DisplayList(items, wrapper, rows_per_page, page) {
  wrapper.innerHTML = "";
  page--;

  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let item_element = document.createElement("div");
    item_element.classList.add("item");
    item_element.id = item.idDrink;
    item_element.innerText = item.strDrink;

    wrapper.appendChild(item_element);
    let itemId = item.idDrink;
    document.getElementById(itemId).addEventListener("click", function () {
      getById(itemId);
    });
  }
}

//function creates the pagination
function SetupPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = "";

  let page_count = Math.ceil(items.length / rows_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page, items) {
  //reset the current page back to one, and display the page starting at the current page
  current_page = 1;
  DisplayList(items, list_element, rows, current_page);
  let button = document.createElement("button");
  button.innerText = page;

  if (current_page == page) button.classList.add("active");

  button.addEventListener("click", function () {
    current_page = page;
    DisplayList(items, list_element, rows, current_page);

    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
}

//***************function to display the data for Drink******* */

function displayDrinkItem(data, wrapper) {
  //store the target object in variable called obj
  let obj = data.drinks[0];
  console.log("DISPLAY:", obj);
  //use string interpolation to store html & data in new variable
  let randomEl = `
  <h2>${obj.strDrink}</h2>
  <img src=${obj.strDrinkThumb}>
  <p class="container-fluid">${obj.strInstructions}</p>
  <ul>`;
  //use for-loop to iterate over the 15 ingredients to display
  for (let index = 1; index < 16; index++) {
    if (
      obj[`strIngredient${index}`] == null ||
      obj[`strIngredient${index}`] == ""
    ) {
      break;
    }

    if (obj[`strMeasure${index}`] == null) {
      ingredient = "<li>" + obj[`strIngredient${index}`] + "</li>";
      randomEl += ingredient;
    } else {
      ingredient =
        "<li>" +
        obj[`strMeasure${index}`] +
        " : " +
        obj[`strIngredient${index}`] +
        "</li>";
      randomEl += ingredient;
    }
  }
  //add ul to close the list
  randomEl += "</ul>";

  //insert html into the dom dynamically using the wrapper parameter
  wrapper.innerHTML = randomEl;
}
