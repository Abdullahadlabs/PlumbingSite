const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||undefined,headless:true,args:['--no-sandbox']});
 const context=await browser.newContext();
 await context.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8090')?r.continue():r.abort());
 const page=await context.newPage();
 const paths=['/','/alaska/fairbanks-99701/water-heater-repair/','/state/texas/','/texas/houston-77002/','/contact.html','/blog/how-to-shut-off-main-water-valve/'];
 for(const path of paths)for(const width of (paths.indexOf(path)<2?[320,390,768,1024,1440]:[390,1440])){
  await page.setViewportSize({width,height:850});await page.goto('http://127.0.0.1:8090'+path,{waitUntil:'domcontentloaded'});
  const button=page.locator('[data-theme-toggle]');assert.equal(await button.count(),1,path+' toggle count');assert((await page.content()).indexOf('<meta charset=')<1024,'Charset placement');assert(await button.isVisible(),path+' toggle visible');
  const before=await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  for(const theme of ['dark','light']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await button.click();
   assert.equal(await page.locator('html').getAttribute('data-theme'),theme);await page.waitForTimeout(400);
   assert.equal(await button.getAttribute('aria-pressed'),String(theme==='dark'));
   assert(await button.locator(theme==='dark'?'.theme-moon':'.theme-sun').isVisible());
   const box=await button.boundingBox();assert(box.width>=44&&box.height>=44);assert(box.x>=0&&box.x+box.width<=width,path+' toggle outside viewport');
   const layout=await page.evaluate(()=>{
    const b=document.querySelector('[data-theme-toggle]').getBoundingClientRect();
    const others=[...document.querySelectorAll('.header .logo,.header a.phone-cta-upgraded,.mobile-toggle,.menu-toggle')].filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height);
    const overlap=others.some(e=>{const r=e.getBoundingClientRect();return Math.min(b.right,r.right)-Math.max(b.left,r.left)>1&&Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top)>1});
    const h=document.querySelector('h1');return {overlap,body:getComputedStyle(document.body).backgroundColor,h1:h?getComputedStyle(h).color:null,iconAnimation:document.querySelector('.phone-cta-icon')?getComputedStyle(document.querySelector('.phone-cta-icon')).animationName:null};
   });assert(!layout.overlap,path+' header overlap at '+width);console.log('THEME_CHECK '+JSON.stringify({path,width,theme,...layout}));
   if(theme==='light'&&((width===390&&(path==='/'||path.includes('fairbanks')))||(width===1440&&path==='/'))){
    const img=await page.screenshot({type:'jpeg',quality:55});console.log('THEME_IMAGE:'+(path==='/'?'home':'service')+'-'+width+':'+img.toString('base64'));
   }
  }
  await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('html').getAttribute('data-theme'),'light','Saved preference lost');
  await button.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Keyboard toggle failed');
  if(width===390){const menu=page.locator('#mobileToggle,.menu-toggle').first();if(await menu.count()){await menu.click();const nav=page.locator('#navMenu,#mainNav,.header .nav').first();assert(await nav.isVisible(),'Menu hidden');await menu.click();}}
  assert.deepEqual(await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),before);
 }
 // Graceful fallback when privacy settings deny local storage.
 const denied=await browser.newContext();await denied.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8090')?r.continue():r.abort());
 await denied.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked')}})});
 const p=await denied.newPage();await p.goto('http://127.0.0.1:8090/');await p.locator('[data-theme-toggle]').click();assert.equal(await p.locator('html').getAttribute('data-theme'),'light');await denied.close();

 console.log('THEME_TESTS_PASSED');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
