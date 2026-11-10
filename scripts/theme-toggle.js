'use strict';
// Runs before stylesheets so a saved theme is applied before the first paint.
const BOOT = `<script id="hpu-theme-init">(function(){var r=document.documentElement,k='hpu-theme';function read(){try{return localStorage.getItem(k)}catch(e){return null}}function set(t){r.setAttribute('data-theme',t==='light'?'light':'dark');var b=document.querySelector('[data-theme-toggle]');if(b){var d=r.getAttribute('data-theme')==='dark';b.setAttribute('aria-pressed',String(d));b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');b.title=d?'Switch to light mode':'Switch to dark mode'}}set(read());r.setAttribute('data-theme-ready','');document.addEventListener('DOMContentLoaded',function(){set(r.getAttribute('data-theme'))});document.addEventListener('click',function(e){if(!e.target.closest('[data-theme-toggle]'))return;var t=r.getAttribute('data-theme')==='dark'?'light':'dark';set(t);try{localStorage.setItem(k,t)}catch(e){}});window.addEventListener('storage',function(e){if(e.key===k)set(e.newValue)})})();</script>`;
const BUTTON = `<button type="button" class="theme-toggle" data-theme-toggle aria-pressed="true" aria-label="Switch to light mode" title="Switch to light mode"><svg class="theme-moon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.9 13.1A8.5 8.5 0 0 1 10.9 3.1a8.5 8.5 0 1 0 10 10Z"/></svg><svg class="theme-sun" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button>`;
// Fixed palette used by older templates. Dark mode preserves each original value.
const surfaces=['060f1d','0a1628','111d33','162442','0d1a2d','070d18','0d1527','0b1322','060b13','0f1e3a','0f172a','1a2744','0b2545','0f1a2e'];
function themeColors(css){
 css=css.replace(/#([a-f\d]{6})\b/gi,(value,hex)=>surfaces.includes(hex.toLowerCase())?`var(--theme-surface, ${value})`:value);
 css=css.replace(/(^|[;{\s])color\s*:\s*(#fff(?:fff)?\b|white\b)/gi,'$1color:var(--theme-ink, $2)');
 return css;
}
function apply(html){
 if(html.includes('id="hpu-theme-init"')) {
  const init=html.match(/<script id="hpu-theme-init">[\s\S]*?<\/script>/);
  if(init && html.indexOf('<meta charset=')>html.indexOf(init[0]))return html.replace(init[0],'').replace(/(<meta\s+charset=[^>]*>)/i,'$1\n'+init[0]);
  return html;
 }
 if(!/<header\b/.test(html)||!html.includes('/css/style.css'))return html;
 const pattern=/<div\s+class="(?:header-cta|nav-ctas)"/;
 if(!pattern.test(html))throw Error('Header CTA container missing');
 let out=html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi,(_,a,css)=>'<style'+a+'>'+themeColors(css)+'</style>');
 // Convert inline palette only, without touching scripts, structured data or content.
 out=out.replace(/\bstyle="([^"]*)"/g,(_,css)=>'style="'+themeColors(css)+'"');
 out=out.replace(/(<meta\s+charset=[^>]*>)/i,'$1\n'+BOOT).replace(pattern,BUTTON+'\n$&');
 out=out.replace(/href="\/css\/style\.css(?:\?[^"]*)?"/g,'href="/css/style.css?v=theme-20261110"');
 return out;
}
module.exports={apply,themeColors,BOOT,BUTTON};
