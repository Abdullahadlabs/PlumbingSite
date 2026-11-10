'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert');
const {apply}=require('./phone-cta');
let changed=0,buttons=0;
for(const file of cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:30e6}).toString().split('\0').filter(Boolean)) {
 const before=fs.readFileSync(file,'utf8'),after=apply(before);
 assert.equal(apply(after),after,'Idempotence: '+file);
 assert.deepEqual(after.match(/href="tel:[^"]*"/g),before.match(/href="tel:[^"]*"/g),'Phone destination changed: '+file);
 assert.deepEqual(after.match(/<link[^>]*canonical[^>]*>/g),before.match(/<link[^>]*canonical[^>]*>/g),'Canonical changed: '+file);
 buttons+=(after.match(/class="phone-cta-label"/g)||[]).length;
 if(after!==before){fs.writeFileSync(file,after);changed++;}
}
console.log(JSON.stringify({changed,buttons}));
