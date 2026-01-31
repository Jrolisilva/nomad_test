import { Controller, Get } from '@nestjs/common';
import { PlayersService } from './players.service';
import type { GlobalRankingResponseDto } from './dto/global-ranking.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('ranking')
  getGlobalRanking(): Promise<GlobalRankingResponseDto> {
    return this.playersService.getGlobalRanking();
  }
}
