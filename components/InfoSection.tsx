import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARD_IMAGE =
  "https://images.pexels.com/videos/8333185/abstract-art-artistic-background-8333185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

export default function InfoSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: "-0.03em" }}
            >
              Meet <span className="text-[#FF6E00]">Cinder</span>.
            </h2>
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200"
            >
              How it works
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-5 h-5 text-black" />
              </span>
            </Link>
          </div>
          <div>
            <p className="text-black/70 text-2xl md:text-3xl leading-relaxed">
              Cinder is the{" "}
              <strong className="font-semibold text-3xl md:text-4xl text-black">
                AI visibility platform
              </strong>{" "}
              built for Canada: a{" "}
              <strong className="font-semibold text-3xl md:text-4xl text-black">
                self service dashboard
              </strong>{" "}
              for agencies and small businesses dedicated to optimizing your
              online presence. One engine,{" "}
              <span className="font-semibold text-3xl md:text-4xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                two ways to get named
              </span>
              .
            </p>
          </div>
        </div>

        {/* Row 2 - cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 - spans 2 cols on lg */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${CARD_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-7 min-h-80 flex flex-col justify-between">
              <h3
                className="text-black text-2xl font-medium leading-snug"
                style={{ letterSpacing: "-0.02em" }}
              >
                Visibility that compounds
              </h3>
              <p className="text-black/70 text-base max-w-xs">
                Every <strong className="font-semibold text-lg text-black">citation</strong>{" "}
                builds trust. The more AI engines reference your content, the
                more often you become the{" "}
                <strong className="font-semibold text-lg text-black">default answer</strong>{" "}
                in your category.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-[#FF6E00] p-7 min-h-80 flex flex-col justify-between">
            <h3 className="text-white text-2xl font-medium leading-snug">
              Always accurate,
              <br />
              always cited.
            </h3>
            <p className="text-white/60 text-base">
              Stay the reference{" "}
              <strong className="font-semibold text-lg text-white">AI models trust</strong>,
              with no stale data and no outdated claims holding your brand
              back.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-[#FF6E00] p-7 min-h-80 flex flex-col justify-between">
            <h3 className="text-white text-2xl font-medium leading-snug">
              Fully
              <br />
              monitored.
            </h3>
            <p className="text-white/60 text-base">
              Skip manually checking every AI platform. Cinder tracks your{" "}
              <strong className="font-semibold text-lg text-white">
                citations and rankings
              </strong>{" "}
              for you,{" "}
              <span className="font-semibold text-lg underline decoration-2 underline-offset-4 decoration-white/60">
                continuously
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
