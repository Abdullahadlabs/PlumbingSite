'use strict';
const assert=require('assert/strict'),fs=require('fs'),cp=require('child_process');
const {apply}=require('./service-mobile-layout');
const {renderServicePage,DEFAULT_SERVICES}=require('./template-service-page');
function check(s){
 assert.equal((s.match(/class="service-mobile-actions"/g)||[]).length,1);
 assert.equal((s.match(/id="service-mobile-layout"/g)||[]).length,1);
 assert(s.includes('class="service-top-message"'));
 assert(!s.includes('Professional Plumbing Team Available 24/7'));
 assert(s.includes('href="tel:877-516-8705" data-service-sticky-call'));
 assert(/<a href="\/contact"><svg/.test(s));
 assert(s.includes('env(safe-area-inset-bottom'));
 assert(s.includes('mainNav.style.top = headerBottom'));
 assert.equal(apply(s),s);
}
for(const svc of DEFAULT_SERVICES)check(renderServicePage({cityName:'Fairbanks',zip:'99701',stateCode:'AK',stateName:'Alaska',stateSlug:'alaska',serviceSlug:svc.slug,serviceName:svc.name}));
assert.equal(apply('<body>Unrelated page</body>'),'<body>Unrelated page</body>');
if(process.argv.includes('--all')){
 const files=cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:20*1024*1024}).toString().split('\0').filter(Boolean);let n=0;
 for(const f of files){const s=fs.readFileSync(f,'utf8');if(s.includes('<body class="service-page-wrapper">')){check(s);n++;}}
 assert(n>23000);console.log('Verified mobile layout on',n,'service pages');
}
console.log('Service header, sticky links, menu position, safe-area spacing and idempotence checks passed.');
