"use client" 

import * as React from "react"
import { useMeasure } from "@uidotdev/usehooks"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion"

import { cn } from "../../utils/cn"

const processCardVariants = cva("flex border backdrop-blur-lg rounded-3xl", {
  variants: {
    variant: {
      indigo:
        "flex border text-neutral-100 border-white/10 backdrop-blur-xl bg-neutral-900/60 shadow-xl shadow-black/40 glass-panel",
      light: "shadow",
    },
    size: {
      sm: "min-w-[25%] max-w-[25%]",
      md: "min-w-[50%] max-w-[50%]",
      lg: "min-w-[75%] max-w-[75%]",
      xl: "min-w-[90%] sm:min-w-full sm:max-w-full",
    },
  },
  defaultVariants: {
    variant: "indigo",
    size: "md",
  },
})

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

interface ProcessCardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof processCardVariants> {
  itemsLength: number
  index: number
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    )
  }
  return context
}

export const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[120vh]", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

export const ContainerSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky left-0 top-0 w-full overflow-hidden", className)}
    {...props}
  />
))
ContainerSticky.displayName = "ContainerSticky"

export const ProcessCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 sm:p-8", className)} {...props} />
))
ProcessCardTitle.displayName = "ProcessCardTitle"

export const ProcessCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-6 p-6 sm:p-8", className)}
    {...props}
  />
))
ProcessCardBody.displayName = "ProcessCardBody"

export const ProcessCard: React.FC<ProcessCardProps> = ({
  className,
  style,
  variant,
  size,
  itemsLength,
  index,
  ...props
}) => {
  const { scrollYProgress } = useContainerScrollContext()
  const start = index / itemsLength
  const end = start + 1 / itemsLength
  const { innerWidth } = window
  const [ref, { width }] = useMeasure()

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [innerWidth, -((width ?? 0) * index) + 64 * index]
  )
  return (
    <motion.div
      ref={ref}
      style={{
        x: index > 0 ? x : 0,
        ...style,
      }}
      className={cn(processCardVariants({ variant, size }), className)}
      {...props}
    />
  )
}
ProcessCard.displayName = "ProcessCard"

const PROCESS_PHASES = [
  {
    id: "process-1",
    title: "Needs Analysis & Discovery",
    description:
      "We begin by understanding your financial goals, risk appetite, and family protection needs. This foundational step ensures we have a clear picture of your expectations before proceeding.",
  },
  {
    id: "process-2",
    title: "Portfolio & Policy Design",
    description:
      "Our experts analyze various insurance and investment options to craft a tailored blueprint that maximizes returns, minimizes tax liabilities, and provides comprehensive coverage.",
  },
  {
    id: "process-3",
    title: "Implementation & Onboarding",
    description:
      "Once the strategy is finalized, we assist with a seamless digital onboarding process, ensuring instant policy issuance and immediate portfolio allocation with zero paperwork.",
  },
  {
    id: "process-4",
    title: "Ongoing Review & Support",
    description:
      "We continuously monitor your investments and insurance policies, providing proactive advice, easy one-click renewals, and dedicated priority claims assistance.",
  },
]

export const ProcessTimeline = () => {
  return (
    <>
      {/* Mobile Layout (Vertical Stack) */}
      <div className="md:hidden container px-6 py-12 mx-auto border-t border-white/5">
        <div className="mb-12 space-y-4 max-w-[700px]">
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-brand-accent tracking-[0.3em] uppercase">
              // HOW IT WORKS
            </span>
          </div>
          <h2 className="text-3xl font-[900] tracking-[-1px] text-white leading-tight uppercase">
            Planning your financial <br /> and protection journey
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal tracking-wide">
        <div className="flex flex-col gap-6">
          {PROCESS_PHASES.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // smooth sliding out ease
                  {String(index + 1).padStart(2, "0")}
                </div>
              </ProcessCardTitle>
              <ProcessCardBody className="flex flex-col gap-3 sm:gap-6 flex-1 justify-center">
                <h3 className="text-xl sm:text-2xl font-[800] uppercase tracking-tight text-white">
                  {phase.title}
                </h3>
                <p className="opacity-80 text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {phase.description}
                </p>
              </ProcessCardBody>
            </motion.div>
          ))}
      {/* Desktop Layout (Horizontal Sticky Scroll) */}
      <div className="hidden md:block">
        <ContainerScroll
          className="container px-6 py-12 sm:py-24 h-[300vh] mx-auto border-t border-white/5"
        >
          <div className="mb-12 space-y-4 max-w-[800px] mx-auto text-center flex flex-col items-center">
            <div className="mb-4">
      {/* Desktop Layout (Horizontal Sticky Scroll) */}
      <div className="hidden md:block">
        <ContainerScroll
          className="container px-0 h-[300vh] mx-auto border-t border-white/5"
          <ContainerSticky className="top-0 flex flex-col justify-center h-[100dvh] pt-[48px] pb-[48px]">
            <div className="flex flex-col items-start text-left max-w-[1400px] mx-auto w-full px-4 md:px-8 xl:px-16 mb-[40px]">
              <span className="mb-[16px] text-[11px] font-extrabold text-brand-accent tracking-[0.3em] uppercase">
                // HOW IT WORKS
              </span>
              <h2 className="mb-[24px] text-3xl sm:text-4xl md:text-5xl font-[900] tracking-[-1px] text-white leading-tight uppercase">
                Planning your financial <br className="hidden lg:block" /> and protection journey
              </h2>
              <p className="max-w-[800px] text-sm sm:text-base text-neutral-300 dark:text-neutral-400 leading-relaxed font-normal tracking-wide">
                We blend expert financial analysis with cutting-edge digital platforms to build tailored portfolios and insurance strategies that secure your future and elevate your wealth.
              </p>
            </div>

            <div className="flex flex-nowrap gap-6 max-w-[1400px] mx-auto w-full px-4 md:px-8 xl:px-16">
                  key={phase.id}
                  itemsLength={PROCESS_PHASES.length}
                  index={index}
                  className="min-w-[85%] sm:min-w-[60%] lg:min-w-[45%] shrink-0"
                >
                  <ProcessCardTitle className="border-r border-white/10 flex items-start">
                    <div className="rounded-full h-12 w-12 bg-white text-neutral-900 text-lg font-bold flex justify-center items-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </ProcessCardTitle>
                  <ProcessCardBody className="flex flex-col gap-6 flex-1 justify-center">
                    <h3 className="text-2xl sm:text-3xl font-[800] uppercase tracking-tight text-white">
                      {phase.title}
                    </h3>
                    <p className="opacity-80 text-neutral-300 leading-relaxed">
                      {phase.description}
                    </p>
                  </ProcessCardBody>
                </ProcessCard>
              ))}
            </div>
          </ContainerSticky>
        </ContainerScroll>
      </div>
                  <p className="opacity-80 text-neutral-300 leading-relaxed">
                    {phase.description}
                  </p>
                </ProcessCardBody>
              </ProcessCard>
            ))}
          </ContainerSticky>
        </ContainerScroll>
      </div>
    </>
  )
}