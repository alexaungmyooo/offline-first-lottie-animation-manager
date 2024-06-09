// src/components/Upload.tsx
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addPendingUpload,
  addAnimation as addAnimationToDB,
  addLottieFile,
} from "../utils/indexedDB";
import { RootState } from "./../store/store";
import { addAnimationState } from "./../store/animationsSlice";
import { LottieAnimation } from "./../types";
import { customFetch } from "../utils/customFetch";
import { UPLOAD_ANIMATION_QUERY } from "../graphql/mutations";
// import { useNavigate } from 'react-router-dom';

const Upload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offline = useAppSelector(
    (state: RootState) => state.animations.offline
  );
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = JSON.parse(event.target?.result as string);

      const uniqueID = uuidv4(); // Generate a UUID
      const timestamp = new Date().toISOString();

      const baseData = {
        id: uniqueID,
        title,
        description,
        tags,
        metadata,
        duration,
        category,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const animationData: LottieAnimation = {
        ...baseData,
        file,
        filename: file.name,
      };

      // const animationData: LottieAnimation = {
      //   ...baseData,
      //   url: "",
      // };

      if (offline) {
        await handleOfflineUpload(animationData, fileData);
      } else {
        await handleOnlineUpload(animationData, fileData, file);
      }

      clearForm();
    };

    reader.readAsText(file);
  };

  const handleOfflineUpload = async (animationData: LottieAnimation, fileData: unknown) => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync
          .register("sync-pending-uploads")
          .then(async () => {
            await addPendingUpload(animationData);
            dispatch(addAnimationState(animationData));
            await addAnimationToDB(animationData); // Save to IndexedDB
            await addLottieFile(animationData.id, fileData); // Use a unique ID or timestamp
            setSuccessMessage(
              "Animation uploaded offline. It will be synced when you are online."
            );
          })
          .catch((err) => {
            console.error("Sync registration failed:", err);
          });
      });
    }
  };

  const handleOnlineUpload = async (animationData: LottieAnimation, fileData: unknown, file: File) => {
    const operations = {
      query: UPLOAD_ANIMATION_QUERY,
      variables: {
        id: animationData.id, // Pass the unique ID to the mutation
        title: animationData.title,
        description: animationData.description,
        tags: animationData.tags,
        metadata: animationData.metadata,
        file: null, // File will be appended in the map
        duration: animationData.duration,
        category: animationData.category,
      },
    };
    const map = { "0": ["variables.file"] };

    const result = await customFetch(GRAPHQL_API_URL, operations, map, file);
    if (result.data) {
      dispatch(addAnimationState(result.data.uploadAnimation));
      await addAnimationToDB(result.data.uploadAnimation); // Save to IndexedDB
      await addLottieFile(String(result.data.uploadAnimation.id), fileData); // Save the Lottie JSON file to IndexedDB
      setSuccessMessage("Animation uploaded successfully!");
    }
  };

  const clearForm = () => {
    setTitle("");
    setMetadata("");
    setDescription("");
    setTags([]);
    setDuration(0);
    setCategory("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
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
        <button
          type="submit"
          className="button px-4 py-2 bg-green-600 text-white rounded-md"
          disabled={!file}
        >
          Upload
        </button>
      </form>
      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default Upload;
