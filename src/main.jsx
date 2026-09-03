import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  ArrowLeft, ArrowRight, Download, ExternalLink, Folder, Search,
  Settings2, SunMoon, FileArchive, ShieldCheck, Smartphone, Wrench,
  HardDriveDownload, Package, TerminalSquare
} from "lucide-react";
import "./styles.css";

const folders = [
  {id:"tools", name:"Tools", count:3, icon:Wrench, description:"MediaTek, Platform Tools + scrcpy utilities."},
  {id:"drivers", name:"Drivers", count:3, icon:ShieldCheck, description:"Unisoc, Android USB and Universal ADB drivers."},
  {id:"rooting", name:"Rooting Files", count:1, icon:Smartphone, description:"Root Manager package containing APatch and KernelSU files."},
  {id:"backup", name:"Backup", count:0, icon:HardDriveDownload, description:"Backup packages — ready for future additions."},
  {id:"miunlock", name:"MiUnlock-Client", count:0, icon:Package, description:"MiUnlock package — ready for future additions."}
];

const items = [
  {id:1, folder:"tools", name:"plat-tools-scrcpy", version:"V10", size:"14.5 MB", type:"ZIP", tags:["ADB","FASTBOOT","SCRCPY"], description:"Complete Platform Tools + scrcpy folder from ROOT-TOOL-NOGIE.V10.", download:"/downloads/NOGIE-plat-tools-scrcpy.zip"},
  {id:2, folder:"tools", name:"MediaTek", version:"V10", size:"9.0 MB", type:"ZIP", tags:["MTK","TOOL"], description:"MediaTek utility package from ROOT-TOOL-NOGIE.V10.", download:"/downloads/Mediatek-NOGIE.zip"},
  {id:3, folder:"tools", name:"ROOT-TOOL-NOGIE.V10 Full Package", version:"V10", size:"83.2 MB", type:"ZIP", tags:["FULL","TOOLS"], description:"Complete original NOGIE V10 package bundled as one ZIP.", download:"/downloads/ROOT-TOOL-NOGIE.V10-Full-Package.zip"},
  {id:4, folder:"drivers", name:"UnisocDriver", version:"V10", size:"8.5 MB", type:"ZIP", tags:["UNISOC","SPD","DRIVER"], description:"Complete Unisoc / SPD driver folder including installers and driver files.", download:"/downloads/NOGIE-UnisocDriver.zip"},
  {id:5, folder:"drivers", name:"Android USB Driver", version:"V10", size:"8.3 MB", type:"ZIP", tags:["ADB","USB","DRIVER"], description:"Android USB driver folder with 32-bit and 64-bit support files.", download:"/downloads/NOGIE-Android-USB-Driver.zip"},
  {id:6, folder:"drivers", name:"Universal ADB Driver", version:"V10", size:"15.9 MB", type:"ZIP", tags:["ADB","DRIVER"], description:"Universal ADB Driver installer package.", download:"/downloads/UniversalAdbDriverSetup-NOGIE.zip"},
  {id:7, folder:"rooting", name:"Root Manager", version:"V10", size:"26.9 MB", type:"ZIP", tags:["APATCH","KERNELSU","ROOT"], description:"Root Manager folder containing APatch, KernelSU Next and Root Checker APK files.", download:"/downloads/NOGIE-Root-Manager.zip"}
];

const external = [
  {name:"Ultraviewer", url:"#", icon:TerminalSquare},
  {name:"MTK / QCOM / ADB Driver", url:"#", icon:ShieldCheck},
  {name:"Android Utility", url:"#", icon:Smartphone},
  {name:"Unlocktool", url:"#", icon:Settings2},
  {name:"Driver Installer", url:"#", icon:ShieldCheck}
];

function App(){
  const [folder, setFolder] = useState(null);
  const [query, setQuery] = useState("");
  const [light, setLight] = useState(false);

  const visibleItems = useMemo(() => {
    let list = folder ? items.filter(x=>x.folder===folder) : items;
    const q = query.trim().toLowerCase();
    if(q) list = list.filter(x =>
      [x.name,x.version,x.type,x.description,...x.tags].join(" ").toLowerCase().includes(q)
    );
    return list;
  }, [folder, query]);

  const title = folder ? folders.find(x=>x.id===folder)?.name : "Files";

  return (
    <div className={light ? "app light" : "app"}>
      <header className="topbar">
        <div className="brand"><div className="brandIcon"><Download size={18}/></div><span>NOGIE Download Center</span></div>
        <div className="topActions">
          <label className="search">
            <Search size={17}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search files..." />
          </label>
          <button className="iconBtn" onClick={()=>setLight(v=>!v)} title="Toggle theme"><SunMoon size={18}/></button>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <p className="eyebrow">ANDROID TOOL REPOSITORY</p>
            <h1>{folder ? title : "Files"}</h1>
            <p className="subtitle">
              {folder ? folders.find(x=>x.id===folder)?.description : "Your central download hub for rooting, repair and Android utilities."}
            </p>
          </div>
          <div className="countPill">{folder ? visibleItems.length : folders.length} {folder ? "files" : "items"}</div>
        </section>

        {folder && (
          <button className="backBtn" onClick={()=>{setFolder(null); setQuery("")}}>
            <ArrowLeft size={16}/> Back to folders
          </button>
        )}

        {!folder ? (
          <>
            <div className="folderList">
              {folders.map(f=>{
                const Icon=f.icon;
                return (
                  <button className="folderRow" key={f.id} onClick={()=>setFolder(f.id)}>
                    <span className="folderIcon"><Folder size={20}/></span>
                    <span className="folderInfo"><b>{f.name}</b><small>{f.description}</small></span>
                    <span className="rowCount">{items.filter(x=>x.folder===f.id).length || f.count} items</span>
                    <ArrowRight className="rowArrow" size={19}/>
                  </button>
                )
              })}
            </div>
            {query && visibleItems.length > 0 && (
              <section className="searchResults">
                <div className="sectionTitle">Search results</div>
                <div className="itemGrid">{visibleItems.map(item=><FileCard key={item.id} item={item}/>)}</div>
              </section>
            )}
            {query && visibleItems.length === 0 && <Empty/>}
          </>
        ) : (
          <div className="itemGrid">{visibleItems.map(item=><FileCard key={item.id} item={item}/>)}</div>
        )}

        {!folder && !query && (
          <section className="externalSection">
            <div className="sectionHeader"><span>EXTERNAL SOURCES</span></div>
            <div className="externalGrid">
              {external.map(x=>{
                const Icon=x.icon;
                return <a className="externalCard" href={x.url} key={x.name} >
                  <span className="externalIcon"><Icon size={17}/></span><span>{x.name}</span><ExternalLink size={15}/>
                </a>
              })}
            </div>
          </section>
        )}
      </main>
      <footer>NOGIE Download Center <span>•</span> v0.1.0</footer>
    </div>
  )
}

function FileCard({item}){
  return <article className="fileCard">
    <div className="fileTop"><span className="fileIcon"><FileArchive size={20}/></span><span className="fileType">{item.type}</span></div>
    <h3>{item.name}</h3>
    <p>{item.description}</p>
    <div className="tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div>
    <div className="meta"><span>v{item.version}</span><span>{item.size}</span></div>
    <a className="downloadBtn" href={item.download} ><Download size={16}/> Download</a>
  </article>
}

function Empty(){
  return <div className="empty"><Search size={25}/><b>No files found</b><span>Try another search term.</span></div>
}

createRoot(document.getElementById("root")).render(<App/>);
