import View from './View.js';
import icons from 'url:../../img/icons.svg'; //import icon data

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded :)';
  constructor() {
    super();
    this._addHandlerShowWindows();
    this._addHandlerCloseWindows();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindows() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //reset this
  }
  _addHandlerCloseWindows() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); //reset this
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)]; //gather the data and store in a array
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {
    // console.log(this._data);
    // return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new AddRecipeView();
