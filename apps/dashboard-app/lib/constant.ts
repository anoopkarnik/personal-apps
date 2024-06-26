import { BadgeCentIcon, BluetoothConnectedIcon, Briefcase, BriefcaseIcon, Library, LibraryIcon, Notebook, NotebookIcon, WorkflowIcon } from "lucide-react";
import { Connection } from "./types";

export const sidebarItems = [
  {
      title: "Financial",
      icon: BadgeCentIcon,
      href: "/dashboard/financial"
  },
  {
      title: "Projects",
      icon: BriefcaseIcon,
      href: "/dashboard/projects"
  },
  {
      title: "Planner",
      icon: NotebookIcon,
      href: "/dashboard/planner"
  },
  {
      title: "Knowledge Base",
      icon: LibraryIcon,
      href: "/dashboard/knowledge-base"
  },
  {
      title: "Workflows",
      icon: WorkflowIcon,
      href: "/dashboard/workflows"
  },
  {
      title: "Connections",
      icon: BluetoothConnectedIcon,
      href: "/dashboard/connections"
  }
]

export const CONNECTIONS: Connection[] = [
    {
      title: 'Notion',
      description: 'Create entries in your notion dashboard and automate tasks.',
      image: '/notion.png',
      accessTokenKey: 'accessToken',
      showModal: false
    },
    {
      title: 'OpenAI',
      description: 'Interact with openAI API',
      image: '/openai.png',
      accessTokenKey: 'accessToken',
      showModal: true,
      formElements: [
        {
          label: 'API Key',
          placeholder: 'Enter your OpenAI API Key',
          type: 'text',
          name: 'apiKey'
        }
      ]

    }
  ]