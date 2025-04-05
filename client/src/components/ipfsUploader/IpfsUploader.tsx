"use client"
import { useState, useEffect, ChangeEvent } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface IPFSUploaderProps {
  onClose: () => void;
}

export default function IPFSUploader({ onClose }: IPFSUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
     
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToPinata = async (): Promise<void> => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    if (!description) {
      toast.info("Please enter a description");
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading to IPFS...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('walletAddress', walletAddress);
      formData.append('description', description);

      const response = await fetch('/api/upload-to-pinata', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setIpfsHash(data.IpfsHash);
        toast.success('Upload successful!');
        setUploadStatus('Upload successful!');

      onClose();
      const backendResponse = await fetch('http://localhost:4000/api/patient/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordHash: data.IpfsHash,
          walletAddress,
          
        }),
      });
      
      if (backendResponse.ok) {
        setUploadStatus('Upload complete and hash saved to backend!');
      } else {
        const backendError = await backendResponse.json();
        setUploadStatus(`Upload successful, but failed to save hash: ${backendError.message}`);
      }
      } else {
        toast.error(`Upload failed: ${data.error}`);
        setUploadStatus(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Upload failed');
      setUploadStatus(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload to IPFS</DialogTitle>
          <DialogDescription>
            Upload your document to IPFS via Pinata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Connected Wallet:</p>
            <p className="text-sm font-mono bg-secondary p-2 rounded">
              {walletAddress || 'No wallet connected'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select file to upload
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <Input
              type="text"
              placeholder="Enter the file description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {file && (
            <div>
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name}
              </p>
            </div>
          )}

          {uploadStatus && ipfsHash && (
            <div className="bg-green-50 p-3 rounded">
              <p className="text-green-800">{uploadStatus}</p>
              <p className="text-sm font-mono break-all mt-2">
                IPFS Hash: {ipfsHash}
              </p>
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm block mt-2"
              >
                View on IPFS Gateway
              </a>
            </div>
          )}

          <Button 
            onClick={uploadToPinata} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload to IPFS'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}