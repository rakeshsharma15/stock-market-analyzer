// src/prompt/prompt.module.ts
import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';

@Module({
  providers: [PromptService],
  exports: [PromptService], // ✅ allows other modules (like AppModule) to use it
})
export class PromptModule {}
