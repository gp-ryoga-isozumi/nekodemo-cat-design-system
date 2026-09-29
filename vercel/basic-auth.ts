import { next } from "@vercel/functions";

// Vercel 配信のデモサイトにかける Basic 認証（Vercel Routing Middleware。vercel.json の proxy.entrypoint から使う）。
// パスワードは Vercel の環境変数 BASIC_AUTH_PASSWORD に置く（リポジトリが公開なのでコードに書かない）。
// ユーザー名は問わない。環境変数が無いときは全リクエストを拒否する。
export default function basicAuth(request: Request): Response {
  const password = process.env.BASIC_AUTH_PASSWORD;
  if (!password) {
    return new Response("BASIC_AUTH_PASSWORD is not set", { status: 500 });
  }

  const match = /^Basic\s+(.+)$/i.exec(request.headers.get("authorization") ?? "");
  if (match) {
    const decoded = Buffer.from(match[1], "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    if (colon >= 0 && decoded.slice(colon + 1) === password) {
      return next();
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="nekodemo", charset="UTF-8"' },
  });
}
