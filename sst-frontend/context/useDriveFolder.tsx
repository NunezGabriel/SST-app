import { useEffect, useState } from "react";
import { getDriveFilesRequest, DriveFile } from "@/lib/api/drive";
import { useAuthContext } from "@/context/AuthContext";

export const useDriveFolder = (folderId?: string) => {
  const { user } = useAuthContext();
  const [files, setFiles]       = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token) return;

    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDriveFilesRequest(user.token, folderId);
        setFiles(data.files);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [folderId, user?.token]);

  return { files, isLoading, error };
};