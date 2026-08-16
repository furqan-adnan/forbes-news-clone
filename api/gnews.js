// api/gnews.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.GNEWS_API_KEY || process.env.REACT_APP_GNEWS_API_KEY;
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=business&lang=en&max=10&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`GNews returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Cache response on Vercel Edge for 10 minutes to stay well within rate limits
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}