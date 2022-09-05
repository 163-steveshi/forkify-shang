import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; //import icon data

export default class View {
  _data;
  //loading data on html
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {default: undefined | string} A markup string is returned if render = false
   * @this  {OBject} View instamce
   * @author Shang Shi
   * @to_do implement
   */

  render(data, render = true) {
    //check if data is valid and recive recipe array is not empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    //check if data is valid and recive recipe array is not empty
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup(); //since markup/html link is string so it is hard to compare with original html element so we need to first convert it into a DOM Object then we can modify the original html element for replacing text and achieve update
    const newDOM = document.createRange().createContextualFragment(newMarkup); //convert to a dom element that live in memory but not insert to web dom yet
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);

    //compare the html element and upadted text
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //replace new textContent only containing  text
        curEl.textContent = newEl.textContent;
      }
      //update changed attributed
      if (!newEl.isEqualNode(curEl)) {
        //turn newElement attributes into a array and replace each attribute's name and value
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  //help function for cleaning the HTML Container
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //show the loading gear
  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
