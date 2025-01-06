# Subconscious.io

Subconscious.io is a second-brain application that allows users to organize and revisit important content such as tweets, YouTube videos, and Notion documents. With a powerful AI-powered similarity search feature, users can effortlessly retrieve and explore related content based on semantic relevance.

## Features

- **Content Organization:** Save and categorize tweets, YouTube videos, and Notion documents for future reference.
- **AI-Powered Similarity Search:** Retrieve related content using advanced AI embeddings for semantic matching.
- **Intuitive Interface:** Minimalist design for a seamless user experience.
- **Cross-Platform Accessibility:** Access your second brain from any device.

## Live Demo

Check out the live application: [Subconscious.io](https://subconcious.vercel.app/)

## Technologies Used

### Backend
- **Node.js**: Server-side runtime environment.
- **MongoDB**: Database for storing and managing user content.
- **AI Embeddings**: For implementing similarity search.
- **TypeScript**: Strongly-typed language for reliable development.

### Frontend
- **React**: Component-based UI library.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI design.
- **Vite**: Fast build tool and development server.

## Project Structure

```
subconscious.io/
├── backend/            # Backend
│   ├── src/
│   │   └── main.ts     # Main server file
│   ├── tsconfig.json   # TypeScript configuration
│   └── package.json    # Backend dependencies
└── frontend/           # Frontend
    ├── src/
    │   ├── components/ # React components
    │   ├── assets/     # Static assets
    │   └── main.tsx    # Entry point
    ├── tailwind.config.js # Tailwind CSS configuration
    └── package.json    # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:mriduljain0999/subconscious.io.git
   cd subconscious.io
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to the provided URL (usually `http://localhost:3000`).

## How to Use

1. **Save Content:**
   - Add tweets, YouTube videos, or Notion documents to your second brain.

2. **Search Content:**
   - Use the similarity search feature to find related items effortlessly.

3. **Explore and Revisit:**
   - Navigate through your organized content whenever needed.

## Contribution

Contributions are welcome! If you encounter bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you have any questions or feedback, feel free to reach out:
- **GitHub**: [mriduljain0999](https://github.com/mriduljain0999)
