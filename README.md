# Image Transform

A web application that processes images by removing backgrounds and applying transformations. Users can upload images, which are automatically processed through background removal and horizontal flip operations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3
- **External APIs**: Remove.bg (background removal), Pixelixe (image transformations)
- **Frontend**: React 19, TypeScript, Tailwind CSS

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name

# External APIs
BG_REMOVE_API_KEY=your_remove_bg_api_key
PIXELIXE_API_KEY=your_pixelixe_api_key

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Testing

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## System Architecture

### High-Level Flow

```mermaid
graph TD
    A[User Uploads Image] --> B[Next.js API Route]
    B --> C[Upload to S3<br/>original/]
    B --> D[Create DB Record<br/>status: processing]
    B --> E[Return Image ID]
    
    D --> F[Async Processing]
    F --> G[Fetch from S3]
    G --> H[Remove.bg API<br/>Background Removal]
    H --> I[Upload Temp to S3<br/>temp/]
    I --> J[Pixelixe API<br/>Horizontal Flip]
    J --> K[Upload Final to S3<br/>processed/]
    K --> L[Delete Temp File]
    L --> M[Update DB<br/>status: completed]
    
    E --> N[Frontend Polls<br/>Image Status]
    M --> N
    N --> O[Display Processed Image]

    style A fill:#e1f5ff
    style O fill:#d4edda
    style H fill:#fff3cd
    style J fill:#fff3cd
    style C fill:#f8d7da
    style I fill:#f8d7da
    style K fill:#f8d7da
    style D fill:#d1ecf1
    style M fill:#d1ecf1
```

### Components

- **Next.js Frontend**: React UI for upload and image display
- **Next.js API Routes**: Handles upload, image listing, and stats
- **PostgreSQL**: Stores image metadata (id, URLs, status, session)
- **AWS S3**: Stores original, temporary, and processed images
- **Remove.bg API**: Removes image backgrounds
- **Pixelixe API**: Applies horizontal flip transformation

### Storage Considerations

- **S3 Bucket Structure**:
  - `original/` - Original uploaded images
  - `temp/` - Intermediate files (cleaned up after processing)
  - `processed/` - Final transformed images
- **Database**: Stores metadata only (URLs, status, timestamps)
- **Presigned URLs**: Used for secure, time-limited access

### Tradeoffs

- **Synchronous Processing**: Images are processed asynchronously after upload response, but without a queue system. High volume may require queue implementation.
- **Temp File Cleanup**: Temporary files are deleted after processing, but cleanup failures are non-critical and may leave orphaned files.

### Assumptions

- Session-based tracking via cookies (no user authentication)
- Processing completes within reasonable time limits (no timeout handling for long-running operations)
