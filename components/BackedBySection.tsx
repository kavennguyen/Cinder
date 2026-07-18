import { aiPlatforms } from "./AiEngineIcons";

export default function BackedBySection() {
  return (
    <section className="bg-white px-6">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <div className="text-black/70 text-base leading-relaxed">
          Tracking your visibility
          <br />
          across every major AI engine.
        </div>

        <div className="md:col-span-3 overflow-hidden">
          <style>{`
            @keyframes backers-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .backers-track {
              display: flex;
              width: max-content;
              animation: backers-marquee 24s linear infinite;
            }
          `}</style>
          <div className="backers-track">
            {[...aiPlatforms, ...aiPlatforms].map((platform, i) => (
              <span
                key={i}
                className="mx-10 shrink-0 flex items-center gap-2.5 text-black/60 whitespace-nowrap"
              >
                {platform.icon}
                <span className="text-base font-medium">{platform.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
