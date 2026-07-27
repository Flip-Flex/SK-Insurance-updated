import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
export interface StaggeredMenuSocialItem {
  label: string;
  link?: string;
  onClick?: () => void;
}
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  languages?: { code: string; name: string; label: string }[];
  currentLang?: string;
  onLanguageChange?: (code: string) => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  languages,
  currentLang,
  onLanguageChange
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const openRef = useRef(false);
  const botRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const icon = iconRef.current;

      if (!panel || !icon) return;
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;
      try {
        const offscreen = position === 'left' ? -100 : 100;
        gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
        if (preContainer) {
      // If we are on desktop (Navbar hides this component with md:hidden), bail out!
      if (window.innerWidth >= 768) return;
      // If we are hidden by CSS (like md:hidden on a parent), bail out!
      if (panel.offsetWidth === 0) return;
        if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor, lazy: false });
        console.warn("GSAP setup skipped due to display state:", e);
      }
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const top = topRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    if (!icon || !top || !mid || !bot) return;
  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: -90, scale: 0.5, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'back.out(1.7)' } })
        .to(icon, { rotate: 0, scale: 1, duration: 0.5 });
    } else {
      gsap.set(icon, { rotate: 90, scale: 0.5, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'back.out(1.7)' } })
        .to(icon, { rotate: 0, scale: 1, duration: 0.5 });
    }
  }, []);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  React.useEffect(() => {
    // If we are on desktop, bail out!
    if (window.innerWidth >= 768) return;

    if (toggleBtnRef.current) {
  React.useEffect(() => {
    if (toggleBtnRef.current) {
      // If we are hidden by CSS, bail out!
    if (toggleBtnRef.current) {
      // If we are hidden by CSS on a parent, bail out!
      if (toggleBtnRef.current.offsetWidth === 0) return;
        // ignore
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);
        // ignore
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);
  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
  return (
    <div
      className={`sm-scope z-[9999] ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none' : 'w-full h-full'}`}
    >
      <div
        className={
          (className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full z-40'
        }
        style={accentColor ? ({ '--sm-accent': accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

          <button
            ref={toggleBtnRef}
            className={`sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto ${
              open ? 'text-black' : 'text-[#e9e9ef]'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={iconRef}
              className="sm-icon relative shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true"
            >
              {open ? <FaTimes size={26} /> : <FaBars size={26} />}
            </span>
          </button>
              <div className={open ? 'hidden' : 'block'}>
            <span
              ref={iconRef}
              className="sm-icon relative shrink-0 inline-flex items-center justify-center w-[26px] h-[26px] [will-change:transform]"
              aria-hidden="true"
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100 pointer-events-auto'}`}>
                <FaBars size={26} />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}>
                <FaTimes size={26} />
              </div>
            </span>
            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-8 flex flex-col gap-4 border-t border-black/10" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-lg font-bold uppercase tracking-widest text-neutral-400">Socials</h3>
                <ul
                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-6 flex-wrap"
                  role="list"
                >
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-xl font-bold text-black no-underline relative inline-block py-[2px] transition-all duration-300 hover:text-brand-accent"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div className="sm-languages mt-6 pt-6 flex flex-col gap-4 border-t border-black/10" aria-label="Language selection">
                <h3 className="sm-socials-title m-0 text-lg font-bold uppercase tracking-widest text-neutral-400">Language</h3>
                <ul
                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                  role="list"
                >
                  {languages.map((lang) => (
                    <li key={lang.code} className="sm-socials-item">
                      <button
                        onClick={() => {
                          if (onLanguageChange) onLanguageChange(lang.code);
                        }}
                        className={`sm-socials-link text-lg font-bold cursor-pointer bg-transparent border-0 p-0 no-underline relative inline-block transition-all duration-300 hover:text-brand-accent ${
                          currentLang === lang.code ? 'text-brand-accent' : 'text-black'
                        }`}
                      >
                        {lang.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {languages && languages.length > 0 && (
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      {s.onClick ? (
                        <button
                          onClick={() => {
                            s.onClick!();
                            closeMenu();
                          }}
                          className="sm-socials-link text-xl font-bold text-black no-underline relative inline-block py-[2px] transition-all duration-300 hover:text-brand-accent bg-transparent border-0 p-0 cursor-pointer text-left"
                        >
                          {s.label}
                        </button>
                      ) : (
                        <Link
                          to={s.link || '#'}
                          onClick={() => closeMenu()}
                          className="sm-socials-link text-xl font-bold text-black no-underline relative inline-block py-[2px] transition-all duration-300 hover:text-brand-accent"
                        >
                          {s.label}
                        </Link>
                      )}
                    </li>
                  ))}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 bottom-full mb-4 w-40 bg-white border border-[rgba(0,0,0,0.06)] rounded-[12px] shadow-lg z-50 overflow-hidden text-left"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              if (onLanguageChange) onLanguageChange(lang.code);
                              setShowLangDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-[14px] transition-colors text-left font-medium cursor-pointer border-0 ${
                              currentLang === lang.code 
                                ? 'text-black font-bold bg-brand-accent/20' 
                                : 'text-black bg-white hover:bg-neutral-50 hover:text-brand-accent'
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}