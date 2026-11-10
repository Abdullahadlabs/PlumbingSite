'use strict';
const fs=require('fs');const cp=require('child_process');const {normalize}=require('./referral-copy');
const files=cp.execFileSync('git',['ls-files','-z','*.html'],{maxBuffer:20*1024*1024}).toString().split('\0').filter(Boolean);
let changed=0,checked=0;
const canonical=s=>(s.match(/<link[^>]*rel="canonical"[^>]*>/g)||[]).join('');
const phones=s=>JSON.stringify([...s.matchAll(/href="tel:([^"]+)"/g)].map(x=>x[1]));
for(const file of files){
 if(!fs.existsSync(file))throw Error('Missing tracked HTML: '+file);
 const before=fs.readFileSync(file,'utf8');const after=normalize(before);checked++;
 if(before===after)continue;
 if(canonical(before)!==canonical(after)||phones(before)!==phones(after))throw Error('Link changed: '+file);
 if(/>45-Min<|>25k\+<|>4\.9\/5<|Updated: Just Now|Verified Direct Repairs/.test(after))throw Error('Claim remains: '+file);
 if(normalize(after)!==after)throw Error('Non-idempotent: '+file);
 fs.writeFileSync(file,after);changed++;
}
console.log(JSON.stringify({checked,changed}));
