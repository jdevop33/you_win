import path from "node:path";

import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    // Initialize Google Cloud Storage with your credentials
    this.storage = new Storage({
      keyFilename: path.join(process.cwd(), "../../TX_1st_Product/jobwin-dcb6ad7dd9de.json"),
      projectId: "jobwin",
    });
    this.bucket = "jobwinner-storage";
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
      blobStream.on("error", (error) => {
        reject(error);
      });
      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }
}
