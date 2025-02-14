import Image from "next/image";
import Spotlight from "./spotlight";

export default function Workflows() {
  const workflowItems = [
    {
      title: "AI Software Solutions",
      description: "Custom AI software tailored to your business needs. We handle the complexity so you can focus on growth.",
      url: ""
    },
    // {
    //   title: "Hands-On AI Training",
    //   description: "Empower your team with practical AI skills. Our approach is hands-on, real-world problem-solving use cases.",
    //   url: ""
    // },
    {
      title: "AI Agent Automation",
      description: "Streamline your operations with intelligent AI agents that automate repetitive tasks.",
      url: ""
    },
    {
      title: "Unlimited AI Platform",
      description: "Access our collection of free AI apps to enhance your workflow. From creativity to productivity tools, we have it all.",
      url: "/apps"
    },

  ];

  return (
    <section id="workflows">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                What We Do
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              We Build End-to-End AI Solutions
            </h2>
            <p className="text-lg text-indigo-200/65">
              We solve real business challenges. Our approach combines custom development, training, and continuous support to ensure your success.
            </p>
          </div>
          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {workflowItems.map((item, index) => {
              const CardWrapper = item.url ? 'a' : 'div';
              return (
                <CardWrapper
                  key={index}
                  className={`group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 before:group-hover:opacity-100 after:group-hover:opacity-20 ${item.url ? 'cursor-pointer' : 'cursor-default'}`}
                  {...(item.url ? { href: item.url } : {})}
                >
                  <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
                    {/* Arrow */}
                    {item.url && (
                      <div
                        className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 transition-transform duration-300 group-hover/card:scale-120"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={9}
                          height={8}
                          fill="none"
                        >
                          <path
                            fill="#F4F4F5"
                            d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Title */}
                    <div className="flex h-[288px] items-center justify-center p-6">
                      <h3 className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-center text-3xl font-semibold text-transparent md:text-4xl">
                        {item.title}
                      </h3>
                    </div>
                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        {/* <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                          <span className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                            {item.title}
                          </span>
                        </span> */}
                      </div>
                      <p className="text-indigo-200/65">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
