# Offline-First Lottie Animation Management System

## Objective
Build a small React application and the required APIs that enable users to search, preview, upload, and download Lottie Animations. The application must have a detailed animation view showing the basic metadata of the animation and provide robust offline capabilities, allowing users to interact with animations and access detailed metadata even when no internet connection is available.

## Technology Stack
- **GraphQL**: For API development to handle search queries, file upload/download, and metadata retrieval.
- **React**: For the front-end.
- **TypeScript**: For static typing.
- **Service Workers**: For offline support.
- **State Management Library**: Redux.
- **IndexedDB**: For local caching.
- **Node.js with Express**: For the back-end.
- **MySQL**: For storing animation JSON and user collaboration state.

## Features
1. **GraphQL API**:
   - **Search/Browse animations**: Allow users to query animations based on different criteria.
   - **File Upload**: Enable users to upload Lottie animations files from their computers.
   - **File Download**: Allow users to download animation files to their computer.

2. **Service Workers and Caching**: 
   - Implement service workers to provide offline support.
   - Cache animations and other assets so they can be viewed offline.

3. **Progressive Web App (PWA) Features**:
   - Make the application installable with a manifest and meet other PWA criteria.

4. **GraphQL API Interactions**:
   - Implement the necessary front-end operations to interact with your GraphQL API.

5. **State Management**:
   - Manage application state, especially with offline data and online data synchronization.

6. **API Interactions**:
   - Fetch animations using either your own API or the LottieFiles GraphQL API.

7. **Performance Optimizations**:
   - Ensure that the app is performant, particularly when switching between online and offline modes.

## Bonus
- Implement syncing with the local library when the app goes back online.
- Resolve any conflicts or duplicates intelligently.

## Project Structure
- `backend/`: Contains the Node.js backend code with Express and GraphQL.
- `frontend/`: Contains the React front-end code.
- `docker-compose.yml`: Docker Compose configuration file.
- `Dockerfile` (backend): Dockerfile for the backend.
- `Dockerfile` (frontend): Dockerfile for the frontend.

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/alexaungmyooo/offline-first-lottie-animation-manager.git
    cd offline-first-lottie-animation-manager
    ```

2. **Create Environment Variables**:
   - Create a `.env` file in the root of the `backend` directory with the following content:
     ```sh
     ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:5173,http://localhost:4173
     DATABASE_URL=mysql://[MYSQL_USER]:[MYSQL_ROOT_PASSWORD]:3306/lottiefiles
     SERVER_PORT=4000
     BASE_URL=http://localhost:4000
     ```

   - Create a `.env` file in the root of the `frontend` directory with the following content:
     ```sh
     REACT_APP_GRAPHQL_API_URL=http://localhost:4000/graphql
     ```

3. **Build and Start the Docker Containers**:
    ```sh
    docker-compose up --build
    ```

   **Note**: If you encounter the error `P1001: Can't reach database server at 'db:3306'`, you might need to stop the containers and run `docker-compose up` again to ensure that the backend service starts correctly.



4. **Access the Application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend GraphQL Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)
   
## API Endpoints

### GraphQL Queries

- **searchAnimations**: Search animations based on a query and tags.
- **getAnimation**: Get detailed information of a specific animation.
- **animationsSince**: Get animations updated since the last sync time.

### GraphQL Mutations

- **uploadAnimation**: Upload a Lottie animation file.

## Usage

1. **Upload an Animation**:
   - Go to the upload page and fill in the required fields. Choose a Lottie animation file to upload. The application will handle both online and offline uploads.

2. **Search and View Animations**:
   - Use the search functionality to find animations based on the title, description, and tags. Click on an animation to view its details and preview it.

3. **Offline Support**:
   - The application will cache animations and their metadata for offline access. Service workers and IndexedDB ensure that users can interact with the application even without an internet connection.

## Development

### Backend

- The backend uses Node.js with Express and GraphQL.
- To run the backend locally:
    ```sh
    cd backend
    npm install
    npm run dev
    ```

### Frontend

- The frontend uses React with TypeScript.
- To run the frontend locally:
    ```sh
    cd frontend
    npm install
    npm start
    ```

## Contribution

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.

## Authors

- Alex Aung Myo Oo
