const localOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const extraOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowOrigin = (origin) => {
  if (!origin) return true;
  if (localOrigins.includes(origin)) return true;
  if (extraOrigins.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (allowOrigin(origin)) callback(null, true);
    else callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
};

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    expires: new Date(Date.now() + 8 * 3600000),
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };
};

module.exports = { corsOptions, getCookieOptions, allowOrigin };
