// src/components/Upload.tsx
import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addPendingUpload, addAnimation as addAnimationToDB, addLottieFile } from '../utils/indexedDB';
import { RootState } from './../store/store';
import { addAnimationState } from './../store/animationsSlice';
import { LottieAnimation, PendingUpload } from './../types';
import { customFetch } from '../utils/customFetch';
// import { useNavigate } from 'react-router-dom';

const UPLOAD_ANIMATION_QUERY = `
  mutation UploadAnimation($title: String!, $description: String!, $tags: [String!]!, $metadata: String!, $file: Upload!, $duration: Int!, $category: String!) {
    uploadAnimation(title: $title, description: $description, tags: $tags, metadata: $metadata, file: $file, duration: $duration, category: $category) {
      id
      title
      url
    }
  }
`;

const Upload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [metadata, setMetadata] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offline = useAppSelector((state: RootState) => state.animations.offline);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = JSON.parse(event.target?.result as string);

      const filename = file.name;
      const uniqueID = String(Date.now());
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const pendingUpload: PendingUpload = {
        id: uniqueID, // Assign a unique ID
        title,
        metadata,
        description,
        tags,
        file,
        duration,
        category,
        filename,
      };

      const animationData: LottieAnimation = {
        id: uniqueID,
        title,
        description,
        tags,
        metadata,
        url: '',
        createdAt,
        updatedAt,
        duration,
        category,
      };

      if (offline) {
        await addPendingUpload(pendingUpload);
        dispatch(addAnimationState(animationData));
        await addAnimationToDB(animationData); // Save to IndexedDB
        await addLottieFile(uniqueID, fileData); // Use a unique ID or timestamp
        setSuccessMessage('Animation uploaded offline. It will be synced when you are online.');
      } else {
        const operations = {
          query: UPLOAD_ANIMATION_QUERY,
          variables: {
            title,
            description,
            tags,
            metadata,
            file: null, // File will be appended in the map
            duration,
            category,
          },
        };
        const map = { '0': ['variables.file'] };

        const result = await customFetch('http://localhost:4000/graphql', operations, map, file);
        if (result.data) {
          dispatch(addAnimationState(result.data.uploadAnimation));
          await addAnimationToDB(result.data.uploadAnimation); // Save to IndexedDB
          await addLottieFile(String(result.data.uploadAnimation.id), fileData); // Save the Lottie JSON file to IndexedDB
          setSuccessMessage('Animation uploaded successfully!');
        }
      }

      // Clear form fields
      setTitle('');
      setMetadata('');
      setDescription('');
      setTags([]);
      setDuration(0);
      setCategory('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Optionally navigate to another page
      // navigate('/animations'); // Uncomment this line to navigate to the animations page
    };

    reader.readAsText(file);
  };

  return (
    <div className="upload">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full px-3 py-2 border rounded-md"
        />
        <textarea
          placeholder="Metadata"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="textarea w-full px-3 py-2 border rounded-md"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          className="input w-full px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="input w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input w-full px-3 py-2 border rounded-md"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input w-full px-3 py-2 border rounded-md"
        />
        <button type="submit" className="button px-4 py-2 bg-green-600 text-white rounded-md" disabled={!file}>
          Upload
        </button>
      </form>
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
    </div>
  );
};

export default Upload;
