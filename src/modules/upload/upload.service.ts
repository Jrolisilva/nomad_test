import { BadRequestException, Injectable } from "@nestjs/common";
import { ParserService } from "../parser/parser.service";
import type { UploadLogResponseDto } from "./dto/upload.dto";
import type Multer from "multer";

@Injectable()
export class UploadService {
  constructor(private readonly parserService: ParserService) {}

  processLog(file: Multer.File): UploadLogResponseDto {
    if (!file?.buffer?.length) {
      throw new BadRequestException("Arquivo de log vazio.");
    }

    const content = file.buffer.toString("utf-8");
    const result = this.parserService.parse(content);

    return {
      message: `Log recebido. Linhas processadas: ${result.totalLines}.`,
    };
  }
}
