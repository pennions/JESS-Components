(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const i="/assets/javascript-8dac5379.svg";function a(o){let s=0;const n=r=>{s=r,o.innerHTML=`count is ${s}`};o.addEventListener("click",()=>n(s+1)),n(0)}class c extends HTMLElement{constructor(){super(),this.innerHTML=`
        <slot>
            <input type="checkbox" value="clicked!" id="shadow-box" />
            <label for="shadow-box">Click shadow box!</label>
            <input type="checkbox" value="clicked 2" id="shadow-box2" />
            <label for="shadow-box2">Click shadow box2!</label>
        </slot>
        `}}class d extends c{constructor(){super(),console.log(this.innerHTML)}}customElements.define("jess-test-component",c);customElements.define("jess-test-component2",d);document.querySelector("#app").innerHTML=`
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${i}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>

  </div>
`;jet.init("app",{message:"Hello from JET"});a(document.querySelector("#counter"));document.getElementById("test").addEventListener("change",o=>{console.log(o.target.value)});
