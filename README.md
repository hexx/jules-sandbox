# AI-Powered Task Management App

## Description

This is a task management application that allows users to create, manage, and delete tasks. A key feature is its ability to use AI (via the Vercel AI SDK and OpenAI) to split existing tasks into smaller, actionable subtasks. The UI is built using `shadcn/ui` components and styled with Tailwind CSS, providing a modern and responsive design.

## Tech Stack

*   **Runtime**: Deno
*   **Frontend Framework**: React (with Vite)
*   **Backend Framework**: Hono
*   **Routing**: TanStack Router
*   **UI Components**: shadcn/ui
*   **Styling**: Tailwind CSS
*   **AI Integration**: Vercel AI SDK (using OpenAI)

## Prerequisites

*   **Deno**: Latest version recommended (compatible with Deno 2.x features). You can install it from [deno.land](https://deno.land/).
*   **`OPENAI_API_KEY`**: An environment variable named `OPENAI_API_KEY` must be set. This key is essential for the AI-powered task splitting feature. Without it, the backend will return an error if you try to split a task. You can obtain an API key from [OpenAI](https://platform.openai.com/account/api-keys).
*   **Tailwind CSS**: The project uses Tailwind CSS for styling, which is configured within the project and managed by Vite and Deno. No separate user-side setup for Tailwind is needed beyond the project's dependencies.

## Setup and Installation

1.  **Clone the repository** (if applicable, or ensure you have the project files).
2.  **Dependencies**: No explicit installation step for dependencies like Node.js `package.json`. Deno manages dependencies via their URLs or specifiers (including those from JSR for Deno-native modules like Hono and the Deno Standard Library, and `esm.sh` for many npm packages) listed in the `deno.jsonc` import map. Deno will download and cache them automatically when you run the application or tests.
3.  **Environment Variable**: Ensure `OPENAI_API_KEY` is set in your environment.
    *   You can set it in your shell: `export OPENAI_API_KEY='your_actual_api_key_here'`
    *   Alternatively, for a more project-specific setup (though not implemented in the current code), you could use a `.env` file and a library like `deno-dotenv` to load it when the application starts. The current setup directly uses `Deno.env.get("OPENAI_API_KEY")`.
4.  **`shadcn/ui` Components**: UI components from `shadcn/ui` are manually added to the `src/components/ui` directory. There is no separate CLI installation step for these components after cloning/setting up the project.
5.  **Tailwind CSS Setup**: Tailwind CSS is configured via `tailwind.config.ts` and `postcss.config.js`, and is processed during development (`deno task dev`) and build (`deno task build`).

## Available Scripts/Tasks

The following tasks are defined in `deno.jsonc` and can be run using `deno task <task_name>`:

*   `deno task dev`: Starts the Vite development server for the frontend. The application will typically be available at `http://localhost:5173`.
*   `deno task build`: Builds the frontend application for production. Output files will be placed in the `dist` directory.
*   `deno task serve`: Previews the production build of the frontend locally.
*   `deno task start`: Starts the Hono backend API server. By default, it listens on `http://localhost:8000`.
*   `deno task test`: Runs the backend API tests using Deno's built-in test runner. This requires a Deno environment.

## Running the Application

1.  **Start the backend server**:
    ```bash
    deno task start
    ```
    The API server will start, typically on port 8000.

2.  **In a separate terminal, start the frontend development server**:
    ```bash
    deno task dev
    ```
    Vite will compile the frontend and make it available, usually at `http://localhost:5173` (check the terminal output from Vite for the exact URL).

3.  **Access the application**: Open your web browser and navigate to the URL provided by the Vite development server (e.g., `http://localhost:5173`).

## Key Features

*   **CRUD Operations**: Create, display, update (mark as complete/incomplete), and delete tasks.
*   **AI-Powered Task Splitting**: Select an existing task to be automatically split into several smaller subtasks by an AI model (OpenAI GPT-3.5-turbo or similar). This feature requires a valid `OPENAI_API_KEY` to be configured.
*   **Modern UI**: Styled with Tailwind CSS and built using `shadcn/ui` components for a responsive and clean user experience.
*   **In-Memory Storage**: The backend currently uses an in-memory array to store tasks. This means tasks will be lost when the backend server restarts.

## Project Structure (Brief Overview)

*   `deno.jsonc`: Deno configuration file, including an import map for managing dependencies from various sources (e.g., JSR for Hono and Deno Standard Library, `esm.sh` for React and Tailwind-related packages) and task definitions.
*   `tailwind.config.ts`: Configuration for Tailwind CSS.
*   `postcss.config.js`: Configuration for PostCSS, used by Tailwind CSS.
*   `components.json`: Configuration file for shadcn/ui.
*   `vite.config.ts`: Configuration file for Vite, the frontend build tool.
*   `index.html`: The main HTML entry point for the React application.
*   `src/`: Contains the main source code.
    *   `api/`: Hono backend server code.
        *   `index.ts`: Main Hono application setup and routing.
        *   `tasks.ts`: API routes and logic specific to task management.
        *   `tasks.test.ts`: Backend tests for the task API.
    *   `components/`: Reusable React UI components.
        *   `ui/`: Manually added shadcn/ui components (e.g., `button.tsx`, `card.tsx`, `input.tsx`).
        *   `TaskItem.tsx`, `TaskList.tsx`, `AddTaskForm.tsx`: Application-specific components, now using shadcn/ui elements.
    *   `hooks/`: Custom React hooks (currently empty).
    *   `lib/`: Utility functions, including `utils.ts` for `cn` (Tailwind class merging).
    *   `routes/`: TanStack Router page components and route definitions.
        *   `__root.tsx`: The root layout component for the router.
        *   `index.tsx`: The main page component for displaying and managing tasks.
    *   `main.tsx`: The entry point for the React frontend application, sets up the router.
    *   `app.tsx`: The main App component containing the overall layout.
    *   `types.ts`: TypeScript type definitions (e.g., `Task` interface).
    *   `index.css`: Global styles, including Tailwind CSS base directives and shadcn/ui theme variables.
*   `dist/`: Output directory for the production build of the frontend (generated by `deno task build`).

[end of README.md]
