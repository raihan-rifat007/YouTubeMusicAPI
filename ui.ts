export const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YTMusic API</title>
<link rel="icon" href="/assets/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg:#000;--sidebar-bg:#0a0a0a;--surface:#111;--surface2:#181818;--surface3:#242424;--border:#2a2a2a;
--text:#fff;--muted:#b3b3b3;--dim:#535353;--accent:#1db954;--accent-hover:#1ed760;--accent-dim:rgba(29,185,84,0.12);
--player-bg:#121212;--radius:8px;--t:0.2s ease;
}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);height:100vh;overflow:hidden;display:flex;flex-direction:column}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--dim);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--muted)}

.layout{display:flex;flex:1;overflow:hidden;gap:2px}

.sidebar{width:280px;min-width:280px;background:var(--sidebar-bg);display:flex;flex-direction:column;padding:8px;gap:2px;overflow:hidden}
.sidebar-logo{display:flex;align-items:center;gap:12px;padding:16px 12px 20px;cursor:pointer}
.sidebar-logo img{width:32px;height:32px;border-radius:6px}
.sidebar-logo span{font-size:1rem;font-weight:700;letter-spacing:-0.3px}
.sidebar-logo small{color:var(--muted);font-weight:300}
.nav-item{display:flex;align-items:center;gap:14px;padding:10px 16px;border-radius:6px;cursor:pointer;color:var(--muted);font-size:0.85rem;font-weight:600;transition:var(--t)}
.nav-item:hover{color:var(--text);background:rgba(255,255,255,0.05)}
.nav-item.active{color:var(--text)}
.nav-item svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}
.nav-item.active svg{fill:currentColor;stroke:currentColor}
.sidebar-divider{height:1px;background:var(--border);margin:8px 0}
.now-playing-sidebar{margin-top:auto;padding:12px;background:var(--surface2);border-radius:8px;display:none}
.now-playing-sidebar.show{display:block}
.nps-thumb{width:100%;aspect-ratio:1;border-radius:6px;object-fit:cover;margin-bottom:10px}
.nps-title{font-size:0.8rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nps-artist{font-size:0.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}

.main{flex:1;overflow:hidden;background:var(--bg);display:flex;flex-direction:column}
.main-header{padding:16px 24px 0;display:flex;align-items:center;gap:12px;flex-shrink:0}
.nav-arrows{display:flex;gap:6px}
.nav-arrow{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.7);border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.nav-arrow:hover{color:var(--text);background:rgba(255,255,255,0.1)}
.nav-arrow svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.5}
.main-search{flex:1;position:relative;max-width:400px}
.main-search input{width:100%;background:var(--surface2);border:none;padding:10px 16px 10px 42px;border-radius:24px;color:var(--text);font-size:0.875rem;font-family:inherit;outline:none;transition:var(--t)}
.main-search input:focus{background:var(--surface3);box-shadow:0 0 0 2px rgba(255,255,255,0.15)}
.main-search input::placeholder{color:var(--dim)}
.main-search .s-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;stroke:var(--dim);fill:none;stroke-width:2.5}
.filter-row{display:flex;gap:8px;padding:16px 24px 0;flex-wrap:wrap;flex-shrink:0}
.filter-chip{padding:7px 16px;border-radius:20px;background:var(--surface2);border:none;color:var(--text);font-size:0.78rem;font-weight:600;cursor:pointer;transition:var(--t);font-family:inherit;white-space:nowrap}
.filter-chip:hover{background:var(--surface3)}
.filter-chip.active{background:var(--accent);color:#000}
.content{flex:1;overflow-y:auto;padding:16px 24px 0}
.section-title{font-size:1.4rem;font-weight:700;margin-bottom:20px}
.section-sub{font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;margin-bottom:12px}
.result-list{display:flex;flex-direction:column;gap:2px}
.result-row{display:flex;align-items:center;gap:14px;padding:8px 16px;border-radius:6px;cursor:pointer;transition:var(--t);position:relative;group}
.result-row:hover{background:rgba(255,255,255,0.07)}
.result-row.active{background:var(--accent-dim)}
.result-row.active .result-row-title{color:var(--accent)}
.rr-num{width:20px;text-align:right;font-size:0.85rem;color:var(--muted);flex-shrink:0;font-variant-numeric:tabular-nums}
.result-row:hover .rr-num{display:none}
.result-row:hover .rr-play{display:flex}
.rr-play{display:none;width:20px;align-items:center;justify-content:center;flex-shrink:0}
.rr-play svg{width:16px;height:16px;stroke:var(--text);fill:var(--text);stroke-width:0}
.rr-thumb{width:44px;height:44px;border-radius:4px;object-fit:cover;background:var(--surface2);flex-shrink:0}
.rr-info{flex:1;min-width:0}
.result-row-title{font-size:0.875rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.result-row-sub{font-size:0.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.rr-dur{font-size:0.78rem;color:var(--dim);font-variant-numeric:tabular-nums;flex-shrink:0;font-family:'SF Mono',monospace}
.rr-badge{font-size:0.6rem;text-transform:uppercase;color:var(--dim);padding:2px 7px;border:1px solid var(--border);border-radius:10px;flex-shrink:0}
.rr-actions{display:flex;gap:4px;opacity:0;transition:var(--t);flex-shrink:0}
.result-row:hover .rr-actions{opacity:1}
.rr-btn{width:28px;height:28px;border-radius:50%;background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.rr-btn:hover{color:var(--text);background:rgba(255,255,255,0.1)}
.rr-btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}
.empty-state{padding:60px 24px;text-align:center;color:var(--dim)}
.empty-icon{width:60px;height:60px;stroke:var(--dim);fill:none;stroke-width:1;margin:0 auto 16px}
.empty-state h3{font-size:1.2rem;font-weight:700;color:var(--muted);margin-bottom:8px}
.empty-state p{font-size:0.85rem}
.loading-dots{display:none;padding:48px;text-align:center}
.loading-dots span{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--muted);margin:0 3px;animation:bounce 1.2s infinite}
.loading-dots span:nth-child(2){animation-delay:0.2s}
.loading-dots span:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-10px)}}

.entity-header{display:flex;gap:24px;align-items:flex-end;padding:40px 24px 24px;background:linear-gradient(transparent,rgba(0,0,0,0.6));margin:-16px -24px 20px;position:relative;overflow:hidden}
.entity-header::before{content:'';position:absolute;inset:0;z-index:0}
.entity-art{width:200px;height:200px;border-radius:12px;object-fit:cover;box-shadow:0 20px 60px rgba(0,0,0,0.6);flex-shrink:0;position:relative;z-index:1}
.entity-art.circle{border-radius:50%}
.entity-meta{position:relative;z-index:1;flex:1;min-width:0}
.entity-type{font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px}
.entity-name{font-size:3rem;font-weight:900;line-height:1.1;margin-bottom:12px;word-break:break-word}
.entity-desc{font-size:0.85rem;color:var(--muted);margin-bottom:12px;max-width:500px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.entity-stat{font-size:0.8rem;color:var(--muted)}
.entity-actions{display:flex;align-items:center;gap:16px;padding:20px 0}
.play-fab{width:56px;height:56px;border-radius:50%;background:var(--accent);border:none;color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t);flex-shrink:0}
.play-fab:hover{background:var(--accent-hover);transform:scale(1.05)}
.play-fab svg{width:24px;height:24px;stroke:currentColor;fill:currentColor;stroke-width:0}
.back-btn{display:flex;align-items:center;gap:6px;padding:8px 18px;background:transparent;border:1px solid var(--muted);border-radius:20px;color:var(--muted);font-size:0.8rem;font-weight:600;font-family:inherit;cursor:pointer;transition:var(--t)}
.back-btn:hover{border-color:var(--text);color:var(--text)}

.player-bar{position:fixed;bottom:0;left:0;right:0;height:90px;background:var(--player-bg);border-top:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:16px;z-index:200;transform:translateY(100%);transition:transform 0.35s cubic-bezier(0.4,0,0.2,1)}
.player-bar.visible{transform:translateY(0)}
.pb-left{display:flex;align-items:center;gap:14px;width:280px;flex-shrink:0;min-width:0}
.pb-thumb{width:56px;height:56px;border-radius:4px;object-fit:cover;background:var(--surface2);flex-shrink:0;cursor:pointer}
.pb-info{flex:1;min-width:0}
.pb-title{font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.pb-title:hover{text-decoration:underline}
.pb-artist{font-size:0.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.pb-artist:hover{text-decoration:underline;color:var(--text)}
.pb-heart{width:32px;height:32px;border:none;background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--t)}
.pb-heart:hover{color:var(--text)}
.pb-heart.liked{color:var(--accent)}
.pb-heart svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
.pb-heart.liked svg{fill:currentColor}

.pb-center{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}
.pb-controls{display:flex;align-items:center;gap:8px}
.pb-ctrl{width:32px;height:32px;border-radius:50%;background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.pb-ctrl:hover{color:var(--text);transform:scale(1.1)}
.pb-ctrl.on{color:var(--accent)}
.pb-ctrl svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
.pb-ctrl.on svg{fill:currentColor}
.pb-play{width:40px;height:40px;border-radius:50%;background:var(--text);border:none;color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.pb-play:hover{transform:scale(1.08)}
.pb-play svg{width:18px;height:18px;stroke:currentColor;fill:currentColor;stroke-width:0}
.pb-progress{display:flex;align-items:center;gap:10px;width:100%}
.pb-time{font-size:0.7rem;color:var(--dim);font-variant-numeric:tabular-nums;font-family:'SF Mono',monospace;flex-shrink:0}
.pb-bar{flex:1;height:4px;background:var(--surface3);border-radius:2px;cursor:pointer;position:relative;group}
.pb-bar:hover .pb-fill::after{opacity:1}
.pb-fill{height:100%;background:var(--muted);border-radius:2px;transition:width 0.1s linear;position:relative;pointer-events:none}
.pb-fill::after{content:'';position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:var(--text);opacity:0;transition:var(--t)}
.pb-bar:hover .pb-fill{background:var(--accent)}

.pb-right{display:flex;align-items:center;gap:8px;width:280px;flex-shrink:0;justify-content:flex-end}
.vol-ctrl{display:flex;align-items:center;gap:8px}
.vol-bar{width:80px;height:4px;background:var(--surface3);border-radius:2px;cursor:pointer;position:relative}
.vol-fill{height:100%;background:var(--muted);border-radius:2px}
.vol-bar:hover .vol-fill{background:var(--accent)}

.expanded-player{position:fixed;inset:0;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 30%,#0f3460 60%,#1a1a2e 100%);z-index:300;display:flex;flex-direction:column;transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1)}
.expanded-player.open{transform:translateY(0)}
.ep-header{display:flex;align-items:center;justify-content:space-between;padding:20px 32px;flex-shrink:0}
.ep-close{width:40px;height:40px;border:none;background:rgba(255,255,255,0.1);border-radius:50%;color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.ep-close:hover{background:rgba(255,255,255,0.2)}
.ep-close svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}
.ep-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);font-weight:700}
.ep-body{flex:1;display:flex;gap:48px;padding:0 64px;overflow:hidden}
.ep-left{display:flex;flex-direction:column;justify-content:center;align-items:center;width:420px;flex-shrink:0}
.ep-art{width:340px;height:340px;border-radius:16px;object-fit:cover;box-shadow:0 40px 80px rgba(0,0,0,0.6);transition:transform 0.3s ease}
.ep-art.playing{transform:scale(1.03)}
.ep-song-info{width:340px;margin-top:28px}
.ep-title{font-size:1.6rem;font-weight:800;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ep-artist{font-size:1rem;color:rgba(255,255,255,0.7);cursor:pointer}
.ep-artist:hover{text-decoration:underline;color:white}
.ep-controls{width:340px;margin-top:24px}
.ep-prog{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.ep-bar{flex:1;height:5px;background:rgba(255,255,255,0.2);border-radius:3px;cursor:pointer;position:relative}
.ep-bar:hover .ep-fill{background:var(--accent)}
.ep-fill{height:100%;background:rgba(255,255,255,0.8);border-radius:3px;transition:width 0.1s linear;position:relative}
.ep-fill::after{content:'';position:absolute;right:-7px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:50%;background:white;opacity:0;transition:var(--t)}
.ep-bar:hover .ep-fill::after{opacity:1}
.ep-time{font-size:0.72rem;color:rgba(255,255,255,0.5);font-family:'SF Mono',monospace}
.ep-btns{display:flex;align-items:center;justify-content:space-between}
.ep-btn{width:44px;height:44px;border:none;background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:var(--t)}
.ep-btn:hover{color:white;background:rgba(255,255,255,0.1)}
.ep-btn.on{color:var(--accent)}
.ep-btn svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2}
.ep-btn.on svg{fill:currentColor}
.ep-play-big{width:64px;height:64px;border-radius:50%;background:white;border:none;color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}
.ep-play-big:hover{transform:scale(1.08)}
.ep-play-big svg{width:26px;height:26px;stroke:currentColor;fill:currentColor;stroke-width:0}
.ep-actions{display:flex;gap:16px;margin-top:20px;justify-content:center}
.ep-action-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:20px;background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.8);font-size:0.78rem;font-weight:600;font-family:inherit;cursor:pointer;transition:var(--t)}
.ep-action-btn:hover{background:rgba(255,255,255,0.2);color:white}
.ep-action-btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}
.ep-action-btn.downloading{color:var(--accent)}

.ep-right{flex:1;overflow:hidden;display:flex;flex-direction:column}
.ep-tabs{display:flex;gap:4px;margin-bottom:20px;flex-shrink:0}
.ep-tab{padding:8px 20px;border-radius:20px;background:transparent;border:none;color:rgba(255,255,255,0.5);font-size:0.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:var(--t)}
.ep-tab.active{background:rgba(255,255,255,0.15);color:white}
.ep-tab-content{flex:1;overflow-y:auto}
.ep-tab-panel{display:none}
.ep-tab-panel.active{display:block}

.lyrics-container{padding-right:16px}
.lyric-line{font-size:1.6rem;font-weight:700;line-height:1.5;color:rgba(255,255,255,0.25);cursor:pointer;padding:4px 0;transition:color 0.4s ease,transform 0.3s ease;transform-origin:left}
.lyric-line.active{color:white;font-size:1.9rem;transform:scale(1.04)}
.lyric-line.past{color:rgba(255,255,255,0.45)}
.lyric-line:hover{color:rgba(255,255,255,0.7)}
.lyrics-plain{font-size:0.9rem;line-height:2;color:rgba(255,255,255,0.7);white-space:pre-wrap}
.lyrics-loading{padding:40px;text-align:center;color:rgba(255,255,255,0.4)}
.lyrics-none{padding:40px;text-align:center;color:rgba(255,255,255,0.3);font-size:0.9rem}

.queue-item{display:flex;align-items:center;gap:12px;padding:8px 0;border-radius:6px;cursor:pointer;transition:var(--t)}
.queue-item:hover{padding:8px 12px;margin:0 -12px;background:rgba(255,255,255,0.08)}
.queue-item.active .qi-title{color:var(--accent)}
.qi-num{width:24px;text-align:right;font-size:0.8rem;color:rgba(255,255,255,0.3)}
.qi-thumb{width:40px;height:40px;border-radius:4px;object-fit:cover;background:rgba(255,255,255,0.1)}
.qi-info{flex:1;min-width:0}
.qi-title{font-size:0.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qi-sub{font-size:0.72rem;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qi-dur{font-size:0.72rem;color:rgba(255,255,255,0.3);font-family:'SF Mono',monospace}

.toast{position:fixed;bottom:110px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--surface3);color:var(--text);padding:10px 20px;border-radius:20px;font-size:0.82rem;font-weight:600;z-index:500;opacity:0;transition:all 0.3s ease;pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

.api-tab{padding:0 0 24px}
.api-section{background:var(--surface2);border-radius:8px;padding:20px;margin-bottom:16px}
.api-title{font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:16px}
.api-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.api-input{flex:1;min-width:160px;background:var(--surface3);border:1px solid var(--border);padding:10px 14px;border-radius:6px;color:var(--text);font-size:0.85rem;font-family:inherit;outline:none;transition:var(--t)}
.api-input:focus{border-color:rgba(255,255,255,0.3)}
.api-select{background:var(--surface3);border:1px solid var(--border);padding:10px 14px;border-radius:6px;color:var(--text);font-size:0.85rem;font-family:inherit;outline:none;cursor:pointer}
.api-btn{padding:10px 20px;border-radius:6px;background:var(--accent);border:none;color:#000;font-size:0.85rem;font-weight:700;font-family:inherit;cursor:pointer;transition:var(--t)}
.api-btn:hover{background:var(--accent-hover)}
.api-url{font-family:'SF Mono',monospace;font-size:0.72rem;color:var(--muted);padding:10px 14px;background:var(--bg);border-radius:6px;margin-bottom:10px;border:1px solid var(--border);word-break:break-all}
.api-response{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:16px;max-height:320px;overflow:auto}
.api-response pre{font-family:'SF Mono',monospace;font-size:0.7rem;color:#a8ff78;white-space:pre-wrap;word-break:break-all;margin:0}
.endpoint-list{display:flex;flex-direction:column;gap:4px}
.ep-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border-radius:6px;cursor:pointer;transition:var(--t);border:1px solid var(--border)}
.ep-row:hover{border-color:var(--muted)}
.ep-method{font-size:0.65rem;font-weight:700;padding:3px 8px;border-radius:4px;background:var(--accent-dim);color:var(--accent);min-width:36px;text-align:center;font-family:monospace}
.ep-path{font-family:'SF Mono',monospace;font-size:0.78rem;flex:1;color:var(--text);word-break:break-all}
.ep-path .param{color:var(--muted)}
.ep-copy{width:26px;height:26px;border:none;background:var(--surface3);border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t);flex-shrink:0}
.ep-copy:hover{background:var(--border)}
.ep-copy svg{width:13px;height:13px;stroke:var(--muted);fill:none;stroke-width:2}
.ep-copy.ok svg{stroke:var(--accent)}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp 0.3s ease}
@media(max-width:900px){
  .sidebar{display:none}
  .ep-body{flex-direction:column;padding:0 24px}
  .ep-left{width:100%;flex-shrink:1}
  .ep-art{width:220px;height:220px}
  .ep-title{font-size:1.2rem}
  .pb-left{width:auto;min-width:0}
  .pb-right{width:auto;min-width:0}
}
</style>
</head>
<body>

<div class="layout">
  <div class="sidebar">
    <div class="sidebar-logo">
      <img src="/assets/logo.png" alt="logo">
      <div><span>YTMusic</span><br><small>API v2.1</small></div>
    </div>
    <div class="nav-item active" data-nav="search" onclick="setNav(this)">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>Search
    </div>
    <div class="nav-item" data-nav="discover" onclick="setNav(this)">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Discover
    </div>
    <div class="nav-item" data-nav="charts" onclick="setNav(this)">
      <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Charts
    </div>
    <div class="nav-item" data-nav="api" onclick="setNav(this)">
      <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>API Docs
    </div>
    <div class="sidebar-divider"></div>
    <div class="now-playing-sidebar" id="npSidebar">
      <img class="nps-thumb" id="npsSrc" src="">
      <div class="nps-title" id="npsTitle">-</div>
      <div class="nps-artist" id="npsArtist">-</div>
    </div>
  </div>

  <div class="main">
    <div class="main-header">
      <div class="nav-arrows">
        <button class="nav-arrow" onclick="history.back()"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="nav-arrow" onclick="history.forward()"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
      <div class="main-search">
        <svg class="s-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="searchInput" placeholder="Search songs, artists, albums..." autocomplete="off">
      </div>
    </div>

    <div class="filter-row" id="filterRow">
      <button class="filter-chip active" data-filter="" onclick="setFilter(this)">All</button>
      <button class="filter-chip" data-filter="songs" onclick="setFilter(this)">Songs</button>
      <button class="filter-chip" data-filter="albums" onclick="setFilter(this)">Albums</button>
      <button class="filter-chip" data-filter="artists" onclick="setFilter(this)">Artists</button>
      <button class="filter-chip" data-filter="playlists" onclick="setFilter(this)">Playlists</button>
      <button class="filter-chip" data-filter="videos" onclick="setFilter(this)">Videos</button>
    </div>

    <div class="content" id="mainContent">
      <div id="searchPane">
        <div class="loading-dots" id="loading"><span></span><span></span><span></span></div>
        <div id="results">
          <div class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24"><circle cx="9" cy="9" r="7"/><path d="m16 16 5 5"/><path d="M9 6v3h3"/></svg>
            <h3>Find your music</h3>
            <p>Search for songs, artists, albums or playlists</p>
          </div>
        </div>
      </div>
      <div id="discoverPane" style="display:none"></div>
      <div id="chartsPane" style="display:none"></div>
      <div id="apiPane" style="display:none"></div>
    </div>
  </div>
</div>

<div class="player-bar" id="playerBar">
  <div class="pb-left">
    <img class="pb-thumb" id="pbThumb" src="" onclick="toggleExpand()">
    <div class="pb-info">
      <div class="pb-title" id="pbTitle" onclick="toggleExpand()">-</div>
      <div class="pb-artist" id="pbArtist">-</div>
    </div>
    <button class="pb-heart" id="pbHeart" onclick="toggleLike()"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
  </div>
  <div class="pb-center">
    <div class="pb-controls">
      <button class="pb-ctrl" id="pbShuffle" onclick="toggleShuffle()" title="Shuffle"><svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg></button>
      <button class="pb-ctrl" onclick="prevSong()"><svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"/><rect x="5" y="4" width="3" height="16" fill="currentColor" stroke="none"/></svg></button>
      <button class="pb-play" id="pbPlay" onclick="togglePlay()"><svg viewBox="0 0 24 24" id="pbPlayIcon"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
      <button class="pb-ctrl" onclick="nextSong()"><svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><rect x="16" y="4" width="3" height="16" fill="currentColor" stroke="none"/></svg></button>
      <button class="pb-ctrl" id="pbRepeat" onclick="toggleRepeat()" title="Repeat"><svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>
    </div>
    <div class="pb-progress">
      <span class="pb-time" id="pbCur">0:00</span>
      <div class="pb-bar" id="pbBar" onclick="seek(event)"><div class="pb-fill" id="pbFill" style="width:0%"></div></div>
      <span class="pb-time" id="pbDur">0:00</span>
    </div>
  </div>
  <div class="pb-right">
    <button class="pb-ctrl" onclick="toggleExpand()" title="Full screen"><svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg></button>
    <div class="vol-ctrl">
      <button class="pb-ctrl" id="muteBtn" onclick="toggleMute()"><svg viewBox="0 0 24 24" id="volIcon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button>
      <div class="vol-bar" id="volBar" onclick="setVol(event)"><div class="vol-fill" id="volFill" style="width:80%"></div></div>
    </div>
  </div>
</div>

<div class="expanded-player" id="expandedPlayer">
  <div class="ep-header">
    <button class="ep-close" onclick="toggleExpand()"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button>
    <span class="ep-label">Now Playing</span>
    <div style="width:40px"></div>
  </div>
  <div class="ep-body">
    <div class="ep-left">
      <img class="ep-art" id="epArt" src="">
      <div class="ep-song-info">
        <div class="ep-title" id="epTitle">-</div>
        <div class="ep-artist" id="epArtist">-</div>
      </div>
      <div class="ep-controls">
        <div class="ep-prog">
          <span class="ep-time" id="epCur">0:00</span>
          <div class="ep-bar" id="epBar" onclick="seekEp(event)"><div class="ep-fill" id="epFill" style="width:0%"></div></div>
          <span class="ep-time" id="epDur">0:00</span>
        </div>
        <div class="ep-btns">
          <button class="ep-btn" id="epShuffle" onclick="toggleShuffle()"><svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg></button>
          <button class="ep-btn" onclick="prevSong()"><svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"/><rect x="5" y="4" width="3" height="16" fill="currentColor" stroke="none"/></svg></button>
          <button class="ep-play-big" id="epPlay" onclick="togglePlay()"><svg viewBox="0 0 24 24" id="epPlayIcon"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
          <button class="ep-btn" onclick="nextSong()"><svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><rect x="16" y="4" width="3" height="16" fill="currentColor" stroke="none"/></svg></button>
          <button class="ep-btn" id="epRepeat" onclick="toggleRepeat()"><svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>
        </div>
        <div class="ep-actions" style="margin-top:20px">
          <button class="ep-action-btn" id="dlBtn" onclick="downloadCurrent()">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download
          </button>
          <button class="ep-action-btn" onclick="shareStream()">
            <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share
          </button>
          <button class="ep-action-btn" onclick="copyId()">
            <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy ID
          </button>
        </div>
      </div>
    </div>
    <div class="ep-right">
      <div class="ep-tabs">
        <button class="ep-tab active" data-etab="lyrics" onclick="setEpTab(this)">Lyrics</button>
        <button class="ep-tab" data-etab="queue" onclick="setEpTab(this)">Queue</button>
        <button class="ep-tab" data-etab="related" onclick="setEpTab(this)">Related</button>
      </div>
      <div class="ep-tab-content">
        <div class="ep-tab-panel active" id="etab-lyrics">
          <div class="lyrics-loading" id="lyricsLoading">Loading lyrics...</div>
          <div id="lyricsContent"></div>
        </div>
        <div class="ep-tab-panel" id="etab-queue">
          <div id="queueContent"></div>
        </div>
        <div class="ep-tab-panel" id="etab-related">
          <div id="relatedContent"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<div id="ytplayer" style="display:none;position:fixed;bottom:-999px"></div>

<script>
var tag=document.createElement('script');
tag.src='https://www.youtube.com/iframe_api';
document.head.appendChild(tag);

var songs=[],yt=null,ytReady=false,playing=false,songIdx=-1,progInterval=null;
var shuffle=false,repeat=0,liked=new Set(),vol=0.8,muted=false;
var expanded=false,syncedLyrics=[],plainLyrics='',lyricsLoaded=false;
var currentNav='search',currentFilter='',lastQuery='';
var downloading=false;

function onYouTubeIframeAPIReady(){
  yt=new YT.Player('ytplayer',{
    height:'0',width:'0',
    host:'https://www.youtube-nocookie.com',
    playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,modestbranding:1,rel:0},
    events:{
      onReady:function(){ytReady=true;yt.setVolume(vol*100)},
      onStateChange:onYTState,
      onError:onYTError
    }
  });
}

function onYTState(e){
  if(e.data===1){
    playing=true;
    setPlayIcons(true);
    startProgress();
  } else if(e.data===2||e.data===0){
    playing=false;
    setPlayIcons(false);
    stopProgress();
  }
  if(e.data===0){
    if(repeat===2){yt.seekTo(0);yt.playVideo();}
    else setTimeout(nextSong,800);
  }
}

function onYTError(e){
  var s=songs[songIdx];
  if(s&&s.fallbackVideoId&&!s._triedFallback){
    s._triedFallback=true;
    yt.loadVideoById(s.fallbackVideoId);
  } else {
    showToast('Playback error — skipping');
    setTimeout(nextSong,1000);
  }
}

function setPlayIcons(p){
  var pi=p?'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>':'<polygon points="5 3 19 12 5 21 5 3"/>';
  document.getElementById('pbPlayIcon').innerHTML=pi;
  document.getElementById('epPlayIcon').innerHTML=pi;
  var art=document.getElementById('epArt');
  if(p)art.classList.add('playing');else art.classList.remove('playing');
}

function startProgress(){stopProgress();progInterval=setInterval(updateProgress,300)}
function stopProgress(){if(progInterval){clearInterval(progInterval);progInterval=null}}

function updateProgress(){
  if(!yt||!ytReady)return;
  var c=yt.getCurrentTime()||0,t=yt.getDuration()||0;
  var pct=t>0?c/t*100:0;
  document.getElementById('pbCur').textContent=fmt(c);
  document.getElementById('pbDur').textContent=fmt(t);
  document.getElementById('pbFill').style.width=pct+'%';
  document.getElementById('epCur').textContent=fmt(c);
  document.getElementById('epDur').textContent=fmt(t);
  document.getElementById('epFill').style.width=pct+'%';
  if(syncedLyrics.length)updateLyricHighlight(c);
}

function fmt(s){var m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+(sec<10?'0':'')+sec}

function seek(e){
  if(!yt||!ytReady)return;
  var rect=document.getElementById('pbBar').getBoundingClientRect();
  var pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
  yt.seekTo(pct*(yt.getDuration()||0),true);
}

function seekEp(e){
  if(!yt||!ytReady)return;
  var rect=document.getElementById('epBar').getBoundingClientRect();
  var pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
  yt.seekTo(pct*(yt.getDuration()||0),true);
}

function setVol(e){
  var rect=document.getElementById('volBar').getBoundingClientRect();
  vol=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
  document.getElementById('volFill').style.width=(vol*100)+'%';
  if(yt&&ytReady)yt.setVolume(vol*100);
  muted=false;
  updateVolIcon();
}

function toggleMute(){
  muted=!muted;
  if(yt&&ytReady){muted?yt.mute():yt.unMute()}
  updateVolIcon();
}

function updateVolIcon(){
  var vi=document.getElementById('volIcon');
  if(muted||vol===0){
    vi.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
  } else {
    vi.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
  }
}

function playSong(i){
  if(!songs[i]||!ytReady)return;
  songIdx=i;
  var s=songs[i];
  var thumb=thumb4song(s);
  var artist=artist4song(s);
  document.getElementById('pbTitle').textContent=s.title||'Unknown';
  document.getElementById('pbArtist').textContent=artist;
  document.getElementById('pbThumb').src=thumb;
  document.getElementById('epTitle').textContent=s.title||'Unknown';
  document.getElementById('epArtist').textContent=artist;
  document.getElementById('epArt').src=thumb;
  document.getElementById('playerBar').classList.add('visible');
  document.getElementById('npSidebar').classList.add('show');
  document.getElementById('npsSrc').src=thumb;
  document.getElementById('npsTitle').textContent=s.title||'Unknown';
  document.getElementById('npsArtist').textContent=artist;
  document.getElementById('pbHeart').classList.toggle('liked',liked.has(s.videoId));
  renderQueue();
  highlightActive();
  lyricsLoaded=false;
  syncedLyrics=[];plainLyrics='';
  document.getElementById('lyricsContent').innerHTML='';
  document.getElementById('lyricsLoading').style.display='block';
  if(expanded){loadLyrics(s);loadRelated(s);}
  yt.loadVideoById(s.videoId);
  yt.playVideo();
  setDynamicBg(thumb);
}

function setDynamicBg(imgUrl){
  var ep=document.getElementById('expandedPlayer');
  var img=new Image();
  img.crossOrigin='anonymous';
  img.onload=function(){
    try{
      var c=document.createElement('canvas');c.width=c.height=1;
      var ctx=c.getContext('2d');ctx.drawImage(img,0,0,1,1);
      var d=ctx.getImageData(0,0,1,1).data;
      var r=d[0],g=d[1],b=d[2];
      var dark='rgba('+Math.round(r*0.3)+','+Math.round(g*0.3)+','+Math.round(b*0.3)+',1)';
      var mid='rgba('+Math.round(r*0.5)+','+Math.round(g*0.5)+','+Math.round(b*0.5)+',0.8)';
      ep.style.background='linear-gradient(135deg,'+dark+' 0%,'+mid+' 50%,#0a0a0a 100%)';
    }catch(e){}
  };
  img.src=imgUrl;
}

function thumb4song(s){return s.thumbnails?.[0]?.url||(s.videoId?'https://img.youtube.com/vi/'+s.videoId+'/mqdefault.jpg':'')}
function artist4song(s){return s.artists?.map(function(a){return a.name}).join(', ')||s.subtitle||s.author||''}

function togglePlay(){if(!ytReady)return;playing?yt.pauseVideo():yt.playVideo()}

function prevSong(){
  if(!yt||!ytReady)return;
  if(yt.getCurrentTime()>4){yt.seekTo(0,true);return;}
  var ni=shuffle?Math.floor(Math.random()*songs.length):songIdx-1;
  if(ni>=0)playSong(ni);
}

function nextSong(){
  if(!songs.length)return;
  var ni;
  if(repeat===1&&songIdx>=0){ni=songIdx;}
  else if(shuffle){ni=Math.floor(Math.random()*songs.length);}
  else{ni=songIdx+1;}
  if(ni<songs.length)playSong(ni);
  else if(repeat===2&&songs.length)playSong(0);
}

function toggleShuffle(){
  shuffle=!shuffle;
  document.getElementById('pbShuffle').classList.toggle('on',shuffle);
  document.getElementById('epShuffle').classList.toggle('on',shuffle);
  showToast(shuffle?'Shuffle on':'Shuffle off');
}

function toggleRepeat(){
  repeat=(repeat+1)%3;
  var els=[document.getElementById('pbRepeat'),document.getElementById('epRepeat')];
  els.forEach(function(el){
    el.classList.toggle('on',repeat>0);
    if(repeat===2){el.style.position='relative';}
    else{el.style.position='';}
  });
  showToast(['Repeat off','Repeat all','Repeat one'][repeat]);
}

function toggleLike(){
  var s=songs[songIdx];if(!s)return;
  if(liked.has(s.videoId))liked.delete(s.videoId);else liked.add(s.videoId);
  document.getElementById('pbHeart').classList.toggle('liked',liked.has(s.videoId));
  showToast(liked.has(s.videoId)?'Added to liked':'Removed from liked');
}

function toggleExpand(){
  expanded=!expanded;
  document.getElementById('expandedPlayer').classList.toggle('open',expanded);
  if(expanded&&songIdx>=0&&!lyricsLoaded){
    loadLyrics(songs[songIdx]);
    loadRelated(songs[songIdx]);
  }
}

function highlightActive(){
  document.querySelectorAll('.result-row').forEach(function(el,i){
    el.classList.toggle('active',i===songIdx);
  });
}

async function loadLyrics(s){
  lyricsLoaded=true;
  syncedLyrics=[];plainLyrics='';
  document.getElementById('lyricsLoading').style.display='block';
  document.getElementById('lyricsContent').innerHTML='';
  var artist=artist4song(s);
  var dur=s.duration_seconds||s.durationSeconds||0;
  try{
    var url='/api/lyrics?title='+encodeURIComponent(s.title||'')+'&artist='+encodeURIComponent(artist);
    if(dur)url+='&duration='+dur;
    var res=await fetch(url);
    var data=await res.json();
    document.getElementById('lyricsLoading').style.display='none';
    if(data.success&&data.syncedLyrics){
      syncedLyrics=parseLRC(data.syncedLyrics);
      renderSyncedLyrics();
    } else if(data.success&&data.plainLyrics){
      plainLyrics=data.plainLyrics;
      document.getElementById('lyricsContent').innerHTML='<div class="lyrics-plain">'+esc(plainLyrics)+'</div>';
    } else {
      document.getElementById('lyricsContent').innerHTML='<div class="lyrics-none">No lyrics found</div>';
    }
  }catch(e){
    document.getElementById('lyricsLoading').style.display='none';
    document.getElementById('lyricsContent').innerHTML='<div class="lyrics-none">Could not load lyrics</div>';
  }
}

function parseLRC(lrc){
  var lines=lrc.split('\\n');
  var result=[];
  lines.forEach(function(line){
    var m=line.match(/\\[(\\d+):(\\d+\\.?\\d*)\\](.*)/);
    if(m){
      var t=parseInt(m[1])*60+parseFloat(m[2]);
      var txt=m[3].trim();
      if(txt)result.push({time:t,text:txt});
    }
  });
  return result;
}

function renderSyncedLyrics(){
  var el=document.getElementById('lyricsContent');
  el.innerHTML=syncedLyrics.map(function(l,i){
    return '<div class="lyric-line" data-idx="'+i+'" onclick="seekToLyric('+i+')">'+esc(l.text)+'</div>';
  }).join('');
}

function seekToLyric(i){
  if(!yt||!ytReady)return;
  yt.seekTo(syncedLyrics[i].time,true);
}

function updateLyricHighlight(ct){
  if(!syncedLyrics.length)return;
  var ai=-1;
  for(var i=0;i<syncedLyrics.length;i++){
    if(syncedLyrics[i].time<=ct)ai=i;else break;
  }
  document.querySelectorAll('.lyric-line').forEach(function(el,i){
    el.classList.toggle('active',i===ai);
    el.classList.toggle('past',i<ai);
  });
  if(ai>=0){
    var activeEl=document.querySelector('.lyric-line[data-idx="'+ai+'"]');
    if(activeEl){activeEl.scrollIntoView({behavior:'smooth',block:'center'});}
  }
}

async function loadRelated(s){
  document.getElementById('relatedContent').innerHTML='<div class="lyrics-loading">Loading related...</div>';
  try{
    var res=await fetch('/api/related/'+s.videoId);
    var data=await res.json();
    var items=data.data||data.results||[];
    if(!items.length){document.getElementById('relatedContent').innerHTML='<div class="lyrics-none">No related found</div>';return;}
    var relSongs=items.slice(0,20).filter(function(x){return x.videoId});
    document.getElementById('relatedContent').innerHTML=relSongs.map(function(rs,i){
      var t=thumb4song(rs),ar=artist4song(rs);
      return '<div class="queue-item" onclick="playRelated('+i+')"><div class="qi-num">'+(i+1)+'</div><img class="qi-thumb" src="'+t+'"><div class="qi-info"><div class="qi-title">'+esc(rs.title||'Unknown')+'</div><div class="qi-sub">'+esc(ar)+'</div></div><div class="qi-dur">'+(rs.duration||'')+'</div></div>';
    }).join('');
    window._relatedSongs=relSongs;
  }catch(e){document.getElementById('relatedContent').innerHTML='<div class="lyrics-none">Could not load related</div>';}
}

function playRelated(i){
  var rs=window._relatedSongs;
  if(!rs||!rs[i])return;
  songs=rs;
  playSong(i);
  renderResults();
}

function renderQueue(){
  var el=document.getElementById('queueContent');
  if(!songs.length){el.innerHTML='<div class="lyrics-none">Queue is empty</div>';return;}
  el.innerHTML=songs.map(function(s,i){
    var t=thumb4song(s),ar=artist4song(s);
    return '<div class="queue-item'+(i===songIdx?' active':'')+'\" onclick=\"queuePlay('+i+')"><div class="qi-num">'+(i+1)+'</div><img class="qi-thumb" src="'+t+'"><div class="qi-info"><div class="qi-title">'+esc(s.title||'Unknown')+'</div><div class="qi-sub">'+esc(ar)+'</div></div><div class="qi-dur">'+(s.duration||'')+'</div></div>';
  }).join('');
}

function queuePlay(i){playSong(i)}

async function downloadCurrent(){
  if(downloading)return;
  var s=songs[songIdx];
  if(!s||!s.videoId){showToast('No song selected');return;}
  downloading=true;
  var btn=document.getElementById('dlBtn');
  btn.classList.add('downloading');
  btn.innerHTML='<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Downloading...';
  showToast('Starting download...');
  try{
    var url='/api/download?id='+encodeURIComponent(s.videoId)+'&title='+encodeURIComponent(s.title||'audio');
    var a=document.createElement('a');
    a.href=url;
    a.download=(s.title||'audio')+'.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download started!');
  }catch(e){showToast('Download failed');}
  setTimeout(function(){
    downloading=false;
    btn.classList.remove('downloading');
    btn.innerHTML='<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download';
  },3000);
}

function shareStream(){
  var s=songs[songIdx];if(!s)return;
  var url=window.location.origin+'/api/stream?id='+s.videoId;
  navigator.clipboard.writeText(url).then(function(){showToast('Stream URL copied!')});
}

function copyId(){
  var s=songs[songIdx];if(!s)return;
  navigator.clipboard.writeText(s.videoId).then(function(){showToast('Video ID copied!')});
}

function setEpTab(btn){
  document.querySelectorAll('.ep-tab').forEach(function(b){b.classList.remove('active')});
  btn.classList.add('active');
  document.querySelectorAll('.ep-tab-panel').forEach(function(p){p.classList.remove('active')});
  document.getElementById('etab-'+btn.dataset.etab).classList.add('active');
  if(btn.dataset.etab==='queue')renderQueue();
}

function setNav(el){
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active')});
  el.classList.add('active');
  currentNav=el.dataset.nav;
  ['search','discover','charts','api'].forEach(function(p){
    document.getElementById(p+'Pane').style.display=p===currentNav?'':'none';
  });
  if(currentNav==='discover')loadDiscover();
  if(currentNav==='charts')loadCharts();
  if(currentNav==='api')renderApiPane();
}

function setFilter(btn){
  document.querySelectorAll('.filter-chip').forEach(function(b){b.classList.remove('active')});
  btn.classList.add('active');
  currentFilter=btn.dataset.filter;
  if(lastQuery)doSearch(lastQuery,currentFilter);
}

var searchDebounce=null;
document.getElementById('searchInput').addEventListener('input',function(){
  clearTimeout(searchDebounce);
  var q=this.value.trim();
  if(!q){lastQuery='';showEmptyState();return;}
  searchDebounce=setTimeout(function(){doSearch(q,currentFilter)},500);
});
document.getElementById('searchInput').addEventListener('keydown',function(e){
  if(e.key==='Enter'){clearTimeout(searchDebounce);doSearch(this.value.trim(),currentFilter);}
});

async function doSearch(q,filter){
  if(!q)return;
  lastQuery=q;
  document.getElementById('loading').style.display='block';
  document.getElementById('results').innerHTML='';
  setNav(document.querySelector('[data-nav="search"]'));
  try{
    var url='/api/search?q='+encodeURIComponent(q)+'&fallback=1';
    if(filter)url+='&filter='+filter;
    var res=await fetch(url);
    var data=await res.json();
    songs=data.results||[];
    renderResults();
  }catch(e){songs=[];renderResults();}
  document.getElementById('loading').style.display='none';
}

function showEmptyState(){
  document.getElementById('results').innerHTML='<div class="empty-state"><svg class="empty-icon" viewBox="0 0 24 24"><circle cx="9" cy="9" r="7"/><path d="m16 16 5 5"/><path d="M9 6v3h3"/></svg><h3>Find your music</h3><p>Search for songs, artists, albums or playlists</p></div>';
}

function renderResults(){
  var el=document.getElementById('results');
  if(!songs.length){
    el.innerHTML='<div class="empty-state"><svg class="empty-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><h3>No results</h3><p>Try a different search</p></div>';
    return;
  }
  var html='<div class="result-list fade-up">';
  songs.forEach(function(s,i){
    var type=s.resultType||'song';
    var thumb=thumb4song(s);
    var artist=artist4song(s);
    var bid=s.browseId||'';
    var isPlaylist=bid.startsWith('VL')||type==='playlist';
    var isAlbum=(bid.startsWith('MPRE')&&!isPlaylist)||type==='album';
    var isArtist=bid.startsWith('UC')||type==='artist';
    var canPlay=!!(s.videoId&&(type==='song'||type==='video'));
    var click='';
    if(canPlay)click='playSong('+i+')';
    else if(isPlaylist&&bid)click="viewPlaylist('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    else if(isAlbum&&bid)click="viewAlbum('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    else if((isArtist||bid)&&!isPlaylist&&!isAlbum)click="viewArtist('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    var badge=(type!=='song'&&type!=='video')?'<span class="rr-badge">'+type+'</span>':'';
    html+='<div class="result-row'+(i===songIdx?' active':'')+'\" onclick="'+click+'">';
    html+='<div class="rr-num">'+(i+1)+'</div>';
    html+='<div class="rr-play"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';
    html+='<img class="rr-thumb" src="'+thumb+'" loading="lazy">';
    html+='<div class="rr-info"><div class="result-row-title">'+esc(s.title||s.name||'Unknown')+'</div><div class="result-row-sub">'+esc(artist||type)+'</div></div>';
    html+=badge;
    html+='<div class="rr-dur">'+esc(s.duration||'')+'</div>';
    if(canPlay){
      html+='<div class="rr-actions">';
      html+='<button class="rr-btn" onclick="event.stopPropagation();dlSong('+i+')" title="Download"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>';
      html+='</div>';
    }
    html+='</div>';
  });
  html+='</div>';
  el.innerHTML=html;
}

function dlSong(i){
  var s=songs[i];if(!s||!s.videoId)return;
  showToast('Starting download...');
  var a=document.createElement('a');
  a.href='/api/download?id='+encodeURIComponent(s.videoId)+'&title='+encodeURIComponent(s.title||'audio');
  a.download=(s.title||'audio')+'.webm';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}

async function viewArtist(id,thumbEnc,nameEnc){
  var thumb=decodeURIComponent(thumbEnc||''),name=decodeURIComponent(nameEnc||'');
  setLoading(true);
  try{
    var res=await fetch('/api/artists/'+encodeURIComponent(id));
    var data=await res.json();
    var tracks=[];
    if(data.topSongs)tracks.push.apply(tracks,data.topSongs.map(function(s){return{...s,resultType:'song',thumbnails:[{url:s.thumbnail||thumb}]}}));
    if(data.songs?.results)tracks.push.apply(tracks,data.songs.results.map(function(s){return{...s,resultType:'song'}}));
    if(data.albums)data.albums.forEach(function(a){tracks.push({...a,resultType:'album',browseId:a.browseId,thumbnails:[{url:a.thumbnail||thumb}]})});
    songs=tracks;
    var bio='';
    try{
      var br=await fetch('/api/artist/info?artist='+encodeURIComponent(name));
      var bd=await br.json();
      if(bd.bio)bio=bd.bio.replace(/<[^>]*>/g,'').split('Read more')[0].trim();
    }catch(e){}
    var art=data.artist||data;
    var realThumb=thumb||art.thumbnail||art.thumbnails?.[0]?.url||'';
    var subs=art.subscribers||'';
    document.getElementById('results').innerHTML=
      entityHeader('Artist',name,realThumb,bio,subs,true)+
      '<div class="result-list fade-up">'+renderResultsHtml(tracks)+'</div>';
  }catch(e){setError('Failed to load artist')}
  setLoading(false);
}

async function viewAlbum(id,thumbEnc,nameEnc){
  var thumb=decodeURIComponent(thumbEnc||''),name=decodeURIComponent(nameEnc||'');
  setLoading(true);
  try{
    var res=await fetch('/api/albums/'+encodeURIComponent(id));
    var data=await res.json();
    var album=data.album||data;
    var alThumb=thumb||album.thumbnail||album.thumbnails?.[0]?.url||'';
    var alName=name||album.title||'Album';
    var artist=data.artist?.name||album.artists?.map(function(a){return a.name}).join(', ')||'';
    var meta=(album.year||'')+((album.year&&album.trackCount)?' · ':'')+((album.trackCount||'')+' tracks');
    songs=(data.tracks||[]).map(function(t){return{...t,resultType:'song',thumbnails:[{url:alThumb}]}});
    document.getElementById('results').innerHTML=
      entityHeader('Album',alName,alThumb,artist+' · '+meta,'',false)+
      '<div class="result-list fade-up">'+renderResultsHtml(songs)+'</div>';
  }catch(e){setError('Failed to load album')}
  setLoading(false);
}

async function viewPlaylist(id,thumbEnc,nameEnc){
  var thumb=decodeURIComponent(thumbEnc||''),name=decodeURIComponent(nameEnc||'');
  setLoading(true);
  try{
    var pid=id.startsWith('VL')?id.substring(2):id;
    var res=await fetch('/api/playlists/'+encodeURIComponent(pid));
    var data=await res.json();
    var plThumb=thumb||data.thumbnail||data.thumbnails?.[0]?.url||'';
    var plName=name||data.title||'Playlist';
    songs=(data.tracks||[]).map(function(t){return{...t,resultType:'song'}});
    document.getElementById('results').innerHTML=
      entityHeader('Playlist',plName,plThumb,data.description||'',(data.trackCount||songs.length)+' tracks',false)+
      '<div class="result-list fade-up">'+renderResultsHtml(songs)+'</div>';
  }catch(e){setError('Failed to load playlist')}
  setLoading(false);
}

function entityHeader(type,name,thumb,desc,stat,circle){
  return '<div class="entity-header">'+
    '<img class="entity-art'+(circle?' circle':'')+'\" src="'+thumb+'">'+
    '<div class="entity-meta">'+
      '<div class="entity-type">'+type+'</div>'+
      '<div class="entity-name">'+esc(name)+'</div>'+
      (desc?'<div class="entity-desc">'+esc(desc)+'</div>':'')+
      (stat?'<div class="entity-stat">'+esc(stat)+'</div>':'')+
    '</div>'+
  '</div>'+
  '<div class="entity-actions">'+
    '<button class="play-fab" onclick="playSong(0)"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>'+
    '<button class="back-btn" onclick="goBack()">← Back</button>'+
  '</div>';
}

function renderResultsHtml(list){
  return list.map(function(s,i){
    var type=s.resultType||'song';
    var thumb=thumb4song(s);
    var artist=artist4song(s);
    var bid=s.browseId||'';
    var isPlaylist=bid.startsWith('VL')||type==='playlist';
    var isAlbum=(bid.startsWith('MPRE')&&!isPlaylist)||type==='album';
    var isArtist=bid.startsWith('UC')||type==='artist';
    var canPlay=!!(s.videoId&&(type==='song'||type==='video'));
    var click='';
    if(canPlay)click='playSong('+i+')';
    else if(isPlaylist&&bid)click="viewPlaylist('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    else if(isAlbum&&bid)click="viewAlbum('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    else if((isArtist||bid)&&!isPlaylist&&!isAlbum)click="viewArtist('"+bid+"','"+encodeURIComponent(thumb)+"','"+encodeURIComponent(s.title||'')+"')";
    var badge=(type!=='song'&&type!=='video')?'<span class="rr-badge">'+type+'</span>':'';
    return '<div class="result-row'+(i===songIdx?' active':'')+'\" onclick="'+click+'">' +
      '<div class="rr-num">'+(i+1)+'</div>'+
      '<div class="rr-play"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>'+
      '<img class="rr-thumb" src="'+thumb+'" loading="lazy">'+
      '<div class="rr-info"><div class="result-row-title">'+esc(s.title||s.name||'Unknown')+'</div><div class="result-row-sub">'+esc(artist)+'</div></div>'+
      badge+
      '<div class="rr-dur">'+esc(s.duration||'')+'</div>'+
      (canPlay?'<div class="rr-actions"><button class="rr-btn" onclick="event.stopPropagation();dlSong('+i+')" title="Download"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></div>':'')+
      '</div>';
  }).join('');
}

function goBack(){lastQuery?doSearch(lastQuery,currentFilter):showEmptyState()}
function setLoading(v){document.getElementById('loading').style.display=v?'block':'none'}
function setError(msg){document.getElementById('results').innerHTML='<div class="empty-state"><svg class="empty-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><h3>Error</h3><p>'+esc(msg)+'</p></div>'}

async function loadDiscover(){
  document.getElementById('discoverPane').innerHTML='<div class="loading-dots"><span></span><span></span><span></span></div>';
  try{
    var res=await fetch('/api/home');
    var data=await res.json();
    var items=data.data||data.results||data.content||[];
    var html='<div class="section-title">Discover Music</div>';
    items.slice(0,3).forEach(function(section){
      if(section.title)html+='<div class="section-sub">'+esc(section.title)+'</div>';
      var tracks=(section.contents||[]).filter(function(x){return x.videoId});
      if(tracks.length){
        var startIdx=songs.length;songs=songs.concat(tracks);
        html+='<div class="result-list">'+renderResultsHtml(songs.slice(startIdx))+'</div>';
      }
    });
    document.getElementById('discoverPane').innerHTML=html||'<div class="empty-state"><h3>Nothing to discover</h3></div>';
  }catch(e){document.getElementById('discoverPane').innerHTML='<div class="empty-state"><h3>Could not load discover</h3></div>';}
}

async function loadCharts(){
  document.getElementById('chartsPane').innerHTML='<div class="loading-dots"><span></span><span></span><span></span></div>';
  try{
    var res=await fetch('/api/charts?country=US');
    var data=await res.json();
    var tracks=data.songs||data.results||data.data||[];
    songs=tracks;
    var html='<div class="section-title">Top Charts</div><div class="result-list fade-up">'+renderResultsHtml(tracks)+'</div>';
    document.getElementById('chartsPane').innerHTML=html||'<div class="empty-state"><h3>No charts data</h3></div>';
  }catch(e){document.getElementById('chartsPane').innerHTML='<div class="empty-state"><h3>Could not load charts</h3></div>';}
}

var apiCfg={
  search:{inputs:[{n:'q',p:'Query',v:'coldplay'},{n:'filter',p:'Filter (songs/albums/artists)',v:'songs'}],url:'/api/search'},
  stream:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/stream'},
  download:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'},{n:'title',p:'Song title',v:'My Song'}],url:'/api/download'},
  song:{inputs:[{n:'videoId',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/songs/{videoId}'},
  album:{inputs:[{n:'browseId',p:'Album ID',v:'MPREb_PvMNqFUp1oW'}],url:'/api/albums/{browseId}'},
  artist:{inputs:[{n:'browseId',p:'Artist ID',v:'UCIaFw5VBEK8qaW6nRpx_qnw'}],url:'/api/artists/{browseId}'},
  playlist:{inputs:[{n:'playlistId',p:'Playlist ID',v:'RDCLAK5uy_k'}],url:'/api/playlists/{playlistId}'},
  lyrics:{inputs:[{n:'title',p:'Song title',v:'Yellow'},{n:'artist',p:'Artist',v:'Coldplay'}],url:'/api/lyrics'},
  charts:{inputs:[{n:'country',p:'Country',v:'US'}],url:'/api/charts'},
  related:{inputs:[{n:'id',p:'Video ID',v:'dQw4w9WgXcQ'}],url:'/api/related/{id}'},
};

var endpoints=[
  {m:'GET',p:'/api/search',q:'?q=coldplay&filter=songs'},
  {m:'GET',p:'/api/stream',q:'?id=dQw4w9WgXcQ'},
  {m:'GET',p:'/api/download',q:'?id=dQw4w9WgXcQ&title=Song+Name'},
  {m:'GET',p:'/api/proxy',q:'?url=AUDIO_URL'},
  {m:'GET',p:'/api/lyrics',q:'?title=Yellow&artist=Coldplay'},
  {m:'GET',p:'/api/songs/{videoId}',q:''},
  {m:'GET',p:'/api/albums/{browseId}',q:''},
  {m:'GET',p:'/api/artists/{browseId}',q:''},
  {m:'GET',p:'/api/playlists/{playlistId}',q:''},
  {m:'GET',p:'/api/charts',q:'?country=US'},
  {m:'GET',p:'/api/related/{id}',q:''},
  {m:'GET',p:'/api/home',q:''},
  {m:'GET',p:'/api/music/find',q:'?name=Yellow&artist=Coldplay'},
  {m:'GET',p:'/health',q:''},
];

function renderApiPane(){
  var html='<div class="api-tab">';
  html+='<div class="api-section"><div class="api-title">Test Endpoints</div>';
  html+='<div class="api-row">';
  html+='<select class="api-select" id="apiEp" onchange="apiUpdateInputs()">'+Object.keys(apiCfg).map(function(k){return'<option value="'+k+'">'+k+'</option>'}).join('')+'</select>';
  html+='</div>';
  html+='<div id="apiInputs" class="api-row"></div>';
  html+='<div class="api-url" id="apiUrl"></div>';
  html+='<button class="api-btn" onclick="apiTest()">Send Request</button>';
  html+='<div class="api-response" id="apiRes" style="margin-top:12px;display:none"><pre id="apiResPre"></pre></div>';
  html+='</div>';
  html+='<div class="api-section"><div class="api-title">All Endpoints</div><div class="endpoint-list">';
  html+=endpoints.map(function(ep,i){
    return'<div class="ep-row"><span class="ep-method">'+ep.m+'</span><span class="ep-path">'+ep.p.replace(/\\{([^}]+)\\}/g,'<span class="param">{$1}</span>')+'<span style="color:var(--dim)">'+ep.q+'</span></span><button class="ep-copy" id="epc'+i+'" onclick="copyEp(\''+ep.p+ep.q+'\',\'epc'+i+'\')"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>';
  }).join('');
  html+='</div></div></div>';
  document.getElementById('apiPane').innerHTML=html;
  apiUpdateInputs();
}

function apiUpdateInputs(){
  var ep=document.getElementById('apiEp').value,c=apiCfg[ep];
  document.getElementById('apiInputs').innerHTML=c.inputs.map(function(i){
    return'<input class="api-input" id="api_'+i.n+'" placeholder="'+i.p+'" value="'+i.v+'" oninput="apiUpdateUrl()">';
  }).join('');
  apiUpdateUrl();
}

function apiUpdateUrl(){
  var ep=document.getElementById('apiEp').value,c=apiCfg[ep],url=c.url,params=new URLSearchParams();
  c.inputs.forEach(function(i){
    var v=document.getElementById('api_'+i.n)?.value||i.v;
    if(v){if(url.includes('{'+i.n+'}'))url=url.replace('{'+i.n+'}',encodeURIComponent(v));else params.append(i.n,v)}
  });
  var qs=params.toString();if(qs)url+='?'+qs;
  document.getElementById('apiUrl').textContent='GET '+url;
}

async function apiTest(){
  var ep=document.getElementById('apiEp').value,c=apiCfg[ep],url=c.url,params=new URLSearchParams();
  c.inputs.forEach(function(i){
    var v=document.getElementById('api_'+i.n)?.value||i.v;
    if(v){if(url.includes('{'+i.n+'}'))url=url.replace('{'+i.n+'}',encodeURIComponent(v));else params.append(i.n,v)}
  });
  var qs=params.toString();if(qs)url+='?'+qs;
  var resEl=document.getElementById('apiRes');resEl.style.display='block';
  document.getElementById('apiResPre').textContent='Loading...';
  if(ep==='download'){showToast('Triggering download...');var a=document.createElement('a');a.href=url;document.body.appendChild(a);a.click();document.body.removeChild(a);document.getElementById('apiResPre').textContent='Download triggered via browser';return;}
  try{var r=await fetch(url);var d=await r.json();document.getElementById('apiResPre').textContent=JSON.stringify(d,null,2);}
  catch(e){document.getElementById('apiResPre').textContent='Error: '+e.message;}
}

function copyEp(path,id){
  navigator.clipboard.writeText(window.location.origin+path).then(function(){
    var el=document.getElementById(id);el.classList.add('ok');
    setTimeout(function(){el.classList.remove('ok')},2000);
  });
}

function showToast(msg){
  var t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._tid);
  t._tid=setTimeout(function(){t.classList.remove('show')},2500);
}

function esc(t){var d=document.createElement('div');d.textContent=t||'';return d.innerHTML}

window.onerror=function(){return true};
window.onunhandledrejection=function(e){e.preventDefault()};
</script>
</body>
</html>`;
