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
git clone https://github.com/yourusername/miky-frontend.git
cd miky-frontend
```
### 2. Install Dependencies
```bash
npm install 
```
### 3. Set Up Environment Variables
Create a .env.local file in the root directory and add the following:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000.
