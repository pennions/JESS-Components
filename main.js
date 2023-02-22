import '@pennions/jess/dist/jess.min.css';
import '@pennions/jess/dist/default-theme.min.css';
import './components/jess-components';
import { irisSet } from './irisset';
import { snakeSet } from './snakeSet';

document.getElementById('snake-set').contents = snakeSet;
document.getElementById('iris-set').setAttribute('contents', JSON.stringify(irisSet));
document.getElementById('iris-set').setAttribute("current-page",  5);
