import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //import icon data
import View from './View.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No reciples found for your query! Please try again :D';
  _message = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
