import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import type { UploadLogResponseDto } from './dto/upload.dto';
import type  Multer  from 'multer';

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadLog(@UploadedFile() file: Multer.File): Promise<UploadLogResponseDto> {
    return this.uploadService.processLog(file);
  }
}
