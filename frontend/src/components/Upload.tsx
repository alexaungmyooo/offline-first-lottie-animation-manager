// src/components/Upload.tsx
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addPendingUpload,
  addAnimation as addAnimationToDB,
} from "../utils/indexedDB";
import { RootState } from "../store/store";
import { addAnimationState } from "../store/animationsSlice";
import { LottieAnimation } from "../types";
import { customFetch } from "../utils/customFetch";
import { UPLOAD_ANIMATION_QUERY } from "../graphql/mutations";

const Upload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offline = useAppSelector(
    (state: RootState) => state.animations.offline
  );
  const dispatch = useAppDispatch();
  const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    if (!title || !description || !tags.length) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileData = JSON.parse(event.target?.result as string);
        const uniqueID = uuidv4(); // Generate a UUID
        const timestamp = new Date().toISOString();

        const animationData: LottieAnimation = {
          id: uniqueID,
          title,
          description,
          tags,
          createdAt: timestamp,
          updatedAt: timestamp,
          file,
          filename: file.name,
          url: "", // Initialize url property
          metadata: fileData, // Store full animation JSON here
        };

        if (offline) {
          await handleOfflineUpload(animationData);
        } else {
          await handleOnlineUpload(animationData, file);
        }

        clearForm();
      } catch (error) {
        console.error('Error reading file:', error);
        setErrorMessage("Error reading file. Please ensure it is a valid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const handleOfflineUpload = async (animationData: LottieAnimation) => {
    try {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register("sync-pending-uploads");
        await addPendingUpload(animationData);
        dispatch(addAnimationState(animationData));
        await addAnimationToDB(animationData); // Save to IndexedDB
        setSuccessMessage("Animation uploaded offline. It will be synced when you are online.");
      }
    } catch (err) {
      console.error("Sync registration failed:", err);
      setErrorMessage("Offline upload failed. Please try again.");
    }
  };

  const handleOnlineUpload = async (animationData: LottieAnimation, file: File) => {
    try {
      const operations = {
        query: UPLOAD_ANIMATION_QUERY,
        variables: {
          id: animationData.id,
          title: animationData.title,
          description: animationData.description,
          tags: animationData.tags,
          file: null,
        },
      };
      const map = { "0": ["variables.file"] };

      const result = await customFetch(GRAPHQL_API_URL, operations, map, file);
      if (result.data) {
        const savedAnimation = {
          ...result.data.uploadAnimation,
          file: null,
          url: result.data.uploadAnimation.url,
        };
        dispatch(addAnimationState(savedAnimation));
        await addAnimationToDB(savedAnimation);
        setSuccessMessage("Animation uploaded successfully!");
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Online upload failed:', error);
      setErrorMessage("Error uploading animation. Please try again.");
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
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
      {errorMessage && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default Upload;
