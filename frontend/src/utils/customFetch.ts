// src/utils/customFetch.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFetch = async (url: string, operations: any, map: any, file: File) => {
    const formData = new FormData();
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('0', file);
  
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
  
    return response.json();
  };
  