import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  Upload,
  Trash2,
  RefreshCw,
  LogOut,
  Copy,
  ExternalLink,
  Search,
  ShieldCheck,
  FileArchive,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react';
import './styles.css';

// ============================================================
// NOGIE ADMIN PANEL - FINAL STABLE CONFIG
// Uses the user's existing Vercel variable names WITHOUT '_'.
// Supported names:
//   VITESUPABASEURL
//   VITESUPABASEANONKEY
// The normal VITE_* names are also accepted as a fallback.
// ============================================================

const SUPABASE_URL =
  import.meta.env.VITESUPABASEURL ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://qsuggbbmqsxpucxsiwdx.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITESUPABASEANONKEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

const BUCKET = 'downloads';

// Do not call createClient with an empty key: that caused the old blank screen.
const supabase = SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function ConfigError() {
  return (
    <div className="login">
      <div className="loginCard">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <b>NOGIE</b>
            <span>DOWNLOAD CENTER</span>
          </div>
        </div>
        <div className="secure">
          <AlertCircle size={18} /> Configuration required
        </div>
        <h1>Supabase key missing</h1>
        <p>
          The admin panel could not find the Supabase public/publishable key.
        </p>
        <div className="error" style={{ marginTop: 18 }}>
          <AlertCircle size={16} />
          Vercel variable required: <b>VITESUPABASEANONKEY</b>
        </div>
        <p style={{ marginTop: 16, fontSize: 12 }}>
          Add the variable in Vercel, then redeploy this project.
        </p>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data?.session) {
        onLogin(data.session);
      } else {
        setError('Login succeeded but no session was returned. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!supabase) return;
    const target = email.trim();

    if (!target) {
      setError('Enter your admin email first.');
      return;
    }

    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      const redirectTo = `${window.location.origin}/`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(target, {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setResetSent(true);
      }
    } catch (err) {
      setError(err?.message || 'Unable to send password recovery email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="loginCard">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <b>NOGIE</b>
            <span>DOWNLOAD CENTER</span>
          </div>
        </div>

        <div className="secure">
          <ShieldCheck size={18} /> Admin access
        </div>

        <h1>Welcome back</h1>
        <p>Manage files in the public download bucket.</p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 0,
                  background: 'transparent',
                  color: '#7d858a',
                  cursor: 'pointer',
                  padding: 5,
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="success" style={{ marginTop: 10 }}>
              <CheckCircle2 size={16} /> Recovery email sent. Check your inbox.
            </div>
          )}

          <button className="primary" disabled={loading} type="submit">
            <LockKeyhole size={16} />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <button
            className="ghost"
            type="button"
            onClick={resetPassword}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
          >
            <KeyRound size={16} /> Forgot password
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('getSession:', error);
        setSession(null);
        return;
      }
      setSession(data?.session || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) loadFiles();
  }, [session]);

  const notify = (type, text) => {
    setNotice({ type, text });
    window.clearTimeout(window.__nogieNoticeTimer);
    window.__nogieNoticeTimer = window.setTimeout(() => setNotice(null), 3500);
  };

  const loadFiles = async () => {
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error) {
        notify('error', error.message);
        return;
      }

      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      notify('error', err?.message || 'Unable to load files.');
    } finally {
      setLoading(false);
    }
  };

  const upload = async (e) => {
    if (!supabase) return;

    const list = Array.from(e.target.files || []);
    if (!list.length) return;

    setUploading(true);

    try {
      for (const file of list) {
        const { error } = await supabase.storage.from(BUCKET).upload(file.name, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type || undefined,
        });

        if (error) {
          notify('error', `${file.name}: ${error.message}`);
        } else {
          notify('ok', `${file.name} uploaded/replaced`);
        }
      }

      await loadFiles();
    } catch (err) {
      notify('error', err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = async (name) => {
    if (!supabase) return;
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      const { error } = await supabase.storage.from(BUCKET).remove([name]);
      if (error) {
        notify('error', error.message);
      } else {
        notify('ok', 'File deleted');
        await loadFiles();
      }
    } catch (err) {
      notify('error', err?.message || 'Delete failed.');
    }
  };

  const publicUrl = (name) =>
    supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      notify('ok', 'Public URL copied');
    } catch {
      notify('error', 'Clipboard access was blocked by the browser.');
    }
  };

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) notify('error', error.message);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, search]);

  const totalBytes = useMemo(
    () => files.reduce((sum, f) => sum + Number(f.metadata?.size || 0), 0),
    [files]
  );

  if (!supabase) return <ConfigError />;
  if (!session) return <Login onLogin={setSession} />;

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <b>NOGIE</b>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="headActions">
          <label className="upload">
            <Upload size={17} />
            {uploading ? 'Uploading…' : 'Upload files'}
            <input type="file" multiple onChange={upload} disabled={uploading} />
          </label>

          <button className="ghost" onClick={loadFiles} disabled={loading || uploading}>
            <RefreshCw size={17} className={loading ? 'spin' : ''} />
            Refresh
          </button>

          <button className="ghost" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">
              <ShieldCheck size={15} /> SECURE FILE MANAGEMENT
            </div>
            <h1>Download Center Admin</h1>
            <p>Upload, replace, copy public links, and remove files from Supabase Storage.</p>
          </div>

          <div className="stats">
            <div>
              <HardDrive />
              <strong>{files.length}</strong>
              <span>Files</span>
            </div>
            <div>
              <FileArchive />
              <strong>{(totalBytes / 1024 / 1024).toFixed(1)} MB</strong>
              <span>Storage listed</span>
            </div>
          </div>
        </section>

        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="bucket">
            Bucket: <b>{BUCKET}</b>
          </span>
        </div>

        <section className="table">
          {loading ? (
            <div className="empty">Loading files…</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No files found.</div>
          ) : (
            filtered.map((f) => {
              const url = publicUrl(f.name);
              const size = f.metadata?.size
                ? `${(Number(f.metadata.size) / 1024 / 1024).toFixed(2)} MB`
                : '—';

              return (
                <div className="row" key={f.id || f.name}>
                  <div className="fileIcon">
                    <FileArchive size={21} />
                  </div>

                  <div className="fileName">
                    <b>{f.name}</b>
                    <span>
                      {size}
                      {f.created_at ? ` · ${new Date(f.created_at).toLocaleString()}` : ''}
                    </span>
                  </div>

                  <div className="actions">
                    <button title="Copy public URL" onClick={() => copy(url)}>
                      <Copy size={17} />
                    </button>
                    <a title="Open" href={url} target="_blank" rel="noreferrer">
                      <ExternalLink size={17} />
                    </a>
                    <button
                      className="danger"
                      title="Delete"
                      onClick={() => remove(f.name)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {notice && (
        <div className={`notice ${notice.type}`}>
          {notice.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
          {notice.text}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
