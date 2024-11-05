export const papers = [
  {
    id: "paper1",
    title: "Introduction to Artificial Intelligence",
    chapters: [
      {
        id: "chapter1",
        title: "What is AI?",
        topics: [
          {
            id: "topic1",
            title: "Definition of AI",
            content: `
              <h1>Definition of AI</h1>
              <p>Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence.</p>
              <pre><code class="language-python">
def ai_function(input_data):
    # AI logic here
    return processed_data
              </code></pre>
            `,
          },
          {
            id: "topic2",
            title: "History of AI",
            content: `
              <h1>History of AI</h1>
              <p>The field of AI research was founded at a workshop at Dartmouth College in 1956.</p>
            `,
          },
        ],
      },
      {
        id: "chapter2",
        title: "Machine Learning Basics",
        topics: [
          {
            id: "topic3",
            title: "Types of Machine Learning",
            content: `
              <h1>Types of Machine Learning</h1>
              <p>Machine Learning can be categorized into three main types: Supervised Learning, Unsupervised Learning, and Reinforcement Learning.</p>
            `,
          },
          {
            id: "topic4",
            title: "Common Algorithms",
            content: `
              <h1>Common Algorithms</h1>
              <p>Some common machine learning algorithms include Linear Regression, Decision Trees, and Neural Networks.</p>
            `,
          },
        ],
      },
    ],
  },
  {
    id: "paper2",
    title: "Quantum Computing Fundamentals",
    chapters: [
      {
        id: "chapter3",
        title: "Quantum Mechanics Principles",
        topics: [
          {
            id: "topic5",
            title: "Superposition",
            content: `
              <h1>Superposition</h1>
              <p>Superposition is a fundamental principle of quantum mechanics where a quantum system can exist in multiple states simultaneously.</p>
            `,
          },
          {
            id: "topic6",
            title: "Entanglement",
            content: `
              <h1>Entanglement</h1>
              <p>Quantum entanglement occurs when particles become correlated in such a way that the quantum state of each particle cannot be described independently.</p>
            `,
          },
        ],
      },
    ],
  },
];
