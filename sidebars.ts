import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: "category",
      label: "🚀Frontend Development in the Age of AI: Strategy and Execution",
      items: [
        {
          type: "category",
          label: "📚 Sessions",
          items: [
            "index",
            "sessions/session-1",
            "sessions/session-2",
            "sessions/session-3",
            "sessions/capstone-project",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
