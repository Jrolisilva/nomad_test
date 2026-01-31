import { BadRequestException, Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import type { UploadLogResponseDto } from './dto/upload.dto';
import type Multer from 'multer';

@Injectable()
export class UploadService {
  constructor(private readonly parserService: ParserService) {}

  async processLog(file: Multer.File): Promise<UploadLogResponseDto> {
    if (!file?.buffer?.length) {
      throw new BadRequestException("Arquivo de log vazio.");
    }

    const content = file.buffer.toString("utf-8");
    const result = await this.parserService.parseAndPersist(content);

    return {
      message: `Log recebido. Linhas processadas: ${result.totalLines}.`,
      matchesProcessed: result.matchesProcessed,
    };
  }
}
