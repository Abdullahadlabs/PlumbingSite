'use strict';
// Shared build-time correction: changes emitted HTML, never hides claims in the browser.
const DISCLOSURE = 'Home Plumbing USA is a referral website, not a plumbing contractor. Calls to 877-516-8705 route through the Lead Smart referral network, and we may receive compensation. Independent providers set their own prices, availability, and service terms. Confirm credentials and any charges before hiring.';
const TIMING = 'Availability and arrival times depend on the independent provider, location, and workload. Call to ask about availability; immediate or same-day attendance is not guaranteed.';
const CREDENTIALS = 'Providers are independent businesses. Request and verify applicable licensing, insurance, and qualifications before hiring. This website does not guarantee individual credentials.';
const PRICING = 'Ask the independent provider for a written estimate and confirm diagnostic, call-out, after-hours, and repair charges before approving work.';
const WARRANTY = 'Warranty terms vary by manufacturer and contractor. Ask the provider for written parts and labor warranty details before approving work.';
const exact = new Map(Object.entries({
 '30–45 Min Window:':'Confirm Timing:', '1. 24/7 Immediate Dispatch':'1. Request Availability', '45-Min':'Confirm','Avg. Response Time':'Arrival Time', '25k+':'Compare','Verified Direct Repairs':'Provider Options','4.9/5':'Review','Customer Satisfaction':'Provider Credentials',
 'Live Dispatch Board':'Referral Information','Updated: Just Now':'Availability varies','Emergency Dispatch Active':'Check Local Availability',
 'No Hidden Dispatch Fees':'Ask About All Fees','Get completely transparent flat-rates up-front':PRICING,
 '100% Insured & Licensed':'Verify License & Insurance','Guaranteed home safety protection':'Check credentials before hiring',
 'Upfront Honest Estimates':'Request a Written Estimate','No surprise surcharges or fees':'Confirm call-out and repair charges',
 '24-Hour Active Support':'Confirm Service Hours','Weekends & holidays are included':'Hours vary by independent provider',
 'Satisfaction Guaranteed':'Review Provider Terms',"We won't leave till it's fixed right":'Ask about workmanship and warranty terms',
 'ZERO-OBLIGATION DIAGNOSTICS CALL':'ASK ABOUT PROVIDER AVAILABILITY',
 'Always Staffed by Real Coordinators':'Ask About Local Availability',
 'Rapid Response Times':'Confirm Arrival Times','Fully Vetted Pros':'Verify Provider Credentials',
 'Flat-Rate Pricing':'Confirm Pricing','Emergency Dispatch:':'Referral Phone:',
 'Types of Properties We Service':'Discuss Your Property Type',
 'How We Operate':'How Referrals Work','Our 4-Step Local Service Process':'Steps to Arrange Independent Service',
 'Getting expert plumbing support has never been easier or faster. We handle the hard work.':'Ask about local availability, compare provider terms, and approve work directly with the contractor.',
 "Our platform isn't just a list. We proactively background check, license-verify, and monitor customer reviews for every single plumbing provider within our national framework.":CREDENTIALS,
 "Plumbing disasters won't wait. We coordinate swift-arrival plumbing trucks right to your doorstep immediately.":TIMING,
 'No tricks. You receive pricing that is clear, straightforward, and agreed upon beforehand.':PRICING,
 'Whether a midnight emergency rupture or routine plumbing repair, we resolve everything.':'Ask whether an independent provider can handle your specific repair and preferred appointment time.',
 'Facing a plumbing emergency or need urgent repairs? Speak with a local plumbing pro instantly:':'Call to ask about an independent provider for your plumbing needs:',
 'The dispatched plumber diagnoses your issue on-site and provides an honest upfront quote before work begins.':'Confirm inspection charges and request a written estimate from the independent provider before work begins.',
 'The repair is completed securely with premium quality tools. You review and pay only when fully satisfied.':'Agree on the scope, payment terms, and warranty with the independent provider before approving work.'
}));
function text(value) {
 if(!value.trim()) return value;
 const lead=value.match(/^\s*/)[0], tail=value.match(/\s*$/)[0];let s=value.trim();
 if(exact.has(s)) return lead+exact.get(s)+tail;
 if (/^(?:For urgent drain emergencies|Our emergency dispatch routes|We maintain 30 to 45|We schedule same-day leak|Under normal conditions, our emergency dispatch)/.test(s)) s=TIMING;
 else if (/^Yes\. (?:Every plumber matched|Every technician in our network|All plumbers in our network|Our network technicians are factory-trained)/.test(s)) s=CREDENTIALS;
 else if (/^All dispatched plumbers are drug tested/.test(s)) s=CREDENTIALS;
 else if (/^All .+ regions staffed with fully-vetted specialists$/.test(s)) s='Coverage varies by ZIP code, service, and provider availability.';
 else if (/^Yes\. (?:Replacement units include standard|All repairs and installations are backed)/.test(s)) s=WARRANTY;
 else if (/^Yes\. (?:Dispatched plumbers evaluate|Technicians diagnose your issue)/.test(s)) s=PRICING;
 else if (/^We match your issue with the most qualified local plumber/.test(s)) s='Call with your ZIP code and repair needs to ask about an independent provider. Matching is subject to availability.';
 else if (/^Contact .*to speak directly with our 24\/7 national routing/.test(s)) s='Call 877-516-8705 to request a referral through Lead Smart.';
 else if (/^We provide rapid response times across/.test(s)) s='This map identifies the location discussed on this page. It does not establish a local office or guarantee service coverage.';
 else if (/^We are open 24 hours a day, 7 days a week for emergency dispatches/.test(s)) s='Service hours and appointment availability depend on the independent provider.';
 else if (/^Contact us now to get a transparent flat-rate quote/.test(s)) s='Call to ask about an independent provider. Confirm availability, inspection fees, and pricing directly with the provider.';
 else if (/^We provide licensed and certified emergency plumbing repair/.test(s)) s=DISCLOSURE;
 else if (/^Getting expert .*By hiring Home Plumbing USA,/.test(s)) s='Home Plumbing USA helps you seek an independent provider. The contractor you choose is responsible for diagnosis, pricing, and repair work.';
 s=s.replace(/Operating at [^<]+?our vetted network plumbers arrive fully equipped for 24\/7 emergency dispatch and routine maintenance\./g, 'Confirm provider availability, credentials, and appointment times before hiring.')
 .replace(/Local on-call plumbers arrive swiftly to stop active flooding before structural damage multiplies\./g, 'Confirm an arrival estimate with the independent provider; immediate attendance is not guaranteed.')
 .replace(/Live routing coordinators answer calls 24 hours a day, 365 days a year to dispatch local trucks\./g, 'Call to ask about an independent provider. Availability varies by location and time.')
 .replace(/Our dispatch network connects you directly with on-call independent licensed .+? plumbing contractors 24\/7\/365\./g, 'Call to ask about an independent provider; coverage, credentials, and appointment times must be confirmed before hiring.');
 s=s.replace(/Premium Certified Local Experts in /g,'Plumbing Referral Information in ')
 .replace(/What Our (.+?) Includes in /g,'Discuss $1 Options in ')
 .replace(/Our Service Area Map in /g,'Location Map for ')
 .replace(/Common questions about our professional /g,'Common questions about ')
 .replace(/our certified technicians/gi,'independent technicians')
 .replace(/an independent provider can diagnose/g,'an independent provider can diagnose')
 .replace(/Our vetted local plumbing network provides/g,'Independent providers may offer')
 .replace(/our technicians/gi,'independent technicians')
 .replace(/our plumbers/gi,'independent plumbers')
 .replace(/our licensed technicians/gi,'independent technicians')
 .replace(/we provide upfront flat-rate pricing before work starts\./gi,'ask the provider for a written estimate before work starts.')
 .replace(/By hiring Home Plumbing USA/g,'By hiring an independent provider');
 return lead+s+tail;
}
function schema(v) {
 if(Array.isArray(v)) return v.map(schema);
 if(v && typeof v==='object') {
  const out=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,schema(x)]));
  if(['PlumbingService','LocalBusiness'].includes(out['@type']) && out.name==='Home Plumbing USA') {
   return {'@type':'Organization',...(out['@id']?{'@id':out['@id']}:{}),name:'Home Plumbing USA',url:'https://homeplumbingusa.com/',description:DISCLOSURE};
  }
  if(out['@type']==='Service' && out.provider?.name==='Home Plumbing USA') {
   out.name += out.name.endsWith(' Referral Information')?'':' Referral Information';out.serviceType='Plumbing referral';out.description=DISCLOSURE;delete out.areaServed;
  }
  return out;
 }
 return typeof v==='string'?text(v):v;
}
function normalize(html) {
 if(!html.includes('Verified Direct Repairs') && !html.includes('data-referral-disclosure')) return html;
 let out=html.replace(/Top-rated ([^"<>]+?)\. Fast emergency response, upfront transparent pricing, and guaranteed code compliance from Home Plumbing USA\./g, 'Explore $1 referral options. Confirm availability, credentials, and pricing with an independent provider.');
 out=out.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,(all,json)=>all.replace(json,'\n'+JSON.stringify(schema(JSON.parse(json)),null,2)+'\n'));
 // Protect executable scripts, styles, SVG coordinates, and HTML attributes.
 out=out.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<svg\b[\s\S]*?<\/svg>)/gi).map((part,i)=>i%2?part:part.replace(/>([^<>]+)</g,(all,t)=>'>'+text(t)+'<')).join('');
 if(!out.includes('data-referral-disclosure')) out=out.replace(/(<p class="(?:hero-lead-text|hero-text)"[^>]*>[\s\S]*?<\/p>)/, '$1\n            <p data-referral-disclosure style="font-size:0.9rem;line-height:1.6;color:#cbd5e1;margin-bottom:1.5rem">'+DISCLOSURE+'</p>');
 return out;
}
module.exports={normalize,DISCLOSURE};
