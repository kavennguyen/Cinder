import { ArrowRight } from "lucide-react";

const USECASE_VIDEO =
  "https://videos.pexels.com/video-files/29397254/12662101_1920_1080_30fps.mp4";
const USECASE_POSTER =
  "https://images.pexels.com/videos/29397254/abstract-animation-gradient-background-29397254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

export default function UseCasesSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left column */}
        <div className="md:pr-12 md:pt-2">
          <p className="text-black/60 text-sm mb-2">Cinder in Practice</p>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Use cases
          </h2>
          <p className="text-black/60 text-base leading-relaxed max-w-sm">
            Cinder powers AI visibility for brands, agencies, and
            enterprise marketing teams across Canada who need to be found,
            and trusted, inside AI generated answers.
          </p>
        </div>

        {/* Right column - video panel */}
        <div className="relative rounded-3xl overflow-hidden min-h-[720px]">
          <video
            className="object-cover absolute inset-0 w-full h-full"
            autoPlay
            muted
            loop
            playsInline
            poster={USECASE_POSTER}
          >
            <source src={USECASE_VIDEO} type="video/mp4" />
          </video>

          <div className="relative z-10 p-10 md:p-12">
            <h3
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-5"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ecommerce
            </h3>
            <p className="text-black/70 text-base max-w-md mb-8">
              Win the AI shopping moment. When ChatGPT or Gemini recommends
              products, make sure it's your brand customers hear about first.
            </p>
            <a
              href="#"
              className="group inline-flex items-center gap-3 text-black font-medium"
            >
              <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
              See how
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
