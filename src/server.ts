import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors'
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoPost } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { getAllVideosRoute } from './routes/get-all-videos';
import { generateAiCompletionRoute } from './routes/generate-ai-completion';

const app = fastify();

app.register(fastifyCors, {
    origin: "*",
})

app.register(getAllPromptsRoute);
app.register(uploadVideoPost);
app.register(createTranscriptionRoute)
app.register(getAllVideosRoute)
app.register(generateAiCompletionRoute)

app.listen({
    port:3333
}).then(() => {
    console.log("Server is running!")
})