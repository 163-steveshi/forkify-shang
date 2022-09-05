import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import icons from 'url:../img/icons.svg'; //import img for this js
//for old browser support
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) module.hot.accept();
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//overall function for calling function in recipeView, model for maintaining program flow
const controlRecipe = async function () {
  try {
    //use Recipe ID to load recipe in the Recipe Container from the left recipe  list
    const id = window.location.hash.slice(1); //since id first symbol is #, get rid of it
    // console.log(id);
    if (!id) return; // for handling bug
    recipeView.renderSpinner();
    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1) Loading recipe
    //use recipeview to load

    //update bookmark
    bookmarksView.update(model.state.bookmarks);

    //store data we get from API
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // console.log(recipe);

    //2 Rendering Recipe
    //display to user
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
// controlRecipe();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1 get search querry
    const query = searchView.getQuery();
    if (!query) return;

    //2 load search results
    await model.loadSearchResults(query);
    //3 render / display results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4 Render Initial Pagination Button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // console.log(goToPage);
  //buttons click and load to the page that parameter define
  resultsView.render(model.getSearchResultsPage(goToPage));
  //4 Render new Pagination Button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  //2 update recipe view
  recipeView.update(model.state.recipe);
  //3.render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddrecipe = async function (newRecipe) {
  try {
    //Show Loading Spinner
    addRecipeView.renderSpinner();
    //upload the recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close from windows
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload(); //refresh the add recipe
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💣💥', err);
    addRecipeView.renderError(err.message);
  }
};

//listen the hash change/page loading and load the corrsponding recipe
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddrecipe);
};

init();
