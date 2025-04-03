export async function onRequest(context) {
  // List of video files
  const videos = [
    { name: 'video1', path: 'videos/1jPO5.mp4' },
    { name: 'video2', path: 'videos/2jPO5.mp4' },
    { name: 'video3', path: 'videos/3jPO5.mp4' },
    { name: 'video4', path: 'videos/4jPO5.mp4' },
    { name: 'video5', path: 'videos/5jPO5.mp4' }
  ];

  // Return JSON response with CORS headers
  return new Response(JSON.stringify(videos), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 