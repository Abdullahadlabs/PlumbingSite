'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert');
const {apply}=require('./theme-toggle');
let changed=0;
for(const p of cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:30e6}).toString().split('\0').filter(Boolean)){
 const before=fs.readFileSync(p,'utf8'),after=apply(before);
 assert.equal(apply(after),after,'Not idempotent: '+p);
 assert.deepEqual(new Set(after.match(/href="tel:[^"]*"/g)),new Set(before.match(/href="tel:[^"]*"/g)),'Phone changed: '+p);
 assert.deepEqual(after.match(/<link[^>]*canonical[^>]*>/g),before.match(/<link[^>]*canonical[^>]*>/g),'Canonical changed: '+p);
 if(before!==after){fs.writeFileSync(p,after);changed++;}
}
console.log('Theme updated '+changed+' pages; phone links and canonical tags preserved.');
