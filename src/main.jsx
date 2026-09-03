import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  ArrowLeft, ArrowRight, Download, ExternalLink, Folder, Search,
  Settings2, SunMoon, FileArchive, ShieldCheck, Smartphone, Wrench,
  HardDriveDownload, Package, TerminalSquare, Sparkles, CheckCircle2,
  Copy, Check, X
} from "lucide-react";
import "./styles.css";

const folders = [
  {id:"tools", name:"Tools", icon:Wrench, description:"MediaTek, Platform Tools + scrcpy utilities."},
  {id:"drivers", name:"Drivers", icon:ShieldCheck, description:"Unisoc, Android USB and Universal ADB drivers."},
  {id:"rooting", name:"Rooting Files", icon:Smartphone, description:"APatch, KernelSU Next and Root Checker files."},
  {id:"backup", name:"Backup", icon:HardDriveDownload, description:"Backup packages — ready for future additions."},
  {id:"miunlock", name:"MiUnlock-Client", icon:Package, description:"MiUnlock package — ready for future additions."}
];

const items = [
  {id:1, folder:"tools", name:"plat-tools-scrcpy", version:"V10", size:"14.09 MB", type:"ZIP", tags:["ADB","FASTBOOT","SCRCPY"], description:"Complete Platform Tools + scrcpy folder from ROOT-TOOL-NOGIE.V10.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/plat-tools-scrcpy.zip"},
  {id:2, folder:"tools", name:"MediaTek", version:"V10", size:"EXE", type:"EXE", tags:["MTK","TOOL"], description:"MediaTek utility package from ROOT-TOOL-NOGIE.V10.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/Mediatek.exe"},
  {id:3, folder:"tools", name:"ROOT-TOOL-NOGIE.V10 Full Package", version:"V10", size:"83.2 MB", type:"ZIP", tags:["FULL","TOOLS"], description:"Complete original NOGIE V10 package bundled as one ZIP.", download:"https://github.com/nogiezxc/nogie-download-center/releases/download/v10.0.0/ROOT-TOOL-NOGIE.V10-Full-Package.zip"},
  {id:4, folder:"drivers", name:"UnisocDriver", version:"V10", size:"8.6 MB", type:"ZIP", tags:["UNISOC","SPD","DRIVER"], description:"Complete Unisoc / SPD driver folder including installers and driver files.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/UnisocDriver.zip"},
  {id:5, folder:"drivers", name:"Android USB Driver", version:"V10", size:"8.3 MB", type:"ZIP", tags:["ADB","USB","DRIVER"], description:"Android USB driver folder with 32-bit and 64-bit support files.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/usb_driver.zip"},
  {id:6, folder:"drivers", name:"Universal ADB Driver", version:"V10", size:"16 MB", type:"MSI", tags:["ADB","DRIVER"], description:"Universal ADB Driver installer package.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/UniversalAdbDriverSetup.msi"},
  {id:7, folder:"rooting", name:"Root Manager", version:"V10", size:"26.9 MB", type:"ZIP", tags:["APATCH","KERNELSU","ROOT"], description:"Root Manager folder containing APatch, KernelSU Next and Root Checker APK files.", download:"https://qsuggbbmqsxpucxsiwdx.supabase.co/storage/v1/object/public/downloads/Root%20Manager.zip"}
];

const external = [
  {name:"Ultraviewer", url:"#", icon:TerminalSquare},
  {name:"MTK / QCOM / ADB Driver", url:"#", icon:ShieldCheck},
  {name:"Android Utility", url:"#", icon:Smartphone},
  {name:"Unlocktool", url:"#", icon:Settings2}
];

function App(){
  const [folder, setFolder] = useState(null);
  const [query, setQuery] = useState("");
  const [light, setLight] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const folderInfo = folder ? folders.find(x=>x.id===folder) : null;
  const visibleItems = useMemo(() => {
    let list = folder ? items.filter(x=>x.folder===folder) : items;
    const q = query.trim().toLowerCase();
    if(q) list = list.filter(x => [x.name,x.version,x.type,x.description,...x.tags].join(" ").toLowerCase().includes(q));
    return list;
  }, [folder, query]);

  const openFolder = id => { setFolder(id); setQuery(""); window.scrollTo({top:0, behavior:"smooth"}); };
  const goHome = () => { setFolder(null); setQuery(""); window.scrollTo({top:0, behavior:"smooth"}); };
  const showNotice = text => { setNotice(text); setTimeout(()=>setNotice(""), 2600); };

  const copySite = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false),1800); }
    catch { showNotice("Copy is not available in this browser."); }
  };

  return (
    <div className={light ? "app light" : "app"}>
      <header className="topbar">
        <div className="topbarInner">
          <button className="brand" onClick={goHome} aria-label="NOGIE Download Center home">
            <span className="brandIcon"><Download size={18}/></span>
            <span className="brandText"><b>NOGIE</b><small>DOWNLOAD CENTER</small></span>
          </button>
          <div className="topActions">
            <label className="search">
              <Search size={16}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tools, drivers, files..." />
              {query && <button className="clearSearch" onClick={()=>setQuery("")} aria-label="Clear search"><X size={14}/></button>}
            </label>
            <button className="iconBtn" onClick={()=>setLight(v=>!v)} title="Toggle theme"><SunMoon size={18}/></button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="heroCopy">
            <div className="eyebrow"><Sparkles size={13}/> ANDROID TOOL REPOSITORY</div>
            <h1>{folderInfo ? folderInfo.name : "NOGIE Download Center"}</h1>
            <p className="subtitle">{folderInfo ? folderInfo.description : "A clean, fast download hub for Android rooting, repair, drivers and utilities."}</p>
            <div className="heroBadges"><span><CheckCircle2 size={13}/> Verified packages</span><span>V10 Collection</span></div>
          </div>
          <div className="stats">
            <div><b>{items.length}</b><span>files</span></div>
            <div><b>{folders.filter(f=>items.some(x=>x.folder===f.id)).length}</b><span>categories</span></div>
          </div>
        </section>

        {folder && <button className="backBtn" onClick={goHome}><ArrowLeft size={16}/> Back to folders</button>}

        {!folder ? (
          <>
            <div className="sectionLabel">BROWSE COLLECTION</div>
            <div className="folderGrid">
              {folders.map(f=>{
                const Icon=f.icon;
                const count=items.filter(x=>x.folder===f.id).length;
                return <button className={`folderCard ${count===0 ? "disabledCard" : ""}`} key={f.id} onClick={()=>count && openFolder(f.id)} disabled={!count}>
                  <span className="folderIcon"><Icon size={20}/></span>
                  <span className="folderInfo"><b>{f.name}</b><small>{f.description}</small></span>
                  <span className="folderBottom"><span>{count ? `${count} ${count===1?"file":"files"}` : "Coming soon"}</span><ArrowRight size={17}/></span>
                </button>
              })}
            </div>
            {query && <SearchSection items={visibleItems}/>} 
            {!query && <ExternalSources items={external}/>} 
          </>
        ) : (
          <>
            <div className="sectionBar"><div className="sectionLabel">{folderInfo?.name.toUpperCase()}</div><span>{visibleItems.length} files</span></div>
            {visibleItems.length ? <div className="itemGrid">{visibleItems.map(item=><FileCard key={item.id} item={item} onDownload={showNotice}/>)}</div> : <Empty/>}
          </>
        )}
      </main>

      <footer><div><b>NOGIE Download Center</b><span>•</span> V2 UI</div><button onClick={copySite}>{copied ? <><Check size={13}/> Copied</> : <><Copy size={13}/> Copy site link</>}</button></footer>
      {notice && <div className="toast"><CheckCircle2 size={16}/> {notice}</div>}
    </div>
  );
}

function SearchSection({items}){
  return <section className="searchResults"><div className="sectionBar"><div className="sectionLabel">SEARCH RESULTS</div><span>{items.length} matches</span></div>{items.length ? <div className="itemGrid">{items.map(item=><FileCard key={item.id} item={item}/>)}</div> : <Empty/>}</section>
}

function ExternalSources({items}){
  return <section className="externalSection"><div className="sectionBar"><div className="sectionLabel">EXTERNAL SOURCES</div><span>Quick links</span></div><div className="externalGrid">{items.map(x=>{const Icon=x.icon;return <a className="externalCard" href={x.url} key={x.name} onClick={e=>x.url==="#"&&e.preventDefault()}><span className="externalIcon"><Icon size={17}/></span><span><b>{x.name}</b><small>External resource</small></span><ExternalLink size={15}/></a>})}</div></section>
}

function FileCard({item, onDownload}){
  return <article className="fileCard">
    <div className="fileTop"><span className="fileIcon"><FileArchive size={20}/></span><span className="fileType">{item.type}</span></div>
    <h3>{item.name}</h3>
    <p>{item.description}</p>
    <div className="tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div>
    <div className="meta"><span>v{item.version}</span><span>{item.size}</span></div>
    <a className="downloadBtn" href={item.download} onClick={()=>onDownload?.(`Starting ${item.name} download...`)}><Download size={16}/> Download</a>
  </article>
}

function Empty(){return <div className="empty"><Search size={25}/><b>No files found</b><span>Try another search term.</span></div>}

createRoot(document.getElementById("root")).render(<App/>);
