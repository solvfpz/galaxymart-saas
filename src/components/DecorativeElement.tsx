import React from 'react';

export const DecorativeElement = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main Bottom-Right Glow (Increased Opacity) */}
      <div className="absolute content-center items-center box-border caret-transparent gap-x-0 flex blur-[120px] shrink-0 h-min justify-center left-[-645px] gap-y-0 rotate-[-14.99999492deg] w-min right-auto top-[-65px] bottom-auto md:right-[-311px] md:left-auto md:top-auto md:bottom-[-108px] opacity-100">
        <div className="box-content caret-black block md:aspect-auto md:box-border md:caret-transparent md:contents md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:center] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-[405px] md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[1515px] md:[mask-position:center] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="box-content caret-black h-auto w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:center] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <img
                src="https://c.animaapp.com/mmrn2ii2weXvLq/assets/icon-1.svg"
                alt="Background Glow"
                className="box-content caret-black h-auto align-middle w-auto md:aspect-auto md:box-border md:caret-transparent md:h-full md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:align-baseline md:w-full md:[mask-position:center] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Smaller Top-Left Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] blur-[150px] opacity-100 pointer-events-none">
        <div className="w-full h-full bg-blue-600/30 rounded-full"></div>
      </div>
    </div>
  );
};
