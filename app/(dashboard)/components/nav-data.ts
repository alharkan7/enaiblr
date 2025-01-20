import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    ShieldCheck,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    UsersRound,
  } from "lucide-react"

export const data = {
    user: {
      name: "Enaiblr AI",
      email: "mail@enaiblr.org",
      avatar: "icon.png",
    },
    teams: [
      {
        name: "Enaiblr AI",
        logo: ShieldCheck,
        plan: "Administrator",
      },
      // {
      //   name: "Acme Corp.",
      //   logo: AudioWaveform,
      //   plan: "Startup",
      // },
      // {
      //   name: "Evil Corp.",
      //   logo: Command,
      //   plan: "Free",
      // },
    ],
    navUser: [
        {
            title: "Users",
            url: "#",
            icon: UsersRound,
            isActive: true,
            items: [
                {
                    title: "Users Info",
                    url: "/dashboard?view=users",
                },
                {
                    title: "Subscriptions",
                    url: "/dashboard?view=subscriptions",
                }
            ]
        }
    ],
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }