export const papers = [
  {
    id: "paper1",
    title: "Introduction to Artificial Intelligence",
    chapters: [
      {
        index: 1,
        title: "What is AI?",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence.",
                },
              ],
            },
            {
              type: "code_block",
              attrs: { language: "python" },
              content: [
                {
                  type: "text",
                  text: "def ai_function(input_data):\n    # AI logic here\n    return processed_data",
                },
              ],
            },
          ],
        },
        topics: [
          {
            index: 1,
            title: "History of AI",
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "The field of AI research was founded at a workshop at Dartmouth College in 1956.",
                    },
                  ],
                },
              ],
            },
          },
          {
            index: 2,
            title: "Types of AI",
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "AI can be categorized into two main types: Narrow AI and General AI.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        index: 2,
        title: "Machine Learning Basics",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Machine Learning is a subset of AI that focuses on the development of algorithms that can learn from and make predictions or decisions based on data.",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  // ... (keep the second paper as is)
];
