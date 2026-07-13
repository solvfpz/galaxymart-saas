import mongoose from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined.");
  console.error("   NODE_ENV:", process.env.NODE_ENV);
  console.error(
    "   → Set MONGODB_URI in Vercel Dashboard → Project → Settings → Environment Variables"
  );
  console.error("   → Redeploy after adding the variable");
}

const cached =
  globalThis.mongooseCache || (globalThis.mongooseCache = { conn: null, promise: null });

function redactUri(uri: string): string {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
}

function checkPasswordSpecialChars(uri: string): string[] {
  const warnings: string[] = [];
  const match = uri.match(/\/\/([^:]+):([^@]+)@/);
  if (match) {
    const password = match[2];
    const specialChars = [
      { char: "@", encoded: "%40" },
      { char: ":", encoded: "%3A" },
      { char: "/", encoded: "%2F" },
      { char: "?", encoded: "%3F" },
      { char: "#", encoded: "%23" },
      { char: " ", encoded: "%20" },
    ];
    for (const { char, encoded } of specialChars) {
      if (password.includes(char)) {
        warnings.push(
          `   ⚠️  Password contains unencoded '${char}' — replace with '${encoded}'`
        );
      }
    }
  }
  return warnings;
}

export function getMongoDiagnostics(error: unknown): string {
  const err = error as any;
  const code = err?.code;
  const codeName = err?.codeName;
  const message = err?.message ?? String(error);
  const lines: string[] = [];

  lines.push("--- MongoDB Connection Diagnostic ---");
  lines.push(`Error Code: ${code ?? "N/A"}`);
  lines.push(`Error CodeName: ${codeName ?? "N/A"}`);
  lines.push(`Error Message: ${message}`);

  if (!MONGODB_URI) {
    lines.push("");
    lines.push("🔴 CAUSE: MONGODB_URI is not set in environment variables.");
    lines.push(
      "   → Go to Vercel Dashboard → Project → Settings → Environment Variables"
    );
    lines.push("   → Add MONGODB_URI with your MongoDB Atlas connection string");
    lines.push("   → Redeploy after adding the variable");
    return lines.join("\n");
  }

  try {
    const urlWarnings = checkPasswordSpecialChars(MONGODB_URI);
    if (urlWarnings.length > 0) {
      lines.push("");
      lines.push("⚠️  PASSWORD SPECIAL CHARACTERS:");
      urlWarnings.forEach((w) => lines.push(w));
    }
  } catch {}

  if (code === 18 || codeName === "AuthenticationFailed" || message.includes("Authentication failed")) {
    lines.push("");
    lines.push("🔴 CAUSE: Authentication failed — wrong username or password.");
    lines.push("   → Verify the database user credentials in your MONGODB_URI");
    lines.push("   → Check MongoDB Atlas → Database Access for the user");
    lines.push("   → If you changed the password, update MONGODB_URI and redeploy");
    lines.push("");
    lines.push("📌 URL ENCODING CHECKLIST:");
    lines.push("   @ → %40     : → %3A     / → %2F");
    lines.push("   ? → %3F     # → %23     space → %20");
    return lines.join("\n");
  }

  if (
    message.includes("getaddrinfo") ||
    message.includes("ENOTFOUND") ||
    message.includes("EAI_AGAIN") ||
    message.includes("SRV")
  ) {
    lines.push("");
    lines.push("🔴 CAUSE: DNS resolution failed — cannot reach MongoDB Atlas.");
    lines.push("   → Verify your cluster is running (Atlas → Clusters)");
    lines.push("   → If using mongodb+srv://, DNS may be slow or blocked on Vercel");
    lines.push("   → Try using mongodb:// with direct replica set entries");
    lines.push("   → Ensure your Vercel project can resolve external DNS");
    return lines.join("\n");
  }

  if (
    message.includes("timed out") ||
    message.includes("timeout") ||
    code === "ETIMEDOUT"
  ) {
    lines.push("");
    lines.push("🔴 CAUSE: Connection timed out.");
    lines.push("   → Verify Atlas IP whitelist includes 0.0.0.0/0");
    lines.push("   → Vercel functions use dynamic IPs — 0.0.0.0/0 is required");
    lines.push("   → Check if your Atlas cluster is paused or in recovery");
    lines.push("   → Some Vercel regions may be blocked; try us-east-1");
    return lines.join("\n");
  }

  if (message.includes("Could not connect to any servers")) {
    lines.push("");
    lines.push("🔴 CAUSE: No reachable MongoDB server in the replica set.");
    lines.push("   → Confirm your cluster shows ACTIVE in MongoDB Atlas");
    lines.push("   → Verify IP whitelist includes 0.0.0.0/0");
    lines.push("   → If your cluster was paused, resume it in Atlas");
    lines.push("   → M0 free tier clusters may idle after no activity");
    return lines.join("\n");
  }

  if (message.includes("Server selection") || message.includes("server selection")) {
    lines.push("");
    lines.push("🔴 CAUSE: Mongoose server selection timed out.");
    lines.push("   → MongoDB is unreachable from the Vercel runtime");
    lines.push("   → Check network path and Atlas IP whitelist");
    return lines.join("\n");
  }

  if (
    message.includes("MONGODB_URI") ||
    message.includes("mongoose")
  ) {
    lines.push("");
    lines.push(
      "🔴 CAUSE: Configuration error related to MONGODB_URI format."
    );
    lines.push("   → Expected format:");
    lines.push(
      "     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>"
    );
    return lines.join("\n");
  }

  lines.push("");
  lines.push(
    "🔴 UNKNOWN ERROR — does not match common failure patterns."
  );
  lines.push(
    "   → Review the full error details above"
  );
  lines.push(
    "   → Verify your MONGODB_URI format is correct"
  );
  return lines.join("\n");
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.error(getMongoDiagnostics(new Error("MONGODB_URI is missing")));
    console.error("--- Environment Check ---");
    console.error("  NODE_ENV:", process.env.NODE_ENV);
    console.error("  MONGODB_URI length:", process.env.MONGODB_URI?.length ?? 0);
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  if (!cached.promise) {
    console.log(`🔌 Connecting: ${redactUri(MONGODB_URI)}`);

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: "majority",
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB connected");
        console.log(`   DB: ${m.connection.db?.databaseName ?? "unknown"}`);
        console.log(`   Host: ${m.connection.host}`);
        return m;
      });

    cached.promise = cached.promise.catch((err) => {
      console.error("❌ MongoDB connection failed");
      console.error(getMongoDiagnostics(err));
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export const connectDB = dbConnect;
export default dbConnect;
