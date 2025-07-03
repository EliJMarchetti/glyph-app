/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},      // ← NEW name
    autoprefixer: {},
  },
};
