export const loader = () => {
  const robotText = `#Baiduspider
User-agent: Baiduspider
Disallow: /

#Yandex
User-agent: Yandex
Disallow: /

#Rest
User-agent: *
Allow: /`;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
