// Arquivo de erro 404 - Not Found global do site

"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import Astronaut from "../../public/lottie/Astronaut.json";
import Moon from "../../public/lottie/moon.json";
import { JetBrains_Mono } from "next/font/google";
import { ArrowLeftCircle } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

const spaceGrotesk = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

export default function NotFoundGlobalPage() {
  return (
    <>
      <div
        className={`${spaceGrotesk.className} relative flex flex-col items-center justify-center min-h-screen bg-black p-4 overflow-x-hidden`}
      >
        <header className="absolute top-0 left-0">
          <Lottie
            animationData={Astronaut}
            className="w-40 h-40 md:w-60 md:h-60"
          />
        </header>

        <DotPattern width={20} height={20} glow className="opacity-50" />

        <h1 className="text-9xl md:text-[12rem] lg:text-[16rem] font-bold tracking-tighter leading-none flex items-center gap-2 mb-4 select-none text-white text-shadow-lg text-shadow-red-800 bg-transparent">
          <p data-aos="fade-down" data-aos-delay="500">
            4
          </p>
          <p data-aos="fade-down" data-aos-delay="600">
            0
          </p>
          <p data-aos="fade-down" data-aos-delay="700">
            4
          </p>
        </h1>

        <h2
          className="text-2xl md:text-3xl font-light uppercase mt-4 text-center text-white"
          data-aos="zoom-in"
          data-aos-delay="800"
        >
          Página não encontrada
        </h2>

        <p
          className="text-lg opacity-70 mt-4 text-center text-white/50"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          Parece que você se perdeu...
        </p>

        <Link
          href="/"
          className="mt-12 text-lg md:text-xl border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 active:bg-white active:text-black uppercase tracking-wider font-medium rounded-full flex items-center justify-between gap-2 text-white"
          data-aos="fade-left"
          data-aos-delay="600"
        >
          <ArrowLeftCircle className="w-8 h-8 text-red-800" />
          Retornar
        </Link>

        <footer className="absolute bottom-0 right-0">
          <Lottie animationData={Moon} className="w-40 h-40 md:w-60 md:h-60" />
        </footer>
      </div>
    </>
  );
}
