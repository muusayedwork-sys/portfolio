import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/* ---------- Reusable components ---------- */

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '', as = 'div', style }: {
  children: ReactNode; delay?: number; duration?: number; x?: number; y?: number;
  className?: string; as?: ElementType; style?: React.CSSProperties;
}) {
  const Comp = motion.create(as as any) as any;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Comp>
  );
}

function Magnet({ children, padding = 100, strength = 2, activeTransition = 'transform 0.3s ease-out', inactiveTransition = 'transform 0.6s ease-in-out', className = '' }: {
  children: ReactNode; padding?: number; strength?: number; activeTransition?: string; inactiveTransition?: string; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2, cy = top + height / 2;
      const dx = Math.abs(cx - e.clientX), dy = Math.abs(cy - e.clientY);
      if (dx < width / 2 + padding && dy < height / 2 + padding) {
        setActive(true);
        setPos({ x: (e.clientX - cx) / strength, y: (e.clientY - cy) / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}>
        {children}
      </div>
    </div>
  );
}

function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="opacity-0">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>{char}</motion.span>
    </span>
  );
}

function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const chars = text.split('');
  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((c, i) => (
        <Char key={i} char={c} progress={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]} />
      ))}
    </p>
  );
}

function ContactButton() {
  return (
    <button
      className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
        fontFamily: 'inherit',
      }}
    >
      Contact Me
    </button>
  );
}

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200">
      Live Project
    </button>
  );
}

/* ---------- 1. Hero ---------- */

function HeroSection() {
  const links = ['About', 'Price', 'Projects', 'Contact'];
  return (
    <section className="relative h-screen flex flex-col px-6 md:px-10" style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between pt-6 md:pt-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200">
              {l}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
            Hi, i&apos;m muu
          </h1>
        </FadeIn>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" className="w-full">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Muu portrait" className="w-full h-auto block" />
          </Magnet>
        </FadeIn>
      </div>

      <div className="mt-auto flex justify-between items-end pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20"><ContactButton /></FadeIn>
      </div>
    </section>
  );
}

/* ---------- 2. Marquee ---------- */

const GIFS = [
  'hero-space-voyage-preview-eECLH3Yc', 'hero-codenest-preview-Cgppc2qV', 'hero-vex-ventures-preview-BczMFIiw',
  'hero-stellar-ai-v2-preview-DjvxjG3C', 'hero-asme-preview-B_nGDnTP', 'hero-transform-data-preview-Cx5OU29N',
  'hero-vitara-preview-Cjz2QYyU', 'hero-terra-preview-BFjrCr7T', 'hero-skyelite-preview-DHaZIgUv',
  'hero-aethera-preview-DknSlcTa', 'hero-designpro-preview-D8c5_een', 'hero-stellar-ai-preview-D3HL6bw1',
  'hero-xportfolio-preview-D4A8maiC', 'hero-orbit-web3-preview-BXt4OttD', 'hero-nexora-preview-cx5HmUgo',
  'hero-evr-ventures-preview-DZxeVFEX', 'hero-planet-orbit-preview-DWAP8Z1P', 'hero-new-era-preview-CocuDUm9',
  'hero-wealth-preview-B70idl_u', 'hero-luminex-preview-CxOP7ce6', 'hero-celestia-preview-0yO3jXO8',
].map((n) => `https://motionsites.ai/assets/${n}.gif`);

function MarqueeRow({ images, translate }: { images: string[]; translate: number }) {
  const tripled = [...images, ...images, ...images];
  return (
    <div className="flex gap-3 w-max" style={{ transform: `translateX(${translate}px)`, willChange: 'transform' }}>
      {tripled.map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" width={420} height={270}
          className="rounded-2xl object-cover shrink-0" style={{ width: 420, height: 270 }} />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section ref={ref} className="pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3" style={{ background: '#0C0C0C', overflow: 'hidden' }}>
      <MarqueeRow images={GIFS.slice(0, 11)} translate={offset - 200} />
      <MarqueeRow images={GIFS.slice(11)} translate={-(offset - 200)} />
    </section>
  );
}

/* ---------- 3. About ---------- */

const ASSET = 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/';
const CORNERS = [
  { src: 'moon_icon.11395d36.png', cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%]', delay: 0.1, x: -80 },
  { src: 'p59_1.4659672e.png', cls: 'w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]', delay: 0.25, x: -80 },
  { src: 'lego_icon-1.703bb594.png', cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%]', delay: 0.15, x: 80 },
  { src: 'Group_134-1.2e04f3ce.png', cls: 'w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]', delay: 0.3, x: 80 },
];

function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 gap-16 sm:gap-20 md:gap-24" style={{ background: '#0C0C0C' }}>
      {CORNERS.map((c) => (
        <FadeIn key={c.src} delay={c.delay} x={c.x} y={0} duration={0.9} className={`absolute ${c.cls}`}>
          <img src={ASSET + c.src} alt="" className="w-full h-auto" />
        </FadeIn>
      ))}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</h2>
        </FadeIn>
        <AnimatedText
          text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
      </div>
      <div className="relative z-10"><ContactButton /></div>
    </section>
  );
}

/* ---------- 4. Services ---------- */

const SERVICES = [
  ['3D Modeling', 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],
  ['Rendering', 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],
  ['Motion Design', 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],
  ['Branding', 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.'],
  ['Web Design', 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'],
];

function ServicesSection() {
  return (
    <section id="price" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: '#FFFFFF' }}>
      <h2 className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)' }}>Services</h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map(([name, desc], i) => (
          <FadeIn key={name} delay={i * 0.1}
            className="flex items-start gap-4 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
            style={{ borderTop: i === 0 ? undefined : '1px solid rgba(12, 12, 12, 0.15)' }}>
            <span className="font-black leading-none" style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 10vw, 140px)' }}>{String(i + 1).padStart(2, '0')}</span>
            <div className="flex flex-col gap-2" style={{ color: '#0C0C0C' }}>
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{name}</h3>
              <p className="font-light leading-relaxed max-w-2xl" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}>{desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. Projects ---------- */

const img = (id: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${id}.png&w=1280&q=85`;

const PROJECTS = [
  { name: 'Nextlevel Studio', category: 'Client',
    a: img('20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db'), b: img('20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8'), c: img('20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327') },
  { name: 'Aura Brand Identity', category: 'Personal',
    a: img('20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f'), b: img('20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1'), c: img('20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea') },
  { name: 'Solaris Digital', category: 'Client',
    a: img('20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f'), b: img('20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b'), c: img('20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee') },
];

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

function ProjectCard({ p, index, total, progress }: { p: typeof PROJECTS[number]; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  return (
    <div className="sticky top-24 md:top-32" style={{ marginBottom: index < total - 1 ? '40vh' : 0 }}>
      <div>
        <motion.div
          className={`border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 ${RADIUS}`}
          style={{ background: '#0C0C0C', scale, top: index * 28, position: 'relative', transformOrigin: 'top center' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-4 sm:gap-8">
              <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{String(index + 1).padStart(2, '0')}</span>
              <div className="flex flex-col text-[#D7E2EA]">
                <span className="font-light uppercase tracking-wide" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}>{p.category}</span>
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{p.name}</h3>
              </div>
            </div>
            <LiveProjectButton />
          </div>
          <div className="flex gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
              <img src={p.a} alt="" loading="lazy" className={`w-full object-cover shrink-0 ${RADIUS}`} style={{ height: 'clamp(130px, 16vw, 230px)' }} />
              <img src={p.b} alt="" loading="lazy" className={`w-full object-cover shrink-0 ${RADIUS}`} style={{ height: 'clamp(160px, 22vw, 340px)' }} />
            </div>
            <div className="relative" style={{ width: '60%' }}>
              <img src={p.c} alt="" loading="lazy" className={`absolute inset-0 w-full h-full object-cover ${RADIUS}`} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section id="projects" className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32" style={{ background: '#0C0C0C' }}>
      <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Project</h2>
      <div ref={ref} id="contact">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} p={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

/* ---------- App ---------- */

export default function App() {
  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
