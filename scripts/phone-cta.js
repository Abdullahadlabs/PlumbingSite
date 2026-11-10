'use strict';
const icon='<svg class="phone-cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
function apply(html) {
 return html.replace(/<a\b([^>]*href="tel:877-516-8705"[^>]*)>[\s\S]*?<\/a>/g,(whole,attrs,offset)=>{
  if(attrs.includes('phone-cta-upgraded'))return whole;
  const headerEnd=html.indexOf('</header>');
  const target=(headerEnd>offset)||/header-phone|sticky-btn|data-service-sticky-call/.test(attrs);
  if(!target)return whole;
  attrs=attrs.replace(/\sstyle="[^"]*"/g,'').replace(/\saria-label="[^"]*"/g,'');
  if(/class="/.test(attrs))attrs=attrs.replace(/class="([^"]*)"/,'class="$1 phone-cta-upgraded"');
  else attrs+=' class="phone-cta-upgraded"';
  return '<a'+attrs+' aria-label="Call toll-free (877) 516-8705 for a plumbing referral">'+icon+'<span class="phone-cta-copy"><span class="phone-cta-label">CALL TOLL-FREE</span><span class="phone-cta-number">(877) 516-8705</span></span></a>';
 });
}
module.exports={apply};
