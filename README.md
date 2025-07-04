# LyricAI

## Description

LyricAI is a web application built within the Firebase Studio NextJS starter environment. Its core functionality revolves around leveraging AI to generate lyrics, create accompanying album art, and provide text-to-speech capabilities for the generated lyrics. The application features a modern user interface styled with Tailwind CSS.

## Features

* **AI Lyric Generation:** Generate creative and unique lyrics based on user input or themes.
* **AI Album Art Creation:** Produce visual representations for the generated lyrics.
* **Text-to-Speech (TTS):** Convert the generated lyrics into spoken audio.
* **Modern UI:** A clean and responsive user interface built with Tailwind CSS.

## Technologies Used

* **Next.js:** A React framework for server-side rendering and static site generation.
* **Firebase Studio:** The development environment used for building and deploying the application.
* **Zod:** A TypeScript-first schema declaration and validation library used for data validation.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Getting Started

## Technical Workflow

LyricAI operates within the **Firebase Studio** environment, leveraging **Next.js** as the foundational framework for the front-end and back-end API routes.

1.  **User Interaction:** The user interacts with the application through a modern UI built using **Tailwind CSS** for styling and responsiveness. User inputs, such as themes or prompts for lyric generation, are captured via forms.
2.  **Data Validation:** User input is validated on the server-side using **Zod**, ensuring that the data meets the expected schema before being processed by the AI models.
3.  **AI Processing:** Validated user input is sent to backend API routes (powered by Next.js) which interact with the AI models. These models are responsible for:
    *   Generating lyrics based on the provided input.
    *   Creating album art that complements the generated lyrics.
    *   Converting the generated lyrics into speech using text-to-speech capabilities.
4.  **Response Handling:** The results from the AI models (generated lyrics, album art data, audio file) are sent back to the Next.js front-end.
5.  **UI Update:** The front-end receives the AI-generated content and updates the user interface dynamically to display the lyrics, album art, and provide an audio player for the text-to-speech output.

The entire development and deployment process is streamlined by **Firebase Studio**, providing an integrated environment for building and managing the Next.js application and its interactions with backend services and AI models. The different components within the `src` directory, such as components for lyric display (`src/components/lyric-display.tsx`), forms (`src/components/lyric-form.tsx`), and the main page (`src/app/page.tsx`), are designed to work together within this workflow.


## Getting Started

To get started with the LyricAI project, you will need to have Firebase Studio set up. Once in the environment, you can explore the application's code starting from `src/app/page.tsx`.

## License



