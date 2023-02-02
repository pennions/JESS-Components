import './style.css';
import javascriptLogo from './javascript.svg';
import { setupCounter } from './counter.js';
import './components/TestComponent';

export const entry = setupCounter;



document.querySelector('#app').innerHTML = /*html */`
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>

  </div>
`;

jet.init('app', { message: "Hello from JET" });

setupCounter(document.querySelector('#counter'));

document.getElementById("test").addEventListener("change", (e) => {
  console.log(e.target.value);
});
