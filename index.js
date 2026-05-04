import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Glomart API running");
});

app.get("/coupang", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL 필요" });

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const images = [];

    $("img").each((_, el) => {
      const src = $(el).attr("src")  $(el).attr("data-src")  "";
      if (src.includes("coupangcdn.com")) images.push(src.startsWith("//") ? "https:" + src : src);
    });

    res.json({
      ok: true,
      count: images.length,
      images: [...new Set(images)].slice(0, 30),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(Glomart API running on ${PORT});
});
