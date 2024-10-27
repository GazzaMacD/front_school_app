export const loader = () => {
  const robotText = `#Baiduspider
User-agent: Baiduspider
Disallow: /

#Yandex
User-agent: Yandex
Disallow: /

# Open AI
User-agent: GPTBot
Disallow: /
User-agent: ChatGPT-User
Disallow: /

# Google AI 
User-agent: Google-Extended
Disallow: /

# Common Crawl
User-agent: CCBot
Disallow: /

# Perplexity 
User-agent: PerplexityBot
Disallow: /

# Anthropic
User-agent: anthropic-ai
Disallow: /
‍User-agent: Claude-Web
Disallow: /
User-agent: ClaudeBot
Disallow: /

# Allow Rest
User-agent: *
Allow: /`;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
