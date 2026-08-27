export const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Music API</title>
  <link rel="icon" href="/assets/logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--bg:#0a0a0f;--glass:rgba(255,255,255,0.03);--glass-border:rgba(255,255,255,0.06);--glass-hover:rgba(255,255,255,0.06);--text:#f0f0f4;--muted:#8888aa;--dim:#555577;--accent:#6c5ce7;--accent2:#a855f7;--radius:16px;--shadow:0 8px 32px rgba(0,0,0,0.4)}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--dim);border-radius:2px}
    .bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(108,92,231,0.08),transparent)}
    .container{max-width:1400px;margin:0 auto;padding:20px 24px 120px}
    .header{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:var(--radius);margin-bottom:32px;flex-wrap:wrap;gap:12px}
    .logo-group{display:flex;align-items:center;gap:12px}
    .logo{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center}
    .logo svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:1.5}
    .brand{font-size:1.2rem;font-weight:700;letter-spacing:-0.5px}
    .brand span{color:var(--muted);font-weight:300}
    .header-actions{display:flex;align-items:center;gap:8px}
    .status{display:flex;align-items:center;gap:6px;font-size:0.7rem;color:var(--muted);padding:4px 12px;border:1px solid var(--glass-border);border-radius:20px;background:var(--glass)}
    .status .dot{width:5px;height:5px;border-radius:50%;background:#22c55e;display:inline-block;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    .nav{display:flex;gap:4px;background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:var(--radius);padding:4px;margin-bottom:32px;overflow-x:auto}
    .nav-btn{flex:1;padding:10px 18px;background:transparent;border:none;color:var(--muted);font-size:0.8rem;font-weight:500;cursor:pointer;border-radius:10px;transition:all .3s;font-family:inherit;white-space:nowrap}
    .nav-btn:hover{color:var(--text);background:var(--glass-hover)}
    .nav-btn.active{color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 4px 20px rgba(108,92,231,0.3)}
    .tab{display:none;animation:fadeIn .4s ease}
    .tab.active{display:block}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .glass-card{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:var(--radius);padding:24px;margin-bottom:20px;transition:all .3s}
    .glass-card:hover{border-color:rgba(255,255,255,0.1)}
    .search-row{display:flex;gap:12px;flex-wrap:wrap}
    .search-row .input{flex:1;min-width:200px;background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);padding:12px 16px;border-radius:10px;color:var(--text);font-size:0.9rem;font-family:inherit;transition:all .3s}
    .search-row .input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(108,92,231,0.15)}
    .search-row .input::placeholder{color:var(--dim)}
    .search-row .select{background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);padding:12px 16px;border-radius:10px;color:var(--text);font-size:0.85rem;font-family:inherit;cursor:pointer}
    .search-row .select:focus{outline:none;border-color:var(--accent)}
    .search-row .select option{background:var(--bg)}
    .btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:0.85rem;font-weight:600;font-family:inherit;cursor:pointer;transition:all .3s;box-shadow:0 4px 16px rgba(108,92,231,0.2)}
    .btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(108,92,231,0.35)}
    .btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
    .btn-outline{background:transparent;border:1px solid var(--glass-border);color:var(--text);box-shadow:none}
    .btn-outline:hover{background:var(--glass-hover);transform:none;box-shadow:none}
    .btn-sm{padding:6px 14px;font-size:0.75rem}
    .results-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-top:16px}
    .result-card{background:var(--glass);backdrop-filter:blur(10px);border:1px solid var(--glass-border);border-radius:12px;padding:12px;cursor:pointer;transition:all .3s;position:relative;overflow:hidden}
    .result-card:hover{transform:translateY(-4px);border-color:var(--accent);box-shadow:0 8px 30px rgba(0,0,0,0.3)}
    .result-card .thumb{width:100%;aspect-ratio:1;border-radius:8px;object-fit:cover;background:var(--dim)}
    .result-card .info{margin-top:10px}
    .result-card .title{font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .result-card .sub{font-size:0.7rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .result-card .badge{position:absolute;top:8px;right:8px;font-size:0.55rem;text-transform:uppercase;padding:2px 8px;border-radius:10px;background:rgba(108,92,231,0.2);color:var(--accent2);border:1px solid rgba(108,92,231,0.1)}
    .result-card .play-btn{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:all .3s;box-shadow:0 4px 16px rgba(108,92,231,0.3)}
    .result-card:hover .play-btn{opacity:1}
    .result-card .play-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}
    .details-panel{display:none;margin-top:20px}
    .details-panel.active{display:block}
    .details-header{display:flex;gap:24px;padding:20px;background:var(--glass);border-radius:var(--radius);border:1px solid var(--glass-border);margin-bottom:20px;flex-wrap:wrap}
    .details-header .art{width:160px;height:160px;border-radius:12px;object-fit:cover;background:var(--dim);flex-shrink:0}
    .details-header .meta{flex:1;min-width:200px}
    .details-header .meta h2{font-size:1.6rem;font-weight:700;margin-bottom:4px}
    .details-header .meta .sub{color:var(--muted);font-size:0.95rem}
    .details-header .meta .stats{display:flex;gap:16px;margin-top:8px;font-size:0.8rem;color:var(--dim)}
    .details-header .meta .actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .details-tracks{display:flex;flex-direction:column;gap:4px}
    .track-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;cursor:pointer;transition:all .2s;background:var(--glass)}
    .track-item:hover{background:var(--glass-hover)}
    .track-item .num{font-size:0.7rem;color:var(--dim);min-width:24px;font-family:monospace}
    .track-item .info{flex:1;min-width:0}
    .track-item .info .name{font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .track-item .info .artist{font-size:0.7rem;color:var(--muted)}
    .track-item .dur{font-size:0.7rem;color:var(--dim);font-family:monospace}
    .track-item .play-sm{width:28px;height:28px;border-radius:50%;background:transparent;border:1px solid var(--glass-border);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .track-item .play-sm:hover{background:var(--glass-hover);border-color:var(--accent)}
    .track-item .play-sm svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2}
    .lyrics-box{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:20px;margin-top:16px;max-height:300px;overflow-y:auto;font-family:monospace;font-size:0.85rem;line-height:1.8;color:var(--muted);white-space:pre-wrap}
    .lyrics-box .synced{color:var(--accent2)}
    .player{position:fixed;bottom:0;left:0;right:0;background:rgba(10,10,15,0.92);backdrop-filter:blur(30px);border-top:1px solid var(--glass-border);padding:16px 24px;z-index:100;display:none}
    .player.visible{display:block}
    .player-inner{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
    .player .thumb{width:48px;height:48px;border-radius:8px;object-fit:cover;background:var(--dim);flex-shrink:0}
    .player .info{flex:1;min-width:120px}
    .player .info .title{font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .player .info .artist{font-size:0.7rem;color:var(--muted)}
    .player .controls{display:flex;align-items:center;gap:6px;flex-shrink:0}
    .player .ctrl{width:36px;height:36px;border-radius:50%;background:transparent;border:1px solid var(--glass-border);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .player .ctrl:hover{background:var(--glass-hover);border-color:var(--accent)}
    .player .ctrl.play{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;width:44px;height:44px}
    .player .ctrl.play:hover{transform:scale(1.05)}
    .player .ctrl svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}
    .player .progress{flex:1;min-width:100px;display:flex;align-items:center;gap:10px}
    .player .progress .time{font-size:0.65rem;color:var(--dim);font-family:monospace;min-width:36px}
    .player .progress .bar{flex:1;height:3px;background:var(--glass-border);border-radius:2px;cursor:pointer;position:relative}
    .player .progress .bar .fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:2px;width:0%;transition:width 0.1s}
    .player .progress .bar:hover .fill{height:5px;margin-top:-1px}
    .glass-glow{position:relative}
    .glass-glow::before{content:'';position:absolute;inset:-1px;border-radius:var(--radius);padding:1px;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:0.5}
    .chip-group{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
    .chip{font-size:0.65rem;padding:4px 12px;border-radius:12px;background:var(--glass);border:1px solid var(--glass-border);color:var(--muted)}
    .chip.active{background:rgba(108,92,231,0.15);border-color:var(--accent);color:var(--accent2)}
    @media(max-width:768px){.container{padding:12px 12px 140px}.header{flex-direction:column;align-items:stretch}.results-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}.details-header{flex-direction:column;align-items:center;text-align:center}.details-header .art{width:120px;height:120px}.player-inner{flex-wrap:wrap;justify-content:center}.player .progress{order:10;flex-basis:100%}}
    .loading-state{display:none;padding:40px;text-align:center;color:var(--muted)}
    .loading-state .spinner{width:32px;height:32px;border:2px solid var(--glass-border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;margin-bottom:12px}
    @keyframes spin{to{transform:rotate(360deg)}}
    .empty-state{padding:60px 20px;text-align:center;color:var(--dim)}
    .empty-state svg{width:48px;height:48px;stroke:var(--dim);fill:none;stroke-width:1;margin-bottom:16px;opacity:0.3}
    .tester-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
    .tester-row .input{flex:1;min-width:120px;background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);padding:10px 14px;border-radius:8px;color:var(--text);font-size:0.85rem;font-family:inherit}
    .tester-row .input:focus{outline:none;border-color:var(--accent)}
    .tester-row .select{background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);padding:10px 14px;border-radius:8px;color:var(--text);font-size:0.85rem;font-family:inherit;cursor:pointer}
    .url-preview{font-family:monospace;font-size:0.75rem;color:var(--muted);padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:12px;border:1px solid var(--glass-border);word-break:break-all}
    .response-box{background:rgba(255,255,255,0.03);border:1px solid var(--glass-border);border-radius:8px;padding:16px;max-height:400px;overflow:auto;margin-top:12px}
    .response-box pre{font-family:monospace;font-size:0.7rem;color:var(--accent2);white-space:pre-wrap;word-break:break-all;margin:0}
    #ytplayer{position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1}
  </style>
</head>
<body>
<div class="bg"></div>

<div class="container">
  <header class="header">
    <div class="logo-group">
      <div class="logo"><svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
      <div class="brand">YouTube<span>API</span></div>
    </div>
    <div class="header-actions">
      <span class="status"><span class="dot"></span>Online</span>
    </div>
  </header>

  <nav class="nav">
    <button class="nav-btn active" data-tab="player-tab">Player</button>
    <button class="nav-btn" data-tab="docs">Docs</button>
    <button class="nav-btn" data-tab="tester">Tester</button>
  </nav>

  <div id="player-tab" class="tab active">
    <div class="glass-card">
      <div class="search-row">
        <select class="select" id="filter">
          <option value="">All</option>
          <option value="songs">Songs</option>
          <option value="albums">Albums</option>
          <option value="artists">Artists</option>
          <option value="playlists">Playlists</option>
        </select>
        <input type="text" class="input" id="query" placeholder="Search music, artists, albums...">
        <button class="btn" id="searchBtn">Search</button>
      </div>
    </div>

    <div class="loading-state" id="loading"><div class="spinner"></div><div>Searching...</div></div>
    <div class="results-grid" id="results"></div>

    <div class="details-panel" id="detailsPanel">
      <div class="details-header" id="detailsHeader"></div>
      <div class="details-tracks" id="detailsTracks"></div>
      <div class="lyrics-box" id="lyricsBox" style="display:none"></div>
    </div>
  </div>

  <div id="docs" class="tab">
    <div class="glass-card">
      <h3 style="margin-bottom:12px;font-weight:600">API Endpoints</h3>
      <p style="color:var(--muted);font-size:0.9rem;margin-bottom:16px">Base URL: <code style="background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:4px;color:var(--accent2)">/api</code></p>
      <div style="display:grid;grid-template-columns:1fr;gap:4px">
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/search?q=</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/search?q=coldplay"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/songs/:videoId</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/songs/dQw4w9WgXcQ"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/albums/:browseId</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/albums/MPREb_xxx"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/artists/:browseId</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/artists/UCxxx"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/playlists/:playlistId</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/playlists/PLxxx"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/lyrics?title=&artist=</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/lyrics?title=Yellow&artist=Coldplay"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/stream?id=</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/stream?id=dQw4w9WgXcQ"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/charts?country=</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/charts?country=US"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><span style="font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(108,92,231,0.15);color:var(--accent2);min-width:36px;text-align:center">GET</span><span style="font-family:monospace;font-size:0.8rem;flex:1">/related/:videoId</span><button class="copy-btn" style="background:transparent;border:none;color:var(--dim);cursor:pointer" data-url="/related/dQw4w9WgXcQ"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>
  </div>

  <div id="tester" class="tab">
    <div class="glass-card">
      <div class="tester-row">
        <select class="select" id="endpoint" onchange="updateInputs()">
          <option value="search">Search</option>
          <option value="song">Song Details</option>
          <option value="album">Album</option>
          <option value="artist">Artist</option>
          <option value="playlist">Playlist</option>
          <option value="lyrics">Lyrics</option>
          <option value="stream">Stream</option>
          <option value="charts">Charts</option>
          <option value="related">Related</option>
        </select>
      </div>
      <div class="tester-row" id="inputs"></div>
      <div class="url-preview" id="urlPreview">GET /api/search?q=coldplay</div>
      <button class="btn" onclick="testApi()">Test</button>
      <div class="response-box" id="response"><pre>Response will appear here...</pre></div>
    </div>
  </div>
</div>

<div class="player" id="playerBar">
  <div class="player-inner">
    <img class="thumb" id="pThumb" src="">
    <div class="info"><div class="title" id="pTitle">-</div><div class="artist" id="pArtist">-</div></div>
    <div class="progress"><span class="time" id="cur">0:00</span><div class="bar" id="bar" onclick="seek(event)"><div class="fill" id="fill"></div></div><span class="time" id="total">0:00</span></div>
    <div class="controls">
      <button class="ctrl" onclick="prev()"><svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="2" height="16"/></svg></button>
      <button class="ctrl play" id="playBtn" onclick="toggle()"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
      <button class="ctrl" onclick="next()"><svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><rect x="17" y="4" width="2" height="16"/></svg></button>
    </div>
  </div>
</div>

<div id="ytplayer"></div>

<script>
(function(){console.log=function(){};console.warn=function(){};console.error=function(){};window.onerror=function(){return true};window.onunhandledrejection=function(e){e.preventDefault();return true}})();

var tag=document.createElement('script');
tag.src='https://www.youtube.com/iframe_api';
var firstScriptTag=document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var yt=null, ready=false, playing=false, idx=-1, interval=null, songs=[], currentType=null;

function onYouTubeIframeAPIReady(){
  yt=new YT.Player('ytplayer',{
    height:'0',width:'0',host:'https://www.youtube-nocookie.com',
    playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,modestbranding:1,rel:0},
    events:{onReady:function(){ready=true},onStateChange:onState,onError:onErr}
  });
}

function onState(e){
  if(e.data===1){playing=true;document.getElementById('playBtn').innerHTML='<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';startProgress()}
  else if(e.data===2||e.data===0){playing=false;document.getElementById('playBtn').innerHTML='<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';stopProgress()}
  if(e.data===0)setTimeout(next,1000)
}
function onErr(e){if(e.data===150||e.data===101||e.data===100){var s=songs[idx];if(s&&s.fallbackVideoId&&!s.triedFallback){s.triedFallback=true;yt.loadVideoById(s.fallbackVideoId)}}}
function startProgress(){stopProgress();interval=setInterval(updateProgress,300)}
function stopProgress(){if(interval){clearInterval(interval);interval=null}}
function updateProgress(){if(!yt||!ready)return;var c=yt.getCurrentTime()||0,t=yt.getDuration()||0;document.getElementById('cur').textContent=fmt(c);document.getElementById('total').textContent=fmt(t);document.getElementById('fill').style.width=t>0?(c/t*100)+'%':'0%'}
function fmt(s){var m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+(sec<10?'0':'')+sec}
function seek(e){if(!yt||!ready)return;var bar=document.getElementById('bar'),rect=bar.getBoundingClientRect(),pct=(e.clientX-rect.left)/rect.width;if(pct<0)pct=0;if(pct>1)pct=1;yt.seekTo(pct*(yt.getDuration()||0),true)}

document.querySelectorAll('.nav-btn').forEach(b=>{
  b.addEventListener('click',function(){
    document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(this.dataset.tab).classList.add('active');
  })
});

document.getElementById('query').addEventListener('keypress',function(e){if(e.key==='Enter')search()});
document.getElementById('searchBtn').addEventListener('click',search);

document.querySelectorAll('.copy-btn').forEach(b=>{
  b.addEventListener('click',function(e){
    e.stopPropagation();
    var url=this.dataset.url;
    navigator.clipboard.writeText(window.location.origin+'/api'+url).then(function(){
      var orig=this.innerHTML;this.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" stroke="#22c55e" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';setTimeout(function(){this.innerHTML=orig}.bind(this),1500)
    }.bind(this))
  })
});

async function search(){
  var q=document.getElementById('query').value.trim();
  if(!q)return;
  var f=document.getElementById('filter').value;
  document.getElementById('searchBtn').disabled=true;
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  document.getElementById('detailsPanel').classList.remove('active');
  try{
    var url='/api/search?q='+encodeURIComponent(q)+(f?'&filter='+f:'');
    var res=await fetch(url);
    var data=await res.json();
    var results=data.results||[];
    renderResults(results);
  }catch(e){document.getElementById('results').innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Search failed</div></div>'}
  document.getElementById('searchBtn').disabled=false;
  document.getElementById('loading').style.display='none';
}

function renderResults(results){
  var el=document.getElementById('results');
  if(!results||!results.length){
    el.innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>No results</div></div>';
    return;
  }
  el.innerHTML=results.map(function(r,i){
    var type=r.resultType||r.type||'song';
    var title=r.title||r.name||'Unknown';
    var sub=r.artists?r.artists.map(function(a){return a.name}).join(', '):r.subtitle||'';
    var thumb=r.thumbnails?.[0]?.url||'';
    var vid=r.videoId||r.id;
    var bid=r.browseId||r.id;
    var isPlayable=vid&&(type==='song'||type==='video');
    var click=isPlayable?'onclick="playSong('+i+')"':'onclick="loadDetails('+i+')"';
    var badge=type!=='song'&&type!=='video'?'<span class="badge">'+type+'</span>':'';
    return'<div class="result-card" '+click+'><img class="thumb" src="'+thumb+'"><div class="info"><div class="title">'+esc(title)+badge+'</div><div class="sub">'+esc(sub)+'</div></div>'+
      (isPlayable?'<button class="play-btn" onclick="event.stopPropagation();playSong('+i+')"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>':'')+
      '</div>';
  }).join('');
  window._results=results;
}

function loadDetails(i){
  var r=window._results[i];
  if(!r)return;
  var vid=r.videoId||r.id;
  var bid=r.browseId||r.id;
  var type=r.resultType||r.type||'song';
  var panel=document.getElementById('detailsPanel');
  var header=document.getElementById('detailsHeader');
  var tracks=document.getElementById('detailsTracks');
  var lyrics=document.getElementById('lyricsBox');

  if(type==='song'&&vid){
    fetchDetails('/api/songs/'+vid);
  }else if((type==='album'||type==='album')&&bid){
    fetchDetails('/api/albums/'+bid);
  }else if(type==='artist'||type==='artist'||bid.startsWith('UC')){
    fetchDetails('/api/artists/'+bid);
  }else if(type==='playlist'||type==='playlist'){
    fetchDetails('/api/playlists/'+bid);
  }
}

async function fetchDetails(url){
  var panel=document.getElementById('detailsPanel');
  var header=document.getElementById('detailsHeader');
  var tracks=document.getElementById('detailsTracks');
  var lyrics=document.getElementById('lyricsBox');
  lyrics.style.display='none';
  panel.classList.remove('active');

  try{
    var res=await fetch(url);
    var data=await res.json();
    if(!data||!data.success)return;
    var d=data.data||data;

    var thumb=d.thumbnail||d.thumbnails?.[0]?.url||'';
    var title=d.title||d.name||'Unknown';
    var sub=d.artist||d.author||d.artists?.map(function(a){return a.name}).join(', ')||'';
    var stats='';
    if(d.trackCount)stats+='<span>Tracks: '+d.trackCount+'</span>';
    if(d.year)stats+='<span>Year: '+d.year+'</span>';
    if(d.duration)stats+='<span>'+fmt(d.duration)+'</span>';

    var actionHtml='';
    if(d.tracks&&d.tracks.length){
      actionHtml='<button class="btn btn-sm" onclick="playAllTracks()">Play All</button>';
    }

    header.innerHTML='<img class="art" src="'+thumb+'"><div class="meta"><h2>'+esc(title)+'</h2><div class="sub">'+esc(sub)+'</div><div class="stats">'+stats+'</div><div class="actions">'+actionHtml+'</div></div>';

    var trackList=d.tracks||d.tracks||[];
    if(trackList.length){
      tracks.innerHTML=trackList.map(function(t,i){
        var tid=t.videoId||t.id;
        var ttl=t.title||t.name||'Track '+(i+1);
        var art=t.artist||d.artist||sub;
        var dur=t.duration?fmt(parseInt(t.duration)):'';
        var click=tid?'onclick="playTrack(\''+tid+'\',\''+esc(ttl)+'\',\''+esc(art)+'\')"':'';
        return'<div class="track-item" '+click+'><span class="num">'+(i+1)+'</span><div class="info"><div class="name">'+esc(ttl)+'</div><div class="artist">'+esc(art)+'</div></div><span class="dur">'+dur+'</span>'+
          (tid?'<button class="play-sm" onclick="event.stopPropagation();playTrack(\''+tid+'\',\''+esc(ttl)+'\',\''+esc(art)+'\')"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>':'')+
          '</div>';
      }).join('');
    }else{
      tracks.innerHTML='<div style="padding:20px;text-align:center;color:var(--dim)">No tracks available</div>';
    }

    if(type==='song'&&title&&sub){
      fetchLyrics(title,sub);
    }

    panel.classList.add('active');

  }catch(e){}
}

async function fetchLyrics(title,artist){
  var lyrics=document.getElementById('lyricsBox');
  try{
    var res=await fetch('/api/lyrics?title='+encodeURIComponent(title)+'&artist='+encodeURIComponent(artist));
    var data=await res.json();
    if(data.success&&data.data&&data.data.plainLyrics){
      lyrics.textContent=data.data.plainLyrics;
      lyrics.style.display='block';
    }else{
      lyrics.style.display='none';
    }
  }catch{
    lyrics.style.display='none';
  }
}

function playSong(i){
  var r=window._results?.[i];
  if(!r)return;
  var vid=r.videoId||r.id;
  var ttl=r.title||r.name||'Unknown';
  var art=r.artists?r.artists.map(function(a){return a.name}).join(', '):r.subtitle||'';
  playTrack(vid,ttl,art);
}

function playTrack(vid,ttl,art){
  if(!vid||!ready)return;
  document.getElementById('pTitle').textContent=ttl;
  document.getElementById('pArtist').textContent=art||'';
  document.getElementById('pThumb').src='https://img.youtube.com/vi/'+vid+'/mqdefault.jpg';
  document.getElementById('playerBar').classList.add('visible');
  yt.loadVideoById(vid);
  yt.playVideo();
}

function toggle(){if(!ready)return;playing?yt.pauseVideo():yt.playVideo()}
function prev(){if(idx>0)playSong(idx-1)}
function next(){if(idx<songs.length-1)playSong(idx+1)}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}

var cfg={
  search:{inputs:[{n:'q',p:'Query',v:'coldplay'}],url:'/api/search'},
  song:{inputs:[{n:'videoId',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/songs/{videoId}'},
  album:{inputs:[{n:'browseId',p:'Album ID',v:'MPREb_PvMNqFUp1oW'}],url:'/api/albums/{browseId}'},
  artist:{inputs:[{n:'browseId',p:'Artist ID',v:'UCIaFw5VBEK8qaW6nRpx_qnw'}],url:'/api/artists/{browseId}'},
  playlist:{inputs:[{n:'playlistId',p:'Playlist ID',v:'PLRBp0Fe2GpgnRZpKULnyDQv9e_q41M6St'}],url:'/api/playlists/{playlistId}'},
  lyrics:{inputs:[{n:'title',p:'Title',v:'Yellow'},{n:'artist',p:'Artist',v:'Coldplay'}],url:'/api/lyrics'},
  stream:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/stream'},
  charts:{inputs:[{n:'country',p:'Country',v:'US'}],url:'/api/charts'},
  related:{inputs:[{n:'videoId',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/related/{videoId}'}
};

function updateInputs(){
  var ep=document.getElementById('endpoint').value,c=cfg[ep];
  document.getElementById('inputs').innerHTML=c.inputs.map(function(i){return'<input class="input" id="api_'+i.n+'" placeholder="'+i.p+'" value="'+i.v+'" oninput="updateUrl()">'}).join('');
  updateUrl();
}
function updateUrl(){
  var ep=document.getElementById('endpoint').value,c=cfg[ep],url=c.url,params=new URLSearchParams();
  c.inputs.forEach(function(i){var v=document.getElementById('api_'+i.n)?.value||i.v;if(v){if(url.includes('{'+i.n+'}'))url=url.replace('{'+i.n+'}',encodeURIComponent(v));else params.append(i.n,v)}});
  var qs=params.toString();if(qs)url+='?'+qs;
  document.getElementById('urlPreview').textContent='GET '+url;
}
async function testApi(){
  var ep=document.getElementById('endpoint').value,c=cfg[ep],url=c.url,params=new URLSearchParams();
  c.inputs.forEach(function(i){var v=document.getElementById('api_'+i.n)?.value||i.v;if(v){if(url.includes('{'+i.n+'}'))url=url.replace('{'+i.n+'}',encodeURIComponent(v));else params.append(i.n,v)}});
  var qs=params.toString();if(qs)url+='?'+qs;
  document.getElementById('response').innerHTML='<pre>Loading...</pre>';
  try{var res=await fetch(url);var data=await res.json();document.getElementById('response').innerHTML='<pre>'+JSON.stringify(data,null,2)+'</pre>'}catch(e){document.getElementById('response').innerHTML='<pre>Error: '+e.message+'</pre>'}
}
updateInputs();
</script>
</body>
</html>`;