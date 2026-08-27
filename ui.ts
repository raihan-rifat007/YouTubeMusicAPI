export const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube API</title>
  <link rel="icon" href="/assets/logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--bg:#0a0a0a;--surface:#111;--surface2:#1a1a1a;--surface3:#222;--border:#2a2a2a;--text:#f0f0f0;--muted:#888;--dim:#555;--accent:#ffffff;--accent-dim:rgba(255,255,255,0.05);--radius:12px;--transition:0.2s ease}
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-track{background:var(--surface)}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
    ::-webkit-scrollbar-thumb:hover{background:var(--muted)}
    .bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(255,255,255,0.03),transparent)}
    .container{max-width:1100px;margin:0 auto;padding:40px 24px 200px}
    .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:60px;flex-wrap:wrap;gap:16px}
    .logo-group{display:flex;align-items:center;gap:16px}
    .logo{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--surface2);border:1px solid var(--border);overflow:hidden}
    .logo img{width:100%;height:100%;object-fit:cover}
    .brand{font-size:1.4rem;font-weight:700;letter-spacing:-0.5px}
    .brand span{color:var(--muted);font-weight:300}
    .status{display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--muted);padding:6px 14px;border:1px solid var(--border);border-radius:20px}
    .status .dot{width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block}
    .nav{display:flex;gap:4px;margin-bottom:48px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:4px;overflow-x:auto}
    .nav-btn{flex:1;padding:12px 20px;background:transparent;border:none;color:var(--muted);font-size:0.8rem;font-weight:500;cursor:pointer;border-radius:8px;transition:var(--transition);font-family:inherit;white-space:nowrap;min-width:80px}
    .nav-btn:hover{color:var(--text);background:var(--surface2)}
    .nav-btn.active{color:var(--text);background:var(--surface2)}
    .tab{display:none;animation:fadeIn 0.3s ease}
    .tab.active{display:block}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .section{margin-bottom:48px}
    .section-header{display:flex;align-items:center;gap:12px;margin-bottom:16px}
    .section-header .line{flex:1;height:1px;background:var(--border)}
    .section-title{font-size:0.65rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);font-weight:600}
    .endpoint-grid{display:grid;grid-template-columns:1fr;gap:4px}
    .endpoint-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:8px;transition:var(--transition);cursor:default}
    .endpoint-item:hover{border-color:var(--muted)}
    .method{font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:4px;background:var(--surface2);color:var(--text);min-width:40px;text-align:center;font-family:monospace}
    .path{font-family:'SF Mono',Monaco,monospace;font-size:0.8rem;flex:1;color:var(--text);word-break:break-all}
    .path .param{color:var(--muted)}
    .desc{font-size:0.7rem;color:var(--dim);text-align:right;display:none}
    .copy-btn{width:28px;height:28px;border:none;background:var(--surface2);border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--transition);flex-shrink:0}
    .copy-btn:hover{background:var(--border)}
    .copy-btn svg{width:14px;height:14px;stroke:var(--muted);fill:none;stroke-width:2}
    .copy-btn.copied svg{stroke:#22c55e}
    .search-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:32px}
    .search-row{display:flex;gap:12px;flex-wrap:wrap}
    .search-row .input{flex:1;min-width:200px;background:var(--surface2);border:1px solid var(--border);padding:12px 16px;border-radius:8px;color:var(--text);font-size:0.9rem;font-family:inherit;transition:var(--transition)}
    .search-row .input:focus{outline:none;border-color:var(--text)}
    .search-row .input::placeholder{color:var(--dim)}
    .search-row .select{background:var(--surface2);border:1px solid var(--border);padding:12px 16px;border-radius:8px;color:var(--text);font-size:0.85rem;font-family:inherit;cursor:pointer}
    .search-row .select:focus{outline:none;border-color:var(--text)}
    .search-row .select option{background:var(--bg)}
    .btn{background:var(--text);color:var(--bg);border:none;padding:12px 28px;border-radius:8px;font-size:0.85rem;font-weight:600;font-family:inherit;cursor:pointer;transition:var(--transition)}
    .btn:hover{opacity:0.8}
    .btn:disabled{opacity:0.3;cursor:not-allowed}
    .btn-outline{background:transparent;border:1px solid var(--border);color:var(--text)}
    .btn-outline:hover{background:var(--surface2)}
    .results{max-height:60vh;overflow-y:auto;margin-top:16px}
    .result-item{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:8px;cursor:pointer;transition:var(--transition);border:1px solid transparent}
    .result-item:hover{background:var(--surface2);border-color:var(--border)}
    .result-item.active{background:var(--accent-dim);border-color:var(--text)}
    .result-thumb{width:48px;height:48px;border-radius:6px;object-fit:cover;background:var(--surface2);flex-shrink:0}
    .result-info{flex:1;min-width:0}
    .result-title{font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .result-artist{font-size:0.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .result-dur{font-size:0.7rem;color:var(--dim);font-family:monospace;flex-shrink:0}
    .result-badge{font-size:0.55rem;text-transform:uppercase;color:var(--dim);padding:2px 8px;border:1px solid var(--border);border-radius:10px;margin-left:8px}
    .empty-state{padding:48px 24px;text-align:center;color:var(--dim)}
    .empty-state svg{width:48px;height:48px;stroke:var(--dim);fill:none;stroke-width:1;margin-bottom:16px}
    .loading-state{display:none;padding:48px 24px;text-align:center;color:var(--muted)}
    .loading-state .spinner{width:24px;height:24px;border:2px solid var(--border);border-top-color:var(--text);border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;margin-bottom:12px}
    @keyframes spin{to{transform:rotate(360deg)}}
    .tester-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
    .tester-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
    .tester-row .input{flex:1;min-width:150px;background:var(--surface2);border:1px solid var(--border);padding:10px 14px;border-radius:8px;color:var(--text);font-size:0.85rem;font-family:inherit}
    .tester-row .input:focus{outline:none;border-color:var(--text)}
    .tester-row .select{background:var(--surface2);border:1px solid var(--border);padding:10px 14px;border-radius:8px;color:var(--text);font-size:0.85rem;font-family:inherit;cursor:pointer}
    .tester-row .select:focus{outline:none;border-color:var(--text)}
    .url-preview{font-family:'SF Mono',Monaco,monospace;font-size:0.75rem;color:var(--muted);padding:12px 16px;background:var(--surface2);border-radius:8px;margin-bottom:16px;border:1px solid var(--border);word-break:break-all}
    .response-box{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:16px;max-height:400px;overflow:auto;margin-top:16px}
    .response-box pre{font-family:'SF Mono',Monaco,monospace;font-size:0.7rem;color:var(--accent);white-space:pre-wrap;word-break:break-all;margin:0}
    .player{position:fixed;bottom:0;left:0;right:0;background:rgba(10,10,10,0.95);backdrop-filter:blur(20px);border-top:1px solid var(--border);padding:16px 24px;display:none;z-index:100}
    .player.visible{display:block}
    .player-inner{max-width:1100px;margin:0 auto}
    .player-top{display:flex;align-items:center;gap:16px;margin-bottom:10px}
    .player-thumb{width:48px;height:48px;border-radius:6px;object-fit:cover;background:var(--surface2);flex-shrink:0}
    .player-info{flex:1;min-width:0}
    .player-title{font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .player-artist{font-size:0.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .player-controls{display:flex;align-items:center;gap:4px;flex-shrink:0}
    .ctrl{width:36px;height:36px;border-radius:50%;background:transparent;border:1px solid var(--border);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--transition)}
    .ctrl:hover{background:var(--surface2);border-color:var(--muted)}
    .ctrl.play{background:var(--text);border:none;color:var(--bg);width:42px;height:42px}
    .ctrl.play:hover{opacity:0.8}
    .ctrl svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}
    .ctrl.play svg{stroke:currentColor}
    .player-bottom{display:flex;align-items:center;gap:12px}
    .player-time{font-size:0.7rem;color:var(--muted);font-family:monospace;min-width:36px}
    .player-bar{flex:1;height:3px;background:var(--surface2);border-radius:2px;cursor:pointer;position:relative}
    .player-fill{height:100%;background:var(--text);border-radius:2px;width:0%;transition:width 0.1s linear}
    .player-bar:hover .player-fill{background:var(--accent)}
    #ytplayer{position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1}
    @media(min-width:768px){.desc{display:block}.endpoint-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:600px){.container{padding:24px 16px 180px}.header{flex-direction:column;align-items:flex-start}.search-row{flex-direction:column}.search-row .input{min-width:unset}.player-top{flex-wrap:wrap}.player-controls{margin-left:auto}}
  </style>
</head>
<body>
<div class="bg"></div>

<div class="container">
  <div class="header">
    <div class="logo-group">
      <div class="logo">
        <img src="/assets/logo.png" alt="Logo">
      </div>
      <div class="brand">YouTube<span>API</span></div>
    </div>
    <div class="status"><span class="dot"></span>Online</div>
  </div>

  <div class="nav">
    <button class="nav-btn active" data-tab="docs">Documentation</button>
    <button class="nav-btn" data-tab="player">Player</button>
    <button class="nav-btn" data-tab="tester">Tester</button>
  </div>

  <div id="docs" class="tab active">
    <div class="section">
      <div class="section-header"><span class="section-title">Search</span><span class="line"></span></div>
      <div class="endpoint-grid">
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/search</span><span class="desc">Search songs, albums, artists</span><button class="copy-btn" data-url="/api/search"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/search/suggestions</span><span class="desc">Autocomplete suggestions</span><button class="copy-btn" data-url="/api/search/suggestions"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/yt_search</span><span class="desc">YouTube video search</span><button class="copy-btn" data-url="/api/yt_search"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><span class="section-title">Content</span><span class="line"></span></div>
      <div class="endpoint-grid">
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/songs/<span class="param">:videoId</span></span><span class="desc">Song + artist/album links</span><button class="copy-btn" data-url="/api/songs/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/albums/<span class="param">:browseId</span></span><span class="desc">Album + tracks + artist</span><button class="copy-btn" data-url="/api/albums/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/artists/<span class="param">:browseId</span></span><span class="desc">Artist + discography</span><button class="copy-btn" data-url="/api/artists/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/playlists/<span class="param">:playlistId</span></span><span class="desc">Playlist tracks</span><button class="copy-btn" data-url="/api/playlists/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/chain/<span class="param">:videoId</span></span><span class="desc">Song -> Artist -> Albums</span><button class="copy-btn" data-url="/api/chain/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><span class="section-title">Discovery</span><span class="line"></span></div>
      <div class="endpoint-grid">
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/related/<span class="param">:videoId</span></span><span class="desc">Related songs</span><button class="copy-btn" data-url="/api/related/"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/radio</span><span class="desc">Generate radio mix</span><button class="copy-btn" data-url="/api/radio"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/similar</span><span class="desc">Similar tracks</span><button class="copy-btn" data-url="/api/similar"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/charts</span><span class="desc">Music charts</span><button class="copy-btn" data-url="/api/charts"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/trending</span><span class="desc">Trending music</span><button class="copy-btn" data-url="/api/trending"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/moods</span><span class="desc">Mood categories</span><button class="copy-btn" data-url="/api/moods"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><span class="section-title">Streaming & Lyrics</span><span class="line"></span></div>
      <div class="endpoint-grid">
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/stream</span><span class="desc">Audio stream URLs</span><button class="copy-btn" data-url="/api/stream"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/proxy</span><span class="desc">Audio proxy (CORS)</span><button class="copy-btn" data-url="/api/proxy"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/lyrics</span><span class="desc">Synced lyrics (LRC)</span><button class="copy-btn" data-url="/api/lyrics"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header"><span class="section-title">Info</span><span class="line"></span></div>
      <div class="endpoint-grid">
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/artist/info</span><span class="desc">Artist bio (Last.fm)</span><button class="copy-btn" data-url="/api/artist/info"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/track/info</span><span class="desc">Track info (Last.fm)</span><button class="copy-btn" data-url="/api/track/info"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/top/artists</span><span class="desc">Top artists</span><button class="copy-btn" data-url="/api/top/artists"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
        <div class="endpoint-item"><span class="method">GET</span><span class="path">/api/top/tracks</span><span class="desc">Top tracks</span><button class="copy-btn" data-url="/api/top/tracks"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>
      </div>
    </div>
  </div>

  <div id="player" class="tab">
    <div class="search-section">
      <div class="search-row">
        <select class="select" id="filter">
          <option value="">All</option>
          <option value="songs">Songs</option>
          <option value="albums">Albums</option>
          <option value="artists">Artists</option>
        </select>
        <input type="text" class="input" id="query" placeholder="Search music...">
        <button class="btn" id="searchBtn">Search</button>
      </div>
    </div>
    <div class="loading-state" id="loading"><div class="spinner"></div><div>Searching...</div></div>
    <div class="results" id="results"><div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Search for music to play</div></div></div>
  </div>

  <div id="tester" class="tab">
    <div class="tester-section">
      <div class="tester-row">
        <select class="select" id="endpoint" onchange="updateInputs()">
          <option value="search">Search</option>
          <option value="stream">Stream</option>
          <option value="song">Song Details</option>
          <option value="album">Album</option>
          <option value="artist">Artist</option>
          <option value="playlist">Playlist</option>
          <option value="chain">Full Chain</option>
          <option value="related">Related</option>
          <option value="radio">Radio</option>
          <option value="lyrics">Lyrics</option>
          <option value="charts">Charts</option>
        </select>
      </div>
      <div class="tester-row" id="inputs"></div>
      <div class="url-preview" id="urlPreview">GET /api/search</div>
      <button class="btn" onclick="testApi()">Test</button>
      <div class="response-box" id="response"><pre>Response will appear here...</pre></div>
    </div>
  </div>
</div>

<div id="ytplayer"></div>

<div class="player" id="playerBar">
  <div class="player-inner">
    <div class="player-top">
      <img class="player-thumb" id="pThumb" src="">
      <div class="player-info">
        <div class="player-title" id="pTitle">-</div>
        <div class="player-artist" id="pArtist">-</div>
      </div>
      <div class="player-controls">
        <button class="ctrl" onclick="prev()"><svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="2" height="16"/></svg></button>
        <button class="ctrl play" id="playBtn" onclick="toggle()"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
        <button class="ctrl" onclick="next()"><svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><rect x="17" y="4" width="2" height="16"/></svg></button>
      </div>
    </div>
    <div class="player-bottom">
      <span class="player-time" id="cur">0:00</span>
      <div class="player-bar" id="bar" onclick="seek(event)"><div class="player-fill" id="fill"></div></div>
      <span class="player-time" id="total">0:00</span>
    </div>
  </div>
</div>

<script>
(function(){console.log=function(){};console.warn=function(){};console.error=function(){};console.info=function(){};window.onerror=function(){return true};window.onunhandledrejection=function(e){e.preventDefault();return true}})();

var tag=document.createElement('script');
tag.src='https://www.youtube.com/iframe_api';
var firstScriptTag=document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var songs=[], yt=null, ready=false, playing=false, idx=-1, interval=null;

function onYouTubeIframeAPIReady(){
  yt=new YT.Player('ytplayer',{
    height:'0',
    width:'0',
    host:'https://www.youtube-nocookie.com',
    playerVars:{
      autoplay:0,
      controls:0,
      disablekb:1,
      fs:0,
      modestbranding:1,
      rel:0
    },
    events:{
      onReady:function(){ready=true;console.log('YT Ready')},
      onStateChange:onState,
      onError:onErr
    }
  });
}

function onState(e){
  if(e.data===1){
    playing=true;
    document.getElementById('playBtn').innerHTML='<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    startProgress();
  } else if(e.data===2||e.data===0){
    playing=false;
    document.getElementById('playBtn').innerHTML='<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    stopProgress();
  }
  if(e.data===0) setTimeout(next, 1000);
}

function onErr(e){
  console.log('YT Error:', e.data);
  if(e.data===150||e.data===101||e.data===100){
    var s=songs[idx];
    if(s&&s.fallbackVideoId&&!s.triedFallback){
      s.triedFallback=true;
      yt.loadVideoById(s.fallbackVideoId);
    }
  }
}

function startProgress(){stopProgress();interval=setInterval(updateProgress,300)}
function stopProgress(){if(interval){clearInterval(interval);interval=null}}
function updateProgress(){
  if(!yt||!ready)return;
  var c=yt.getCurrentTime()||0,t=yt.getDuration()||0;
  document.getElementById('cur').textContent=fmt(c);
  document.getElementById('total').textContent=fmt(t);
  document.getElementById('fill').style.width=t>0?(c/t*100)+'%':'0%'
}
function fmt(s){var m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+(sec<10?'0':'')+sec}
function seek(e){
  if(!yt||!ready)return;
  var bar=document.getElementById('bar'),rect=bar.getBoundingClientRect(),pct=(e.clientX-rect.left)/rect.width;
  if(pct<0)pct=0;if(pct>1)pct=1;
  yt.seekTo(pct*(yt.getDuration()||0),true);
}

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
    navigator.clipboard.writeText(window.location.origin+url).then(()=>{
      this.classList.add('copied');
      setTimeout(()=>this.classList.remove('copied'),2000);
    })
  })
});

async function search(){
  var q=document.getElementById('query').value.trim();
  if(!q)return;
  var f=document.getElementById('filter').value;
  document.getElementById('searchBtn').disabled=true;
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  try{
    var url='/api/search?q='+encodeURIComponent(q);
    if(f)url+='&filter='+f;
    var res=await fetch(url);
    var data=await res.json();
    songs=data.results||[];
    render();
  }catch(e){songs=[];render()}
  document.getElementById('searchBtn').disabled=false;
  document.getElementById('loading').style.display='none';
}

function render(){
  var el=document.getElementById('results');
  if(!songs.length){
    el.innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>No results</div></div>';
    return;
  }
  el.innerHTML=songs.map(function(s,i){
    var bid=s.browseId||'';
    var type=s.resultType||'song';
    var isPlaylist=bid.startsWith('VL')||type==='playlist';
    var isAlbum=bid.startsWith('MPRE')&&!isPlaylist;
    var isArtist=bid.startsWith('UC')||type==='artist';
    var thumb=s.thumbnails?.[0]?.url||(s.videoId?'https://img.youtube.com/vi/'+s.videoId+'/mqdefault.jpg':'');
    var click='';
    if(s.videoId&&(type==='song'||type==='video')){
      click='play('+i+')';
    }else if(isPlaylist&&bid){
      click="viewPlaylist('"+bid+"','"+thumb+"','"+encodeURIComponent(s.title||'')+"')";
    }else if(isAlbum&&bid){
      click="viewAlbum('"+bid+"','"+thumb+"','"+encodeURIComponent(s.title||'')+"')";
    }else if((isArtist||bid)&&!isPlaylist&&!isAlbum){
      click="viewArtist('"+bid+"','"+thumb+"','"+encodeURIComponent(s.title||'')+"')";
    }
    var badge=(type!=='song'&&type!=='video'&&type!=='playlist')?'<span class="result-badge">'+type+'</span>':'';
    return'<div class="result-item'+(i===idx?' active':'')+'" onclick="'+click+'"><img class="result-thumb" src="'+thumb+'"><div class="result-info"><div class="result-title">'+esc(s.title||s.name||'Unknown')+badge+'</div><div class="result-artist">'+esc(s.artists?.map(function(a){return a.name}).join(', ')||s.subtitle||'')+'</div></div><div class="result-dur">'+(s.duration||'')+'</div></div>';
  }).join('');
}

function play(i){
  if(!songs[i]||!ready)return;
  idx=i;
  var s=songs[i];
  document.getElementById('pTitle').textContent=s.title||'Unknown';
  document.getElementById('pArtist').textContent=s.artists?.map(function(a){return a.name}).join(', ')||'';
  document.getElementById('pThumb').src=s.thumbnails?.[0]?.url||'https://img.youtube.com/vi/'+s.videoId+'/mqdefault.jpg';
  document.getElementById('playerBar').classList.add('visible');
  document.querySelectorAll('.result-item').forEach(function(el,x){el.className=x===i?'result-item active':'result-item'});
  yt.loadVideoById(s.videoId);
  yt.playVideo();
}
function toggle(){
  if(!ready)return;
  playing?yt.pauseVideo():yt.playVideo();
}
function prev(){if(idx>0)play(idx-1)}
function next(){if(idx<songs.length-1)play(idx+1)}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}

async function viewArtist(id,thumbEnc,nameEnc){
  var searchThumb=decodeURIComponent(thumbEnc||''),searchName=decodeURIComponent(nameEnc||'');
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  try{
    var res=await fetch('/api/artists/'+encodeURIComponent(id));
    var data=await res.json();
    var artist=data.artist||data;
    var tracks=[];
    if(data.topSongs)tracks.push.apply(tracks,data.topSongs.map(function(s){return{...s,resultType:'song',videoId:s.videoId,thumbnails:[{url:s.thumbnail}]}}));
    if(data.songs?.results)tracks.push.apply(tracks,data.songs.results.map(function(s){return{...s,resultType:'song'}}));
    if(data.albums)data.albums.forEach(function(a){tracks.push({...a,resultType:'album',browseId:a.browseId,thumbnails:[{url:a.thumbnail}]})});
    if(data.singles)data.singles.forEach(function(a){tracks.push({...a,resultType:'album',browseId:a.browseId,thumbnails:[{url:a.thumbnail}]})});
    songs=tracks;
    var thumb=searchThumb||artist.thumbnail||artist.thumbnails?.[0]?.url||'';
    var name=searchName||artist.name||'Artist';
    var bio='';
    try{
      var bioRes=await fetch('/api/artist/info?artist='+encodeURIComponent(name));
      var bioData=await bioRes.json();
      if(bioData.bio)bio=bioData.bio.replace(/<[^>]*>/g,'').split('Read more')[0].trim();
    }catch(e){}
    var descHtml=bio?'<div style="color:var(--dim);font-size:0.75rem;margin-top:6px;max-width:500px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+esc(bio)+'</div>':'';
    var header='<div style="display:flex;align-items:flex-start;gap:16px;padding:16px;margin-bottom:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)"><img src="'+thumb+'" style="width:64px;height:64px;border-radius:50%;object-fit:cover;background:var(--surface2)"><div style="flex:1"><div style="font-size:1.1rem;font-weight:600">'+esc(name)+'</div><div style="color:var(--muted);font-size:0.8rem">'+(artist.subscribers||'')+'</div>'+descHtml+'<button class="btn" style="margin-top:8px;padding:6px 16px;font-size:0.75rem" onclick="goBack()">Back</button></div></div>';
    document.getElementById('results').innerHTML=header;
    render();
  }catch(e){document.getElementById('results').innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Failed to load artist</div></div>'}
  document.getElementById('loading').style.display='none';
}

async function viewAlbum(id,thumbEnc,nameEnc){
  var searchThumb=decodeURIComponent(thumbEnc||''),searchName=decodeURIComponent(nameEnc||'');
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  try{
    var res=await fetch('/api/albums/'+encodeURIComponent(id));
    var data=await res.json();
    var album=data.album||data;
    var albumThumb=searchThumb||album.thumbnail||album.thumbnails?.[0]?.url||'';
    var albumName=searchName||album.title||'Album';
    songs=(data.tracks||[]).map(function(t){return{...t,resultType:'song',thumbnails:[{url:albumThumb}]}});
    var artistName=data.artist?.name||album.artists?.map(function(a){return a.name}).join(', ')||'';
    var header='<div style="display:flex;align-items:center;gap:16px;padding:16px;margin-bottom:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)"><img src="'+albumThumb+'" style="width:64px;height:64px;border-radius:6px;object-fit:cover;background:var(--surface2)"><div><div style="font-size:1.1rem;font-weight:600">'+esc(albumName)+'</div><div style="color:var(--muted);font-size:0.8rem">'+esc(artistName)+'</div><div style="color:var(--dim);font-size:0.7rem">'+(album.year||'')+' - '+(album.trackCount||songs.length)+' tracks</div><button class="btn" style="margin-top:6px;padding:6px 16px;font-size:0.75rem" onclick="goBack()">Back</button></div></div>';
    document.getElementById('results').innerHTML=header;
    render();
  }catch(e){document.getElementById('results').innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Failed to load album</div></div>'}
  document.getElementById('loading').style.display='none';
}

async function viewPlaylist(id,thumbEnc,nameEnc){
  var searchThumb=decodeURIComponent(thumbEnc||''),searchName=decodeURIComponent(nameEnc||'');
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  try{
    var playlistId=id.startsWith('VL')?id.substring(2):id;
    var res=await fetch('/api/playlists/'+encodeURIComponent(playlistId));
    var data=await res.json();
    var playlistThumb=searchThumb||data.thumbnail||data.thumbnails?.[0]?.url||'';
    var playlistName=searchName||data.title||'Playlist';
    var desc=data.description||'';
    var descHtml=desc?'<div style="color:var(--dim);font-size:0.75rem;margin-top:4px;max-width:500px;line-height:1.4">'+esc(desc)+'</div>':'';
    songs=(data.tracks||[]).map(function(t){return{...t,resultType:'song'}});
    var header='<div style="display:flex;align-items:flex-start;gap:16px;padding:16px;margin-bottom:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)"><img src="'+playlistThumb+'" style="width:64px;height:64px;border-radius:6px;object-fit:cover;background:var(--surface2)"><div style="flex:1"><div style="font-size:1.1rem;font-weight:600">'+esc(playlistName)+'</div><div style="color:var(--muted);font-size:0.8rem">'+esc(data.author||'')+'</div><div style="color:var(--dim);font-size:0.7rem">'+(data.trackCount||songs.length)+' tracks</div>'+descHtml+'<button class="btn" style="margin-top:6px;padding:6px 16px;font-size:0.75rem" onclick="goBack()">Back</button></div></div>';
    document.getElementById('results').innerHTML=header;
    render();
  }catch(e){document.getElementById('results').innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Failed to load playlist</div></div>'}
  document.getElementById('loading').style.display='none';
}

function goBack(){
  var q=document.getElementById('query').value.trim();
  if(q)search();
  else{songs=[];document.getElementById('results').innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>Search for music</div></div>'}
}

var cfg={
  search:{inputs:[{n:'q',p:'Query',v:'coldplay'}],url:'/api/search'},
  stream:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/stream'},
  song:{inputs:[{n:'videoId',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/songs/{videoId}'},
  album:{inputs:[{n:'browseId',p:'Album ID',v:'MPREb_PvMNqFUp1oW'}],url:'/api/albums/{browseId}'},
  artist:{inputs:[{n:'browseId',p:'Artist ID',v:'UCIaFw5VBEK8qaW6nRpx_qnw'}],url:'/api/artists/{browseId}'},
  playlist:{inputs:[{n:'playlistId',p:'Playlist ID',v:'RDCLAK5uy_k'}],url:'/api/playlists/{playlistId}'},
  chain:{inputs:[{n:'videoId',p:'Video ID',v:'9qnqYL0eNNI'}],url:'/api/chain/{videoId}'},
  related:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/related/{id}'},
  radio:{inputs:[{n:'videoId',p:'Video ID',v:'9qnqYL0eNNI'}],url:'/api/radio'},
  lyrics:{inputs:[{n:'title',p:'Title',v:'Yellow'},{n:'artist',p:'Artist',v:'Coldplay'}],url:'/api/lyrics'},
  charts:{inputs:[{n:'country',p:'Country',v:'US'}],url:'/api/charts'}
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
