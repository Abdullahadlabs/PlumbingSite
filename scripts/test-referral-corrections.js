'use strict';
const assert=require('assert/strict'),fs=require('fs'),cp=require('child_process');
const {normalize}=require('./referral-copy');
const {renderServicePage,DEFAULT_SERVICES}=require('./template-service-page');
for(const service of DEFAULT_SERVICES){
 const s=renderServicePage({cityName:'Houston',zip:'77002',stateCode:'TX',stateName:'Texas',stateSlug:'texas',serviceSlug:service.slug,serviceName:service.name});
 assert(s.includes('data-referral-disclosure'));assert(!s.includes('Verified Direct Repairs'));assert(!s.includes('Updated: Just Now'));
 assert(!s.includes('>4.9/5<'));assert(!s.includes('"streetAddress"'));assert(!s.includes('"@type": "PlumbingService"'));
 assert.equal(normalize(s),s);
 assert(s.includes('href="tel:877-516-8705"'));assert(s.includes(`https://homeplumbingusa.com/texas/houston-77002/${service.slug}/`));
 for(const match of s.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
}
const home=fs.readFileSync('index.html','utf8'),js=fs.readFileSync('js/main.js','utf8');
assert(!home.includes('id="leadIntakeForm"'));assert(!home.includes('id="leadModal"'));assert(home.includes('href="/contact"'));
assert(!js.includes('function initLeadModal'));assert(js.includes("event: 'phone_click'"));
assert(fs.readFileSync('contact.html','utf8').includes('https://leads.leadsmartinc.com/'));
if(process.argv.includes('--all')){
 const files=cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:20*1024*1024}).toString().split('\0').filter(Boolean);
 let n=0;for(const f of files){const s=fs.readFileSync(f,'utf8');if(!s.includes('data-referral-disclosure'))continue;n++;
 assert(!s.includes('Verified Direct Repairs'),f);assert(!s.includes('Updated: Just Now'),f);assert(!s.includes('>45-Min<'),f);assert(!s.includes('>4.9/5<'),f);
 for(const m of s.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
 }console.log('Verified corrected static pages:',n);assert(n>23000);
}
console.log('Referral content, schema, canonical paths, phone links and direct quote flow checks passed.');
