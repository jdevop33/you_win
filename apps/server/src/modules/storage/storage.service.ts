import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { join } from 'node:path';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_CREDENTIALS!)
    });
    this.bucket = process.env.GCP_STORAGE_BUCKET!;
  }

  // Upload a file and return its public URL
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const blob = this.storage.bucket(this.bucket).file(file.originalname);
    
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", () => {
        resolve(`https://storage.googleapis.com/${this.bucket}/${blob.name}`);
      });
      blobStream.end(file.buffer);
    });
  }
}