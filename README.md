# Miky - Frontend

Miky is a social media platform designed exclusively for pets, allowing them to create accounts, post updates, follow other pets, and engage in a pet-friendly community.

## Live Site
Miky: https://miky-frontend.vercel.app/

![Preview](./ss.png)

## Features
- Custom authentication (JWT-based)
- Create, comment, save, and manage posts
- Follow/unfollow users
- Profile editing
- Fully responsive UI with Tailwind CSS and ShadCN

## Tech Stack
- React
- Next.js
- TypeScript
- Redux
- Tailwind CSS
- ShadCN
- Cloudinary for image uploads

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/t4sn33m-s4h4t/miky-frontend.git
cd miky-frontend
```
### 2. Install Dependencies
```bash
npm install --force
```
### 3. Set Up Environment Variables
Create a .env.local file in the root directory and add the following:
```bash
NEXT_PUBLIC_BACKEND_API=http://localhost:8000/api/v1 
```

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000.
