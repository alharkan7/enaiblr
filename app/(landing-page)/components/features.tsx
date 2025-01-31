import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import FeaturesImage from "@/public/images/features.png";

export default function Features() {
  return (
    <section className="relative">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Our Experiences
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Trusted by Leading Organizations
            </h2>
            <p className="text-lg text-indigo-200/65">
            We&apos;ve won awards, collaborated, and get certified by top companies and organizations.
            </p>
          </div>
          {/* Items */}
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-12 md:gap-x-14 md:gap-y-16">
            {[
              '1-logo-telkom.svg',
              '2-logo-dsi.svg',
              '3-logo-amsi.svg',
              '4-logo-super.svg',
              '5-logo-seatoday.svg',
              '6-logo-google-developers.svg',
              '7-logo-aws-cp.svg',
              '8-logo-hackerrank.svg',
              '9-logo-ui.svg',
              '10-logo-purwadhika.svg',
              '11-logo-iykra.svg',
              '12-logo-bitlabs.svg',
              '13-logo-umm.svg',
              '14-logo-nus.svg',
              '15-logo-asu.svg',
              '16-logo-1000-startup.svg',
              '17-logo-startup-weekend.svg',
              '18-logo-embassy-netherlands.svg',
              '19-logo-im.svg'
            ].map((logo) => (
              <div key={logo} className="flex items-center justify-center">
                <div className="relative h-12 min-w-[180px] max-w-[200px] flex-1 transition-transform duration-300 ease-out hover:[transform:scale(1.3)]">
                  <Image
                    src={`/images/experiences/${logo}`}
                    alt={logo.replace('.svg', '').split('-').slice(1).join(' ')}
                    fill
                    className="object-contain [filter:invert(1)_saturate(0)_brightness(1.75)_contrast(0.8)_opacity(0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
