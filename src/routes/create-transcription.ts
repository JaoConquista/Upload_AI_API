import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
// leitura de arquivos
import { createReadStream } from "node:fs";
import { z } from "zod";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post(`/videos/:videoId/transcription`, async (req) => {
    if (req.headers["content-type"] !== "application/json") {
      // If the Content-Type is not application/json, return a 415 error
      return "Unsupported Media Type: Expected application/json";
    }
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });
    const { videoId } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);

    const video = await prisma.video.findFirstOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;

    const audioReadStrem = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStrem,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0.3,
      prompt,
    });

    const transcription = response.text;

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    });
    return {
      transcription,
    };
  });
}
