import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  req.body = body ? JSON.parse(body) : {}
                  res.status = (code) => {
                    res.statusCode = code
                    return res
                  }
                  res.json = (data) => {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(data))
                    return res
                  }
                  await chatHandler(req, res)
                } catch (err) {
                  console.error('Local dev chat handler error:', err)
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: 'Internal Server Error' }))
                }
              })
              return
            }
            next()
          })
        },
      },
    ],
  }
})
