import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Check,
  ChevronRight,
  ExternalLink,
  Github,
  Globe,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Link as LinkIcon,
  Menu,
  MoreHorizontal,
  Share2,
  Trash2,
  Upload,
  UserRound,
  X,
  Copy,
  Download,
  Eye,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Database,
  LogIn,
  LogOut,
  UserPlus,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import './style.css';

const KEY = 'proofpage-v1';
const TOKEN_KEY = 'proofpage_token';

const demo = {
  profile: {
    name: 'Alex Morgan',
    handle: 'alexbuilds',
    role: 'Full-stack developer & product builder',
    bio: 'I turn complex problems into thoughtful digital products. Here’s the work, the decisions, and the evidence behind what I build.',
    location: 'San Francisco, CA',
    email: 'hello@example.com',
    github: 'https://github.com',
    website: 'https://example.com',
    avatar: ''
  },
  projects: [
    {
      id: 'a1',
      title: 'Orbit Analytics',
      subtitle: 'A clearer way to understand product growth.',
      category: 'Full-stack',
      year: '2026',
      status: 'Shipped',
      description:
        'A lightweight analytics workspace for teams that want actionable insights without the noise. Designed and engineered from discovery to deployment.',
      problem:
        'Small teams had their product data scattered across multiple dashboards, making it hard to identify meaningful trends.',
      solution:
        'Built a unified, lightweight dashboard with reusable metric definitions, fast filtering, and shareable reporting views.',
      impact: 'Reduced the time needed to prepare weekly reports in a sample workflow.',
      stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Recharts'],
      github: 'https://github.com',
      demo: 'https://example.com',
      image: '',
      color: 'blue',
      metrics: [
        { value: '42%', label: 'Faster reporting' },
        { value: '3', label: 'Data sources' },
        { value: '1.2s', label: 'Page load' }
      ],
      featured: true
    },
    {
      id: 'a2',
      title: 'Forma Studio',
      subtitle: 'Brand-consistent visuals in a few clicks.',
      category: 'Product design',
      year: '2026',
      status: 'Shipped',
      description:
        'A template-first creative tool that helps independent creators publish beautiful, cohesive content.',
      problem: 'Creators waste time recreating the same layouts every week.',
      solution: 'Created reusable brand presets, an intuitive editor, and one-click image export.',
      impact: 'Streamlined the repeat content creation workflow.',
      stack: ['React', 'Canvas API', 'CSS', 'Vite'],
      github: 'https://github.com',
      demo: 'https://example.com',
      image: '',
      color: 'yellow',
      metrics: [
        { value: '12', label: 'Templates' },
        { value: '4:5', label: 'Export ratio' }
      ],
      featured: false
    },
    {
      id: 'a3',
      title: 'Relay API',
      subtitle: 'Developer-friendly event delivery.',
      category: 'Backend',
      year: '2025',
      status: 'In progress',
      description:
        'An event delivery service built around clear observability and predictable retry behavior.',
      problem: 'Debugging webhook deliveries was time-consuming and difficult to reproduce.',
      solution: 'Designed a transparent event log and a replay-friendly delivery pipeline.',
      impact: 'Prototype with a documented test plan.',
      stack: ['Node.js', 'Redis', 'PostgreSQL'],
      github: 'https://github.com',
      demo: '',
      image: '',
      color: 'beige',
      metrics: [{ value: '100+', label: 'Test events' }],
      featured: false
    }
  ]
};

const emptyProject = () => ({
  id:
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'p-' + Math.random().toString(36).substring(2, 9),
  title: '',
  subtitle: '',
  category: 'Full-stack',
  year: String(new Date().getFullYear()),
  status: 'In progress',
  description: '',
  problem: '',
  solution: '',
  impact: '',
  stack: [],
  github: '',
  demo: '',
  image: '',
  color: 'blue',
  metrics: [],
  featured: false
});

function getPublicHandleFromUrl() {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const qHandle = searchParams.get('u') || searchParams.get('p') || searchParams.get('profile');
  if (qHandle) return qHandle.toLowerCase().trim();

  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2 && (parts[0] === 'p' || parts[0] === 'u')) {
    return parts[1].toLowerCase().trim();
  }
  return null;
}

function App() {
  // Routing state: mode can be 'workspace' or 'public'
  const [route, setRoute] = useState(() => {
    const handle = getPublicHandleFromUrl();
    return handle ? { mode: 'public', handle } : { mode: 'workspace', handle: null };
  });

  // Auth & Cloud state
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [dbStatus, setDbStatus] = useState('local'); // 'connected' | 'saving' | 'local'
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Workspace state
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : demo;
    } catch {
      return demo;
    }
  });

  const [view, setView] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('All projects');
  const fileInput = useRef();

  const notify = (s) => {
    setToast(s);
    setTimeout(() => setToast(''), 3500);
  };

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const h = getPublicHandleFromUrl();
      if (h) {
        setRoute({ mode: 'public', handle: h });
      } else {
        setRoute({ mode: 'workspace', handle: null });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check login on load
  useEffect(() => {
    if (!token) {
      setDbStatus('local');
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          setDbStatus('connected');
          if (res.profile && res.projects) {
            setData({ profile: res.profile, projects: res.projects });
          }
        } else {
          setToken('');
          localStorage.removeItem(TOKEN_KEY);
          setDbStatus('local');
        }
      })
      .catch(() => {
        setDbStatus('local');
      });
  }, [token]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Local storage error', e);
    }
  }, [data]);

  // Sync to Neon DB helper
  const syncToNeon = async (newData) => {
    if (!token) return;
    setDbStatus('saving');
    try {
      const res = await fetch('/api/portfolio/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: newData.profile,
          projects: newData.projects
        })
      });
      const json = await res.json();
      if (res.ok) {
        setDbStatus('connected');
      } else {
        console.warn('DB sync warning:', json.error);
        setDbStatus('local');
      }
    } catch (err) {
      console.error('DB sync error:', err);
      setDbStatus('local');
    }
  };

  const updateProfile = (k, v) => {
    setData((d) => {
      const next = { ...d, profile: { ...d.profile, [k]: v } };
      syncToNeon(next);
      return next;
    });
  };

  const saveProject = (p) => {
    if (!p.title.trim()) return notify('Add a project title first');
    setData((d) => {
      const next = {
        ...d,
        projects: d.projects.some((x) => x.id === p.id)
          ? d.projects.map((x) => (x.id === p.id ? p : x))
          : [p, ...d.projects]
      };
      syncToNeon(next);
      return next;
    });
    setModal(false);
    setEditing(null);
    notify(token ? 'Saved & synced to Neon DB' : 'Project saved locally');
  };

  const deleteProject = (id) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    setData((d) => {
      const next = { ...d, projects: d.projects.filter((p) => p.id !== id) };
      syncToNeon(next);
      return next;
    });
    notify('Project removed');
  };

  const exportData = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `proofpage-${data.profile.handle || 'backup'}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
    notify('Backup downloaded');
  };

  const importData = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (!parsed.profile || !Array.isArray(parsed.projects)) throw Error();
      setData(parsed);
      syncToNeon(parsed);
      notify('Portfolio imported');
    } catch {
      notify('Invalid backup file');
    }
    e.target.value = '';
  };

  const handleShare = async (handleToShare) => {
    const h = handleToShare || data.profile.handle || (user ? user.username : 'alexbuilds');
    const publicUrl = `${window.location.origin}/p/${h}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${data.profile.name || h} · ProofPage`, url: publicUrl });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(publicUrl);
      notify(`Copied public link: ${publicUrl}`);
    } catch {
      notify(`Public URL: ${publicUrl}`);
    }
  };

  const navigateToPublic = (handle) => {
    const targetHandle = handle || data.profile.handle || 'alexbuilds';
    window.history.pushState(null, '', `/p/${targetHandle}`);
    setRoute({ mode: 'public', handle: targetHandle });
  };

  const navigateToWorkspace = () => {
    window.history.pushState(null, '', '/');
    setRoute({ mode: 'workspace', handle: null });
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setUser(null);
    setDbStatus('local');
    notify('Logged out successfully');
  };

  // If viewing a standalone public profile
  if (route.mode === 'public') {
    return (
      <PublicPortfolioStandalone
        handle={route.handle}
        currentUser={user}
        onNavigateHome={navigateToWorkspace}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode: mode || 'login' })}
        notify={notify}
      />
    );
  }

  const categories = ['All projects', ...new Set(data.projects.map((p) => p.category))];
  const visible = data.projects.filter((p) => filter === 'All projects' || p.category === filter);
  const edit = (p) => {
    setEditing(JSON.parse(JSON.stringify(p)));
    setModal(true);
  };

  const publicProfileLink = `${window.location.origin}/p/${data.profile.handle || (user ? user.username : 'alexbuilds')}`;

  return (
    <div className="app">
      <aside className={'sidebar ' + (menu ? 'mobile-open' : '')}>
        <div className="brand" onClick={navigateToWorkspace} style={{ cursor: 'pointer' }}>
          <span className="brand-icon">
            <span />
          </span>
          <span>
            proofpage<span className="brand-dot">.</span>
          </span>
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav">
          <button
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => {
              setView('dashboard');
              setMenu(false);
            }}
          >
            <LayoutGrid size={18} />
            Overview
          </button>
          <button
            className={view === 'projects' ? 'active' : ''}
            onClick={() => {
              setView('projects');
              setMenu(false);
            }}
          >
            <Layers size={18} />
            My projects <span className="nav-count">{data.projects.length}</span>
          </button>
          <button
            className={view === 'profile' ? 'active' : ''}
            onClick={() => {
              setView('profile');
              setMenu(false);
            }}
          >
            <UserRound size={18} />
            Profile settings
          </button>
          <button
            className={view === 'preview' ? 'active' : ''}
            onClick={() => {
              setView('preview');
              setMenu(false);
            }}
          >
            <Eye size={18} />
            Live Preview <ArrowUpRight size={14} className="push" />
          </button>
        </nav>

        <div className="side-bottom">
          <div className="side-promo">
            <div className="promo-stars">✳ ✳</div>
            <strong>
              Your work deserves
              <br />
              to be seen.
            </strong>
            <p>Publish to Neon DB and share your personal URL anywhere.</p>
            <button onClick={() => navigateToPublic(data.profile.handle)}>
              View Public Page <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="side-user">
            <div className="avatar">
              {data.profile.avatar ? <img src={data.profile.avatar} alt="Avatar" /> : initials(data.profile.name)}
            </div>
            <div>
              <strong>{data.profile.name || (user ? user.username : 'Alex Morgan')}</strong>
              <small>@{data.profile.handle || (user ? user.username : 'alexbuilds')}</small>
            </div>
            {user ? (
              <button title="Sign out" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                <LogOut size={17} />
              </button>
            ) : (
              <button
                title="Sign in / Register"
                onClick={() => setAuthModal({ open: true, mode: 'login' })}
                style={{ marginLeft: 'auto' }}
              >
                <LogIn size={17} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMenu(!menu)}>
            <Menu size={22} />
          </button>
          <span className="breadcrumb">
            Workspace <ChevronRight size={14} />{' '}
            <b>
              {view === 'dashboard'
                ? 'Overview'
                : view === 'projects'
                ? 'Projects'
                : view === 'profile'
                ? 'Profile settings'
                : 'Public Preview'}
            </b>
          </span>

          <div className="top-actions">
            {dbStatus === 'connected' ? (
              <span className="db-pill" title="Saved & Synced to Neon PostgreSQL database">
                <span className="db-pill-dot" /> Neon DB Synced
              </span>
            ) : dbStatus === 'saving' ? (
              <span className="db-pill" title="Saving changes to Neon DB">
                <span className="db-pill-dot" style={{ background: '#3b82f6' }} /> Saving...
              </span>
            ) : (
              <span
                className="db-pill local"
                title="Working in local mode. Sign in to sync across devices."
                onClick={() => setAuthModal({ open: true, mode: 'login' })}
                style={{ cursor: 'pointer' }}
              >
                <span className="db-pill-dot" /> Local Mode (Click to Sign In)
              </span>
            )}

            {!user ? (
              <button
                className="outline-btn"
                onClick={() => setAuthModal({ open: true, mode: 'login' })}
              >
                <LogIn size={16} /> Sign In
              </button>
            ) : (
              <button
                className="outline-btn"
                title="Copy shareable public profile link"
                onClick={() => handleShare(data.profile.handle)}
              >
                <Share2 size={16} /> Share Link
              </button>
            )}

            <button className="icon-btn" title="Export portfolio backup" onClick={exportData}>
              <Download size={18} />
            </button>
            <button className="outline-btn" onClick={() => setView('preview')}>
              <Eye size={16} /> Preview
            </button>
            <button className="primary-btn small" onClick={() => edit(emptyProject())}>
              <Plus size={17} /> New project
            </button>
          </div>
        </header>

        <main className="content">
          {view === 'dashboard' && (
            <>
              <div className="eyebrow">
                <span className="sun-icon">✳</span> YOUR CREATIVE WORKSPACE <span className="tiny-line" />
              </div>

              <section className="hero">
                <div className="hero-copy">
                  <div className="hero-chip">
                    <span className="pulse" />
                    {user ? `WELCOME BACK @${user.username}` : 'YOUR PORTFOLIO, REIMAGINED'}
                  </div>
                  <h1>
                    Show the work.
                    <br />
                    <em>Prove the impact.</em>
                  </h1>
                  <p>
                    A beautiful home for everything you build. Go beyond screenshots and show the thinking, technology,
                    and results behind your projects.
                  </p>
                  <div className="hero-actions">
                    <button className="dark-btn" onClick={() => edit(emptyProject())}>
                      Add your next project <ArrowUpRight size={18} />
                    </button>
                    <button className="text-btn" onClick={() => setView('preview')}>
                      View preview <ArrowRight size={18} />
                    </button>
                    <button className="text-btn" onClick={() => navigateToPublic(data.profile.handle)}>
                      Open public page <ExternalLink size={16} style={{ marginLeft: 6 }} />
                    </button>
                  </div>
                </div>

                <div className="hero-art">
                  <div className="art-orbit one" />
                  <div className="art-orbit two" />
                  <div className="art-card card-back">
                    <span>DESIGN • DEVELOP • DEPLOY</span>
                    <div className="art-blocks">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="art-card card-front">
                    <span className="art-top">
                      YOUR WORK, BEAUTIFULLY TOLD <ArrowUpRight size={17} />
                    </span>
                    <div className="art-shape">
                      <div className="art-dot" />
                    </div>
                    <div className="art-lines">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="art-foot">
                      BUILD SOMETHING BRILLIANT <span>↗</span>
                    </span>
                  </div>
                  <span className="sparkle s1">✳</span>
                  <span className="sparkle s2">✦</span>
                </div>
              </section>

              <section className="stats">
                <div>
                  <span className="stat-icon blue">
                    <Layers size={19} />
                  </span>
                  <span>
                    <strong>{data.projects.length.toString().padStart(2, '0')}</strong>
                    <small>Total projects</small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon yellow">
                    <CheckCircle2 size={19} />
                  </span>
                  <span>
                    <strong>
                      {data.projects
                        .filter((p) => p.status === 'Shipped')
                        .length.toString()
                        .padStart(2, '0')}
                    </strong>
                    <small>Shipped projects</small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon cream">
                    <Code2 size={19} />
                  </span>
                  <span>
                    <strong>
                      {new Set(data.projects.flatMap((p) => p.stack || [])).size.toString().padStart(2, '0')}
                    </strong>
                    <small>Technologies used</small>
                  </span>
                </div>
                <div>
                  <span className="stat-icon pink">
                    <Globe size={19} />
                  </span>
                  <span>
                    <strong>
                      {data.projects
                        .filter((p) => p.demo)
                        .length.toString()
                        .padStart(2, '0')}
                    </strong>
                    <small>Live demos linked</small>
                  </span>
                </div>
              </section>

              <div className="section-header">
                <div>
                  <span className="section-kicker">THE GOOD STUFF</span>
                  <h2>
                    Your projects <span className="h2-dot">✳</span>
                  </h2>
                  <p>Real projects. Real decisions. Real proof.</p>
                </div>
                <button className="outline-btn" onClick={() => setView('projects')}>
                  View all projects <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="projects-grid">
                {data.projects.slice(0, 3).map((p) => (
                  <ProjectCard key={p.id} p={p} onClick={() => edit(p)} />
                ))}
                <button className="add-card" onClick={() => edit(emptyProject())}>
                  <span>
                    <Plus size={24} />
                  </span>
                  <strong>Something new in the works?</strong>
                  <small>Every great idea deserves a page.</small>
                  <b>
                    Add a project <ArrowRight size={15} />
                  </b>
                </button>
              </div>

              <section className="bottom-banner">
                <span className="banner-icon">✳</span>
                <div>
                  <strong>Ready to share your story?</strong>
                  <p>Your public portfolio link is live and connected to Neon DB.</p>
                </div>
                <button onClick={() => navigateToPublic(data.profile.handle)}>
                  Visit your public page <ArrowUpRight size={17} />
                </button>
              </section>
            </>
          )}

          {view === 'projects' && (
            <>
              <div className="page-heading">
                <div>
                  <span className="section-kicker">YOUR BODY OF WORK</span>
                  <h1>
                    All projects<span className="h2-dot">.</span>
                  </h1>
                  <p>Build your story, one project at a time.</p>
                </div>
                <button className="dark-btn" onClick={() => edit(emptyProject())}>
                  <Plus size={17} /> Add project
                </button>
              </div>

              <div className="filter-row">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={filter === c ? 'selected' : ''}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="projects-grid listing">
                {visible.map((p) => (
                  <ProjectCard key={p.id} p={p} onClick={() => edit(p)} onDelete={() => deleteProject(p.id)} />
                ))}
                <button className="add-card" onClick={() => edit(emptyProject())}>
                  <span>
                    <Plus size={24} />
                  </span>
                  <strong>Add another project</strong>
                  <small>Document what you've made.</small>
                </button>
              </div>
              {!visible.length && <p className="empty">No projects in this category yet.</p>}
            </>
          )}

          {view === 'profile' && (
            <>
              <div className="page-heading">
                <div>
                  <span className="section-kicker">MAKE IT YOURS</span>
                  <h1>
                    Your profile<span className="h2-dot">.</span>
                  </h1>
                  <p>Tell the world who you are and what you do.</p>
                </div>
              </div>

              <div className="settings-layout">
                <div className="settings-card">
                  <div className="card-heading">
                    <span className="stat-icon yellow">
                      <UserRound size={19} />
                    </span>
                    <div>
                      <h3>Personal details</h3>
                      <p>This information appears on your public portfolio.</p>
                    </div>
                  </div>
                  <div className="form-grid">
                    <Field label="Full name" value={data.profile.name} onChange={(v) => updateProfile('name', v)} />
                    <Field
                      label="Username / Handle (Your public link: /p/username)"
                      value={data.profile.handle}
                      onChange={(v) => updateProfile('handle', v.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    />
                    <Field
                      label="Your headline"
                      value={data.profile.role}
                      onChange={(v) => updateProfile('role', v)}
                      wide
                    />
                    <Field
                      label="Location"
                      value={data.profile.location}
                      onChange={(v) => updateProfile('location', v)}
                    />
                    <Field label="Email" value={data.profile.email} onChange={(v) => updateProfile('email', v)} />
                    <Field
                      label="Short bio"
                      value={data.profile.bio}
                      onChange={(v) => updateProfile('bio', v)}
                      wide
                      area
                    />
                  </div>
                </div>

                <div className="settings-card">
                  <div className="card-heading">
                    <span className="stat-icon blue">
                      <LinkIcon size={19} />
                    </span>
                    <div>
                      <h3>Links & identity</h3>
                      <p>Make it easy for people to find your work.</p>
                    </div>
                  </div>
                  <div className="form-grid">
                    <Field
                      label="GitHub URL"
                      value={data.profile.github}
                      onChange={(v) => updateProfile('github', v)}
                      wide
                    />
                    <Field
                      label="Website URL"
                      value={data.profile.website}
                      onChange={(v) => updateProfile('website', v)}
                      wide
                    />
                    <Field
                      label="Avatar image URL"
                      value={data.profile.avatar}
                      onChange={(v) => updateProfile('avatar', v)}
                      wide
                    />
                  </div>
                </div>

                <div className="settings-card">
                  <div className="card-heading">
                    <span className="stat-icon cream">
                      <Database size={19} />
                    </span>
                    <div>
                      <h3>Cloud & Backups</h3>
                      <p>Data is stored in Neon PostgreSQL cloud database and cached locally.</p>
                    </div>
                  </div>
                  <div className="settings-actions">
                    <button className="outline-btn" onClick={exportData}>
                      <Download size={17} /> Export JSON backup
                    </button>
                    <button className="outline-btn" onClick={() => fileInput.current?.click()}>
                      <Upload size={17} /> Import JSON backup
                    </button>
                    <input
                      type="file"
                      ref={fileInput}
                      hidden
                      accept=".json,application/json"
                      onChange={importData}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {view === 'preview' && (
            <div className="preview-page">
              {/* Share Bar */}
              <div className="share-bar">
                <div className="share-bar-info">
                  <div className="share-bar-icon">
                    <Share2 size={18} />
                  </div>
                  <div className="share-bar-text">
                    <strong>Your Shareable Public Link:</strong>
                    <code>{publicProfileLink}</code>
                  </div>
                </div>
                <div className="share-bar-actions">
                  <button className="outline-btn small" onClick={() => handleShare(data.profile.handle)}>
                    <Copy size={15} /> Copy link
                  </button>
                  <button className="dark-btn small" onClick={() => navigateToPublic(data.profile.handle)}>
                    Open public page <ExternalLink size={15} />
                  </button>
                </div>
              </div>

              <div className="preview-top">
                <span className="section-kicker">PUBLIC PORTFOLIO PREVIEW</span>
                <div>
                  <button className="outline-btn" onClick={() => setView('dashboard')}>
                    <ChevronLeft size={17} /> Back to editor
                  </button>
                  <button className="dark-btn" onClick={() => handleShare(data.profile.handle)}>
                    <Share2 size={16} /> Copy page link
                  </button>
                </div>
              </div>

              <PublicPortfolioContent profile={data.profile} projects={data.projects} />
            </div>
          )}
        </main>
      </div>

      {/* Project Modal */}
      {modal && (
        <ProjectModal
          initial={editing}
          onClose={() => setModal(false)}
          onSave={saveProject}
          onDelete={() => {
            deleteProject(editing.id);
            setModal(false);
          }}
          notify={notify}
        />
      )}

      {/* Auth Modal */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onSuccess={(authData) => {
            setToken(authData.token);
            localStorage.setItem(TOKEN_KEY, authData.token);
            setUser(authData.user);
            if (authData.profile && authData.projects) {
              setData({ profile: authData.profile, projects: authData.projects });
            }
            setDbStatus('connected');
            setAuthModal({ open: false, mode: 'login' });
            notify(`Welcome, @${authData.user.username}! Connected to Neon DB.`);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

// Standalone Public View (served when visiting /p/:handle or /u/:handle)
function PublicPortfolioStandalone({ handle, currentUser, onNavigateHome, onOpenAuth, notify }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/public/${handle}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((result) => {
        if (result && result.profile) {
          setData(result);
          setLoading(false);
        } else {
          setNotFound(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [handle]);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      notify('Public portfolio link copied!');
    } catch {
      notify(url);
    }
  };

  const isOwner = currentUser && data && data.profile && currentUser.username.toLowerCase() === data.profile.handle.toLowerCase();

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f2' }}>
      <header className="public-standalone-header">
        <div className="public-standalone-brand" onClick={onNavigateHome}>
          <div className="brand">
            <span className="brand-icon">
              <span />
            </span>
            <span>
              proofpage<span className="brand-dot">.</span>
            </span>
          </div>
          <span className="public-badge">
            <span className="pulse" style={{ width: 6, height: 6 }} /> Public Portfolio
          </span>
        </div>

        <div className="public-standalone-actions">
          <button className="outline-btn small" onClick={copyLink}>
            <Share2 size={15} /> Copy link
          </button>
          {isOwner ? (
            <button className="primary-btn small" onClick={onNavigateHome}>
              Edit in Workspace <ArrowRight size={15} />
            </button>
          ) : (
            <button className="dark-btn small" onClick={() => onOpenAuth('register')}>
              Create your ProofPage <ArrowUpRight size={15} />
            </button>
          )}
        </div>
      </header>

      <div className="public-standalone-wrapper">
        {loading ? (
          <div className="public-loading">
            <div className="spinner" />
            <span>Loading portfolio for @{handle}...</span>
          </div>
        ) : notFound ? (
          <div className="public-404">
            <div className="public-404-icon">✳</div>
            <h2>Portfolio not found</h2>
            <p>We couldn't find a public portfolio for "@{handle}". Check the handle or claim it now!</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button className="outline-btn" onClick={onNavigateHome}>
                Go to Workspace
              </button>
              <button className="dark-btn" onClick={() => onOpenAuth('register')}>
                Claim @{handle} on ProofPage
              </button>
            </div>
          </div>
        ) : (
          <PublicPortfolioContent profile={data.profile} projects={data.projects} />
        )}
      </div>
    </div>
  );
}

// Reusable Public Content Layout
function PublicPortfolioContent({ profile, projects }) {
  return (
    <>
      <div className="public-profile">
        <div className="public-intro">
          <div className="public-available">
            <span className="pulse" /> OPEN TO INTERESTING WORK
          </div>
          <h1>
            Hey, I'm <span>{profile.name || profile.handle}.</span> <span className="wave">✳</span>
          </h1>
          <h2>{profile.role || 'Builder & Problem Solver'}</h2>
          <p>{profile.bio || 'Showcasing the thinking, decisions, and evidence behind my work.'}</p>
          <div className="public-links">
            {profile.github && (
              <a href={safeUrl(profile.github)} target="_blank" rel="noopener noreferrer">
                <Github size={17} /> GitHub <ArrowUpRight size={15} />
              </a>
            )}
            {profile.website && (
              <a href={safeUrl(profile.website)} target="_blank" rel="noopener noreferrer">
                <Globe size={17} /> Website <ArrowUpRight size={15} />
              </a>
            )}
            {profile.email && (
              <a href={'mailto:' + profile.email}>
                <ArrowUpRight size={17} /> Say hello
              </a>
            )}
          </div>
        </div>
        <div className="public-decoration">
          <div className="public-blob">
            P<span>✳</span>
          </div>
        </div>
      </div>

      <div className="public-work-heading">
        <div>
          <span className="section-kicker">SELECTED WORK / {projects.length.toString().padStart(2, '0')}</span>
          <h2>
            Proof is in the projects<span className="h2-dot">.</span>
          </h2>
        </div>
      </div>

      <div className="public-projects">
        {projects.map((p, i) => (
          <article className="public-project" key={p.id}>
            <div className={'public-visual ' + (p.color || 'blue')}>
              {p.image ? <img src={p.image} alt={p.title} /> : <ProjectArt p={p} />}
            </div>
            <div className="public-detail">
              <div className="public-index">
                {String(i + 1).padStart(2, '0')} / {(p.category || 'PROJECT').toUpperCase()}
              </div>
              <h3>{p.title}</h3>
              <p>{p.description || p.subtitle}</p>

              {p.problem && (
                <div className="proof-line">
                  <strong>THE PROBLEM</strong>
                  <span>{p.problem}</span>
                </div>
              )}
              {p.solution && (
                <div className="proof-line">
                  <strong>THE APPROACH</strong>
                  <span>{p.solution}</span>
                </div>
              )}
              {p.impact && (
                <div className="proof-line">
                  <strong>THE OUTCOME</strong>
                  <span>{p.impact}</span>
                </div>
              )}

              {p.metrics?.length > 0 && (
                <div className="public-metrics">
                  {p.metrics.map((m, j) => (
                    <div key={j}>
                      <b>{m.value}</b>
                      <small>{m.label}</small>
                    </div>
                  ))}
                </div>
              )}

              <div className="tag-row">{p.stack?.map((t) => <span key={t}>{t}</span>)}</div>

              <div className="project-links">
                {p.github && (
                  <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">
                    <Github size={17} /> Source code <ArrowUpRight size={15} />
                  </a>
                )}
                {p.demo && (
                  <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">
                    <Globe size={17} /> Live demo <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="public-footer">
        <span>
          Made with{' '}
          <strong>
            proofpage<span className="brand-dot">.</span>
          </strong>
        </span>
        <span>Great work deserves great storytelling. ✳</span>
      </footer>
    </>
  );
}

// Authentication Modal (Neon DB Auth)
function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fillDemo = () => {
    setMode('login');
    setUsername('alexbuilds');
    setPassword('demo123456');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onSuccess(data);
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="auth-box">
        <div className="auth-box-head">
          <h3>{mode === 'login' ? 'Sign In to ProofPage' : 'Create an Account'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="auth-box-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Sign In
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Register
          </button>
        </div>

        <form className="auth-box-body" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          {mode === 'login' && (
            <div className="auth-demo-card">
              <div>
                <strong>Need a quick demo?</strong>
                <span>Try the seeded demo account</span>
              </div>
              <button type="button" className="auth-demo-btn" onClick={fillDemo}>
                Fill Demo
              </button>
            </div>
          )}

          <label className="field">
            <span>{mode === 'login' ? 'Username or Email' : 'Desired Username (Handle)'}</span>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'login' ? 'alexbuilds' : 'e.g. sarahbuilds'}
            />
          </label>

          {mode === 'register' && (
            <label className="field">
              <span>Email Address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
              />
            </label>
          )}

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="dark-btn"
            disabled={submitting}
            style={{ width: '100%', marginTop: 8 }}
          >
            {submitting ? 'Connecting...' : mode === 'login' ? 'Sign In' : 'Create Account & Sync'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Helpers & Subcomponents
function initials(s) {
  return (s || 'P')
    .trim()
    .split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function safeUrl(s) {
  try {
    const u = new URL(s);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : '#';
  } catch {
    return '#';
  }
}

function Field({ label, value, onChange, wide, area, placeholder }) {
  return (
    <label className={'field ' + (wide ? 'wide' : '')}>
      <span>{label}</span>
      {area ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          rows="4"
        />
      ) : (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
        />
      )}
    </label>
  );
}

function ProjectArt({ p }) {
  return (
    <div className={'project-art ' + (p.color || 'blue')}>
      <div className="art-mock">
        <div className="mock-top">
          <i />
          <i />
          <i />
          <span>{p.title.toLowerCase().replace(/\s/g, '-')}.app</span>
        </div>
        <div className="mock-body">
          <div className="mock-sidebar">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="mock-main">
            <div className="mock-title" />
            <div className="mock-chart">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="mock-row">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
      <div className="art-sticker">✳</div>
    </div>
  );
}

function ProjectCard({ p, onClick, onDelete }) {
  return (
    <article className="project-card">
      <button
        className={'project-visual ' + (p.color || 'blue')}
        onClick={onClick}
        aria-label={'Edit ' + p.title}
      >
        {p.image ? <img src={p.image} alt={p.title} /> : <ProjectArt p={p} />}
        <span className="project-open">
          <ArrowUpRight size={18} />
        </span>
      </button>
      <div className="project-meta">
        <span>
          {p.category} <span className="dot-separator">•</span> {p.year}
        </span>
        <span className={'status ' + (p.status === 'Shipped' ? 'shipped' : '')}>{p.status}</span>
      </div>
      <button className="project-title" onClick={onClick}>
        {p.title || 'Untitled project'} <ArrowUpRight size={18} />
      </button>
      <p>{p.subtitle || p.description || 'Add a description to tell your story.'}</p>
      <div className="tag-row">
        {p.stack?.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
        {p.stack?.length > 3 && <span>+{p.stack.length - 3}</span>}
      </div>
      {onDelete && (
        <button className="delete-link" onClick={onDelete}>
          <Trash2 size={14} /> Delete project
        </button>
      )}
    </article>
  );
}

function ProjectModal({ initial, onClose, onSave, onDelete, notify }) {
  const [p, setP] = useState(initial);
  const [tab, setTab] = useState('basics');
  const [metric, setMetric] = useState({ value: '', label: '' });
  const uploadRef = useRef();

  const update = (k, v) => setP((s) => ({ ...s, [k]: v }));

  const upload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2.5 * 1024 * 1024) return notify('Use an image under 2.5 MB');
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result);
    reader.readAsDataURL(f);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="section-kicker">YOUR WORK, DOCUMENTED</span>
            <h2>
              {p.title ? 'Edit project' : 'New project'}
              <span className="h2-dot">.</span>
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-tabs">
          {[
            ['basics', 'The basics'],
            ['story', 'The story'],
            ['proof', 'Proof & links']
          ].map(([k, t]) => (
            <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
              {t}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {tab === 'basics' && (
            <div className="form-grid">
              <Field
                label="Project name *"
                value={p.title}
                onChange={(v) => update('title', v)}
                wide
                placeholder="e.g. Orbit Analytics"
              />
              <Field
                label="One-line description"
                value={p.subtitle}
                onChange={(v) => update('subtitle', v)}
                wide
              />
              <Field label="Category" value={p.category} onChange={(v) => update('category', v)} />
              <Field label="Year" value={p.year} onChange={(v) => update('year', v)} />
              <label className="field">
                <span>Status</span>
                <select value={p.status} onChange={(e) => update('status', e.target.value)}>
                  <option>In progress</option>
                  <option>Shipped</option>
                  <option>Archived</option>
                </select>
              </label>
              <label className="field">
                <span>Visual theme</span>
                <div className="theme-options">
                  {['blue', 'yellow', 'beige'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={'theme-choice ' + c + (p.color === c ? ' chosen' : '')}
                      onClick={() => update('color', c)}
                      title={c}
                    >
                      {p.color === c && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </label>
              <label className="field wide">
                <span>Cover image (optional)</span>
                <div className="upload-zone">
                  <button type="button" onClick={() => uploadRef.current.click()}>
                    <ImageIcon size={18} /> {p.image ? 'Replace cover image' : 'Upload a cover image'}
                    <span>PNG / JPG / WebP · max 2.5 MB</span>
                  </button>
                  {p.image && (
                    <button type="button" className="clear-image" onClick={() => update('image', '')}>
                      Remove image
                    </button>
                  )}
                  <input
                    type="file"
                    hidden
                    ref={uploadRef}
                    accept="image/png,image/jpeg,image/webp"
                    onChange={upload}
                  />
                </div>
              </label>
              <Field
                label="Technology stack (comma-separated)"
                value={(p.stack || []).join(', ')}
                onChange={(v) =>
                  update(
                    'stack',
                    v
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean)
                  )
                }
                wide
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
          )}

          {tab === 'story' && (
            <div className="form-grid">
              <Field
                label="Project overview"
                value={p.description}
                onChange={(v) => update('description', v)}
                wide
                area
                placeholder="What did you build, and for whom?"
              />
              <Field
                label="The problem"
                value={p.problem}
                onChange={(v) => update('problem', v)}
                wide
                area
                placeholder="What wasn't working before?"
              />
              <Field
                label="Your approach"
                value={p.solution}
                onChange={(v) => update('solution', v)}
                wide
                area
                placeholder="What decisions did you make and why?"
              />
              <Field
                label="The outcome"
                value={p.impact}
                onChange={(v) => update('impact', v)}
                wide
                area
                placeholder="What happened? Be honest about what you've measured."
              />
            </div>
          )}

          {tab === 'proof' && (
            <div className="form-grid">
              <Field
                label="GitHub repository URL"
                value={p.github}
                onChange={(v) => update('github', v)}
                wide
              />
              <Field label="Live demo URL" value={p.demo} onChange={(v) => update('demo', v)} wide />
              <div className="field wide">
                <span>Evidence & metrics</span>
                <p className="field-hint">Only add measurements you can actually substantiate.</p>
                <div className="metric-entry">
                  <input
                    placeholder="Value (e.g. 1.2s)"
                    value={metric.value}
                    onChange={(e) => setMetric((m) => ({ ...m, value: e.target.value }))}
                  />
                  <input
                    placeholder="Label (e.g. Page load)"
                    value={metric.label}
                    onChange={(e) => setMetric((m) => ({ ...m, label: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="outline-btn"
                    onClick={() => {
                      if (!metric.value || !metric.label) return;
                      update('metrics', [...(p.metrics || []), metric]);
                      setMetric({ value: '', label: '' });
                    }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="metric-pills">
                  {p.metrics?.map((m, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => update('metrics', p.metrics.filter((_, j) => i !== j))}
                    >
                      <b>{m.value}</b> {m.label} <X size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>
            Cancel
          </button>
          <div>
            <button
              className="outline-btn"
              onClick={() => {
                if (tab === 'basics') setTab('story');
                else if (tab === 'story') setTab('proof');
                else onSave(p);
              }}
            >
              {tab === 'proof' ? 'Save project' : 'Next step'}{' '}
              {tab === 'proof' ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
            <button className="dark-btn" onClick={() => onSave(p)}>
              <Check size={17} /> Save project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
