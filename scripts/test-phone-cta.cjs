const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true,args:['--no-sandbox']});const p=await b.newPage();await p.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8090')?r.continue():r.abort());
for(const path of ['/','/alaska/fairbanks-99701/water-heater-repair/'])for(const width of [320,390,1440]){
 await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:8090'+path,{waitUntil:'domcontentloaded'});
 const data=await p.locator('a.phone-cta-upgraded').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height).map(e=>({text:e.innerText,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,overflow:e.scrollWidth>e.clientWidth,animation:getComputedStyle(e.querySelector('svg')).animationName})));
 console.log(JSON.stringify({path,width,data}));if(!data.length||data.some(x=>x.overflow))throw Error('Layout failed');

}
await p.emulateMedia({reducedMotion:'reduce'});console.log('reduced motion',await p.locator('.phone-cta-icon').first().evaluate(e=>getComputedStyle(e).animationName));await b.close();})();
