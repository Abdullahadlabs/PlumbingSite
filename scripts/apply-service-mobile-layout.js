'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict');
const {apply}=require('./service-mobile-layout');
const files=cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:20*1024*1024}).toString().split('\0').filter(Boolean);
let changed=0;
for(const f of files){
 const before=fs.readFileSync(f,'utf8'),after=apply(before);if(before===after)continue;
 assert.equal((before.match(/<link[^>]*rel="canonical"[^>]*>/g)||[]).join(''),(after.match(/<link[^>]*rel="canonical"[^>]*>/g)||[]).join(''),f);
 assert.equal(apply(after),after,f);
 assert.equal((after.match(/class="service-mobile-actions"/g)||[]).length,1,f);
 assert(after.includes('href="tel:877-516-8705"'),f);assert(after.includes('href="/contact"'),f);
 fs.writeFileSync(f,after);changed++;
}
console.log('Service mobile pages corrected:',changed);
