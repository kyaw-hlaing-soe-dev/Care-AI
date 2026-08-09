export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="my">
  <head>
    <meta charset="utf-8" />
    <title>စာမျက်နှာ မဖွင့်နိုင်ပါ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.65 "Noto Sans Myanmar", system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; line-height: 1.3; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>စာမျက်နှာ မဖွင့်နိုင်ပါ</h1>
      <p>ကျွန်ုပ်တို့ဘက်တွင် အခက်အခဲတစ်ခု ဖြစ်နေပါသည်။ ပြန်ဖွင့်ကြည့်ပါ သို့မဟုတ် ပင်မစာမျက်နှာသို့ ပြန်သွားပါ။</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">ထပ်ကြိုးစားမည်</button>
        <a class="secondary" href="/">ပင်မသို့ ပြန်သွားမည်</a>
      </div>
    </div>
  </body>
</html>`;
}
