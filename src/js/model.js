'use strict';

import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';
import recipeView from './view/recipeView.js';
//object for store information by executing in controller
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [], //bookmark array
};

const createRecipeObject = function (data) {
  //reform the object we recive from API
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.sourceUrl,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //conditionall add the property
  };
};
//export this function for establishing connection between model.js and controller js.
export const loadRecipe = async function (id) {
  try {
    //retrieve data from API
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    //update bookmark value for prevent unbookmark if we switch recipe
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    //Temp  error handling
    console.error(err);
    throw err; //throw err, for controller to handle
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

//helper function for only display 10 recipe at one page
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //each page first value;
  const end = page * state.search.resultsPerPage; //each page last value
  return state.search.results.slice(start, end); //slice create sub array cover start to end-1
};

export const updateServings = function (newServings) {
  //change the serving number and ingrdient amount

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; //newQt  = oldQt / oldServings
  });

  //update the new serving number
  state.recipe.servings = newServings;
};
const persistBookmarks = function (recipe) {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //convert  object to string
};
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
//delete by id
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(element => element.id === id);
  state.bookmarks.splice(index, 1); //delete one at one time
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // convert strin back to object
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

//use user input from form and generate a new object
export const uploadRecipe = async function (newRecipe) {
  try {
    //only consider non-empty ingredient as input
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please try again with correct format'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(state.recipe);
    // console.log(ingredients);
  } catch (err) {
    throw err;
  }
};
