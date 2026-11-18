import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android shell for the Iranian stores (Café Bazaar, Myket).
 *
 * The app itself stays a Next.js web app; the phone app is a trustworthy WebView
 * shell that loads the live deployment, so content updates ship without a new
 * APK. `server.url` is used in debug and release for now; a bundled offline copy
 * can be added later by building a static export into `webDir`.
 */
const config: CapacitorConfig = {
  appId: "ir.mrfox2000.zabanyar",
  appName: "زبان‌یار",
  webDir: "public",
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    url: "https://zabanyar-kappa.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#fff8f0",
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
