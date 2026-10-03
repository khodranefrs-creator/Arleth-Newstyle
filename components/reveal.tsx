import type { ReactNode } from "react";

/**
 * Scroll reveal observer. Mounted once per page; watches every [data-reveal]
 * node. Degrades to "everything visible" when IntersectionObserver is missing
 * or the visitor prefers reduced motion.
 */
export default function RevealObserver() {
  return (
    <>
      <script
        // Inline so the observer runs before first paint of below-fold content.
        dangerouslySetInnerHTML={{
          __html: `(function(){try{
            var m=window.matchMedia("(prefers-reduced-motion: reduce)");
            function run(){
              var els=Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
              if(!els.length)return;
              if(m.matches||!("IntersectionObserver" in window)){
                els.forEach(function(e){e.setAttribute("data-visible","true")});return;
              }
              var io=new IntersectionObserver(function(en){
                en.forEach(function(e){
                  if(e.isIntersecting){e.target.setAttribute("data-visible","true");io.unobserve(e.target)}
                });
              },{rootMargin:"0px 0px -10% 0px",threshold:0.06});
              els.forEach(function(e){io.observe(e)});
            }
            if(document.readyState!=="loading"){run()}else{document.addEventListener("DOMContentLoaded",run)}
          }catch(e){}})();`,
        }}
      />
      <noscript>
        <style>{`.reveal,.rule-draw{opacity:1!important;transform:none!important}`}</style>
      </noscript>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Presentational primitives — server components, zero JS.
 * ------------------------------------------------------------------------ */

export function SectionLabel({
  index,
  title,
  className = "",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="label-sm text-ember">{index}</span>
      <span className="h-px w-6 bg-ink-line" aria-hidden="true" />
      <span className="label-sm text-mute">{title}</span>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "figure" | "header" | "article";
  className?: string;
}) {
  return (
    <Tag
      data-reveal=""
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** A hairline that draws itself when scrolled into view. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div
      data-reveal=""
      aria-hidden="true"
      className={`rule-draw h-px w-full bg-ink-line ${className}`}
    />
  );
}
