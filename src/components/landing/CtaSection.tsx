import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GlassButton } from "@/components/glass/GlassButton";
import { Reveal } from "./Reveal";
import doctor from "@/assets/ai-doctor-cutout.png";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-sky to-cyan p-8 shadow-[0_50px_90px_-40px_rgba(30,64,140,0.75)] sm:p-14">
          <div className="pointer-events-none absolute -left-16 -top-24 size-80 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-10 size-96 rounded-full bg-white/15 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="text-center md:text-left">
              <h2 className="text-balance text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                Start Your Health Journey Today
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                Join thousands of users using AI to stay healthy.
              </p>
              <Link to="/login" className="mt-8 inline-block w-full sm:w-auto">
                <GlassButton
                  variant="glass"
                  size="lg"
                  className="w-full bg-white/90 text-primary-dark hover:bg-white sm:w-auto"
                >
                  Start Tracking Free
                </GlassButton>
              </Link>
            </div>

            <motion.img
              src={doctor}
              alt="CareAI doctor mascot"
              width={512}
              height={512}
              loading="lazy"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-48 drop-shadow-[0_30px_40px_rgba(15,40,90,0.45)] md:w-full"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
