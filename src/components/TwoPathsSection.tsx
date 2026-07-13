import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const paths = [
  {
    audience: "For Agencies",
    name: "The Cinder Dashboard",
    body: "Track every client's AI visibility in one place. Benchmark against competitors, see which sources get cited, and report it all under your own brand.",
    to: "/services#agencies",
    linkLabel: "Explore the dashboard",
    bg: "bg-black",
  },
  {
    audience: "For Small Business",
    name: "The Cinder Service",
    body: "Our team optimizes your AI presence directly, so you show up in the answers your customers are already asking, without hiring for it.",
    to: "/services#small-business",
    linkLabel: "Explore the service",
    bg: "bg-[#8A3220]",
  },
];

export default function TwoPathsSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        <p className="text-black/60 text-sm mb-2">One Engine, Two Ways In</p>
        <h2
          className="text-black text-4xl md:text-5xl font-medium leading-tight mb-16 max-w-2xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          However you want to win AI search, we have a way in.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paths.map((path) => (
            <div
              key={path.name}
              className={`rounded-2xl ${path.bg} p-8 md:p-10 min-h-72 flex flex-col justify-between`}
            >
              <div>
                <p className="text-white/50 text-sm mb-3">{path.audience}</p>
                <h3
                  className="text-white text-2xl md:text-3xl font-medium leading-snug mb-4"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {path.name}
                </h3>
                <p className="text-white/60 text-base max-w-md">
                  {path.body}
                </p>
              </div>

              <Link
                to={path.to}
                className="group inline-flex items-center gap-3 text-white font-medium mt-8"
              >
                <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
                {path.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
