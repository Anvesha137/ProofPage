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
  ChevronLeft,
  User,
  Mail,
  Lock,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Award,
  Trophy,
  BadgeCheck,
  FileText,
  Calendar,
  Building,
  School,
  Edit2,
  GitBranch,
  Compass,
  Briefcase,
  Heart,
  Palette,
  Sliders,
  Zap,
  TrendingUp,
  HelpCircle,
  GripVertical,
  CornerDownRight,
  GitMerge,
  Workflow,
  RefreshCw,
  Play,
  CheckCircle,
  FolderPlus,
  BookOpen
} from 'lucide-react';
import './style.css';

const KEY = 'proofpage-v1';
const TOKEN_KEY = 'proofpage_token';

const AVAILABLE_SECTIONS = [
  { id: 'projects', label: 'Projects & Case Studies', short: 'Projects', icon: 'Code2' },
  { id: 'skills', label: 'Technical Skills', short: 'Skills', icon: 'Zap' },
  { id: 'about', label: 'About & Narrative', short: 'About', icon: 'User' },
  { id: 'education', label: 'Education & Degrees', short: 'Education', icon: 'GraduationCap' },
  { id: 'certifications', label: 'Certifications', short: 'Certs', icon: 'BadgeCheck' },
  { id: 'achievements', label: 'Achievements & Honors', short: 'Honors', icon: 'Trophy' },
  { id: 'contact', label: 'Contact & Socials', short: 'Contact', icon: 'Mail' }
];

const getAllAvailableSections = (customSections = []) => [
  ...AVAILABLE_SECTIONS,
  ...(customSections || []).map((sec) => ({
    id: sec.id,
    label: `${sec.title} (Custom Tab)`,
    short: sec.title.length > 14 ? sec.title.substring(0, 12) + '…' : sec.title,
    icon: sec.icon || 'FileText',
    isCustom: true
  }))
];

const DEFAULT_BRANCHES = [
  {
    id: 'branch-work',
    label: 'I want to work with you',
    subtitle: 'See services, experience, and flagship projects',
    icon: 'Briefcase',
    color: 'blue',
    sections: ['projects', 'contact']
  },
  {
    id: 'branch-proof',
    label: "Show me what you've done",
    subtitle: 'Explore case studies, metrics, certifications & proof',
    icon: 'Trophy',
    color: 'amber',
    sections: ['projects', 'certifications', 'achievements']
  },
  {
    id: 'branch-story',
    label: "I'm just exploring / Know me better",
    subtitle: 'Discover the person, story, background & education',
    icon: 'User',
    color: 'purple',
    sections: ['education', 'achievements']
  },
  {
    id: 'branch-connect',
    label: "Let's connect",
    subtitle: 'Find socials, communities, and ways to reach out',
    icon: 'Mail',
    color: 'green',
    sections: ['contact']
  }
];

const demo = {
  profile: {
    name: 'Alex Morgan',
    handle: 'alexbuilds',
    role: 'Full-stack developer & product builder',
    bio: 'I turn complex problems into thoughtful digital products. Here’s the work, the decisions, and the evidence behind what I build.',
    about_text: 'I am a full-stack engineer and product builder with 5+ years of experience crafting high-impact digital products. I specialize in scalable React applications, robust distributed backends, and performance-driven architectures.',
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL', 'Python', 'Vite', 'Redis'],
    education: [
      {
        id: 'edu-1',
        school: 'UC Berkeley',
        degree: 'B.S. in Computer Science',
        field: 'Distributed Systems & Software Engineering',
        startYear: '2019',
        endYear: '2023',
        grade: '3.85 GPA',
        description: "Dean's Honors List. Research focus on distributed key-value storage and high-throughput real-time APIs."
      },
      {
        id: 'edu-2',
        school: 'Stanford Online',
        degree: 'Certificate of Specialization',
        field: 'Cloud Infrastructure & System Design',
        startYear: '2023',
        endYear: '2024',
        grade: 'Distinction',
        description: 'Focused on distributed cache design, event-driven microservices, and serverless architectures.'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2024',
        credentialId: 'AWS-PSA-99381',
        credentialUrl: 'https://aws.amazon.com/certification'
      },
      {
        id: 'cert-2',
        name: 'Meta Certified Professional Front-End Engineer',
        issuer: 'Meta',
        issueDate: '2023',
        credentialId: 'META-FE-48201',
        credentialUrl: 'https://coursera.org'
      },
      {
        id: 'cert-3',
        name: 'PostgreSQL Advanced Query Tuning & Performance',
        issuer: 'Neon & Postgres Guild',
        issueDate: '2025',
        credentialId: 'PG-TUN-883',
        credentialUrl: 'https://neon.tech'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: '1st Place Winner — Global Cloud & AI Hackathon',
        issuer: 'TechCrunch Disrupt 2025',
        date: '2025',
        description: 'Architected an autonomous edge-rendering pipeline for real-time web performance out of 450+ international submissions.',
        link: 'https://techcrunch.com'
      },
      {
        id: 'ach-2',
        title: 'Open Source Contributor Recognition',
        issuer: 'DevOpen Foundation',
        date: '2024',
        description: 'Reduced memory allocation overhead by 35% in high-traffic SVG/Canvas web rendering tools.',
        link: 'https://github.com'
      },
      {
        id: 'ach-3',
        title: 'Published Technical Case Study',
        issuer: 'Engineering Digest',
        date: '2023',
        description: 'Published deep dive on zero-downtime serverless database migration architectures.',
        link: 'https://example.com'
      }
    ],
    custom_sections: [
      {
        id: 'sec-resume',
        title: 'Resume & Curriculum Vitae',
        kicker: 'CAREER SUMMARY & EXPERIENCE',
        icon: 'FileText',
        description: 'Download full PDF resume or review highlighted timeline, tech leadership, and track record.',
        buttonText: 'Download Full Resume (PDF)',
        buttonUrl: 'https://example.com/alex-morgan-resume.pdf',
        items: [
          {
            id: 'item-1',
            title: 'Staff Full-Stack & Systems Engineer',
            subtitle: 'Nexus Tech · San Francisco, CA',
            date: '2023 – Present',
            description: 'Lead engineer for microservice architecture serving 200k+ MAU. Designed low-latency PostgreSQL schemas and optimized websocket feeds.',
            link: 'https://example.com/alex-morgan-resume.pdf'
          },
          {
            id: 'item-2',
            title: 'Senior Frontend Engineer & Design Systems',
            subtitle: 'Hyperion Labs · Remote',
            date: '2021 – 2023',
            description: 'Architected company-wide React component library and reduced Core Web Vitals LCP by 40%.',
            link: 'https://example.com/alex-morgan-resume.pdf'
          }
        ]
      }
    ],
    proofpaths: {
      enabled: true,
      question: 'What brings you here today?',
      subtitle: 'Select a path to explore what is most relevant to you, or view the full page.',
      branches: [
        {
          id: 'branch-work',
          label: 'I want to work with you',
          subtitle: 'See services, experience, and flagship projects',
          icon: 'Briefcase',
          color: 'blue',
          sections: ['projects', 'about', 'sec-resume', 'contact']
        },
        {
          id: 'branch-proof',
          label: "Show me what you've done",
          subtitle: 'Explore case studies, metrics, certifications & proof',
          icon: 'Trophy',
          color: 'amber',
          sections: ['projects', 'certifications', 'achievements']
        },
        {
          id: 'branch-story',
          label: "I'm just exploring / Know me better",
          subtitle: 'Discover the person, story, background & education',
          icon: 'User',
          color: 'purple',
          sections: ['about', 'education', 'achievements']
        },
        {
          id: 'branch-connect',
          label: "Let's connect",
          subtitle: 'Find socials, communities, and ways to reach out',
          icon: 'Mail',
          color: 'green',
          sections: ['contact', 'about']
        }
      ]
    },
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
  const [authChecking, setAuthChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [dbStatus, setDbStatus] = useState('local'); // 'connected' | 'saving' | 'local'

  // Workspace state
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          !parsed.profile.proofpaths ||
          !parsed.profile.proofpaths.branches ||
          parsed.profile.proofpaths.branches.length === 0
        ) {
          parsed.profile.proofpaths = {
            enabled: true,
            question: parsed.profile.proofpaths?.question || 'What brings you here today?',
            subtitle:
              parsed.profile.proofpaths?.subtitle ||
              'Select a path to explore what is most relevant to you, or view the full page.',
            branches: DEFAULT_BRANCHES
          };
        }
        return parsed;
      }
      return demo;
    } catch {
      return demo;
    }
  });

  const [view, setView] = useState('dashboard');
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [educationModal, setEducationModal] = useState({ open: false, item: null });
  const [certModal, setCertModal] = useState({ open: false, item: null });
  const [achieveModal, setAchieveModal] = useState({ open: false, item: null });
  const [branchModal, setBranchModal] = useState({ open: false, item: null });
  const [customModal, setCustomModal] = useState({ open: false, item: null });
  const [customItemModal, setCustomItemModal] = useState({ open: false, tabId: null, item: null });
  const [activePageTab, setActivePageTab] = useState('education');
  const [draggedBranchIndex, setDraggedBranchIndex] = useState(null);
  const [dragOverBranchIndex, setDragOverBranchIndex] = useState(null);
  const [simulatedPathId, setSimulatedPathId] = useState(null);
  const [toast, setToast] = useState('');
  const [menu, setMenu] = useState(false);
  const sidebarRef = useRef(null);

  // Close mobile sidebar on outside click or Escape key
  useEffect(() => {
    if (!menu) return;
    const handleOutsideClick = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest('.hamburger')
      ) {
        setMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menu]);
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
      setUser(null);
      setDbStatus('local');
      setAuthChecking(false);
      return;
    }
    setAuthChecking(true);
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          setDbStatus('connected');
          if (res.profile && res.projects) {
            const p = res.profile;
            if (!p.proofpaths || !p.proofpaths.branches || p.proofpaths.branches.length === 0) {
              p.proofpaths = {
                enabled: true,
                question: p.proofpaths?.question || 'What brings you here today?',
                subtitle: p.proofpaths?.subtitle || 'Select a path to explore what is most relevant to you, or view the full page.',
                branches: DEFAULT_BRANCHES
              };
            }
            setData({ profile: p, projects: res.projects });
          }
        } else {
          setToken('');
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setDbStatus('local');
        }
      })
      .catch(() => {
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setDbStatus('local');
      })
      .finally(() => {
        setAuthChecking(false);
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

  const saveEducation = (item) => {
    setData((d) => {
      const edus = d.profile.education || [];
      const exists = edus.some((x) => x.id === item.id);
      const nextEdus = exists
        ? edus.map((x) => (x.id === item.id ? item : x))
        : [...edus, { ...item, id: item.id || 'edu-' + Math.random().toString(36).substring(2, 9) }];
      const next = { ...d, profile: { ...d.profile, education: nextEdus } };
      syncToNeon(next);
      return next;
    });
    setEducationModal({ open: false, item: null });
    notify('Education updated & synced');
  };

  const deleteEducation = (id) => {
    if (!confirm('Remove this education entry?')) return;
    setData((d) => {
      const nextEdus = (d.profile.education || []).filter((x) => x.id !== id);
      const next = { ...d, profile: { ...d.profile, education: nextEdus } };
      syncToNeon(next);
      return next;
    });
    notify('Education entry removed');
  };

  const saveCertification = (item) => {
    setData((d) => {
      const certs = d.profile.certifications || [];
      const exists = certs.some((x) => x.id === item.id);
      const nextCerts = exists
        ? certs.map((x) => (x.id === item.id ? item : x))
        : [...certs, { ...item, id: item.id || 'cert-' + Math.random().toString(36).substring(2, 9) }];
      const next = { ...d, profile: { ...d.profile, certifications: nextCerts } };
      syncToNeon(next);
      return next;
    });
    setCertModal({ open: false, item: null });
    notify('Certification updated & synced');
  };

  const deleteCertification = (id) => {
    if (!confirm('Remove this certification?')) return;
    setData((d) => {
      const nextCerts = (d.profile.certifications || []).filter((x) => x.id !== id);
      const next = { ...d, profile: { ...d.profile, certifications: nextCerts } };
      syncToNeon(next);
      return next;
    });
    notify('Certification removed');
  };

  const saveAchievement = (item) => {
    setData((d) => {
      const achs = d.profile.achievements || [];
      const exists = achs.some((x) => x.id === item.id);
      const nextAchs = exists
        ? achs.map((x) => (x.id === item.id ? item : x))
        : [...achs, { ...item, id: item.id || 'ach-' + Math.random().toString(36).substring(2, 9) }];
      const next = { ...d, profile: { ...d.profile, achievements: nextAchs } };
      syncToNeon(next);
      return next;
    });
    setAchieveModal({ open: false, item: null });
    notify('Achievement updated & synced');
  };

  const deleteAchievement = (id) => {
    if (!confirm('Remove this achievement?')) return;
    setData((d) => {
      const nextAchs = (d.profile.achievements || []).filter((x) => x.id !== id);
      const next = { ...d, profile: { ...d.profile, achievements: nextAchs } };
      syncToNeon(next);
      return next;
    });
    notify('Achievement removed');
  };

  const saveCustomSection = (item) => {
    const newId = item.id || 'sec-' + Math.random().toString(36).substring(2, 9);
    setData((d) => {
      const list = d.profile.custom_sections || [];
      const exists = list.some((x) => x.id === item.id);
      const nextList = exists
        ? list.map((x) => (x.id === item.id ? { ...x, ...item } : x))
        : [...list, { ...item, id: newId, items: item.items || [] }];
      const next = { ...d, profile: { ...d.profile, custom_sections: nextList } };
      syncToNeon(next);
      return next;
    });
    setCustomModal({ open: false, item: null });
    setActivePageTab(newId);
    notify('Custom tab updated & synced');
  };

  const deleteCustomSection = (id) => {
    if (!confirm('Remove this custom tab?')) return;
    setData((d) => {
      const nextList = (d.profile.custom_sections || []).filter((x) => x.id !== id);
      const next = { ...d, profile: { ...d.profile, custom_sections: nextList } };
      syncToNeon(next);
      return next;
    });
    notify('Custom tab removed');
  };

  const saveCustomItem = (tabId, item) => {
    setData((d) => {
      const list = d.profile.custom_sections || [];
      const nextList = list.map((tab) => {
        if (tab.id !== tabId) return tab;
        const currentItems = tab.items || [];
        const exists = currentItems.some((x) => x.id === item.id);
        const nextItems = exists
          ? currentItems.map((x) => (x.id === item.id ? item : x))
          : [...currentItems, { ...item, id: item.id || 'item-' + Math.random().toString(36).substring(2, 9) }];
        return { ...tab, items: nextItems };
      });
      const next = { ...d, profile: { ...d.profile, custom_sections: nextList } };
      syncToNeon(next);
      return next;
    });
    setCustomItemModal({ open: false, tabId: null, item: null });
    notify('Item saved & synced');
  };

  const deleteCustomItem = (tabId, itemId) => {
    if (!confirm('Remove this item?')) return;
    setData((d) => {
      const list = d.profile.custom_sections || [];
      const nextList = list.map((tab) => {
        if (tab.id !== tabId) return tab;
        const nextItems = (tab.items || []).filter((x) => x.id !== itemId);
        return { ...tab, items: nextItems };
      });
      const next = { ...d, profile: { ...d.profile, custom_sections: nextList } };
      syncToNeon(next);
      return next;
    });
    notify('Item removed');
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (!s) return;
    setData((d) => {
      const current = d.profile.skills || [];
      if (current.includes(s)) return d;
      const next = { ...d, profile: { ...d.profile, skills: [...current, s] } };
      syncToNeon(next);
      return next;
    });
    notify(`Added skill: ${s}`);
  };

  const removeSkill = (skill) => {
    setData((d) => {
      const current = d.profile.skills || [];
      const next = { ...d, profile: { ...d.profile, skills: current.filter((x) => x !== skill) } };
      syncToNeon(next);
      return next;
    });
  };

  const updateProofPaths = (updates) => {
    setData((d) => {
      const current = d.profile.proofpaths || {
        enabled: true,
        question: 'What brings you here today?',
        subtitle: 'Select a path to explore what is most relevant to you, or view the full page.',
        branches: []
      };
      const nextPaths = { ...current, ...updates };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    notify('ProofPaths settings updated & synced');
  };

  const saveProofPathBranch = (branch) => {
    setData((d) => {
      const current = d.profile.proofpaths || {
        enabled: true,
        question: 'What brings you here today?',
        subtitle: 'Select a path to explore what is most relevant to you, or view the full page.',
        branches: []
      };
      const branches = current.branches || [];
      const exists = branches.some((b) => b.id === branch.id);
      const nextBranches = exists
        ? branches.map((b) => (b.id === branch.id ? branch : b))
        : [...branches, { ...branch, id: branch.id || 'branch-' + Math.random().toString(36).substring(2, 9) }];
      const nextPaths = { ...current, branches: nextBranches };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    setBranchModal({ open: false, item: null });
    notify('ProofPath branch saved & synced');
  };

  const deleteProofPathBranch = (id) => {
    if (!confirm('Remove this path branch?')) return;
    setData((d) => {
      const current = d.profile.proofpaths || {
        enabled: true,
        question: 'What brings you here today?',
        subtitle: '',
        branches: []
      };
      const nextBranches = (current.branches || []).filter((b) => b.id !== id);
      const nextPaths = { ...current, branches: nextBranches };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    notify('Branch removed');
  };

  const loadDefaultBranches = () => {
    setData((d) => {
      const cur = d.profile.proofpaths || {};
      const nextPaths = {
        ...cur,
        enabled: true,
        question: cur.question || 'What brings you here today?',
        subtitle:
          cur.subtitle ||
          'Select a path to explore what is most relevant to you, or view the full page.',
        branches: DEFAULT_BRANCHES
      };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    notify('Loaded recommended ProofPath decision tree!');
  };

  const toggleSectionInBranch = (branchId, sectionId) => {
    setData((d) => {
      const cur = d.profile.proofpaths || { branches: [] };
      const branches = (cur.branches || DEFAULT_BRANCHES).map((b) => {
        if (b.id !== branchId) return b;
        const currentSecs = b.sections || [];
        const nextSecs = currentSecs.includes(sectionId)
          ? currentSecs.filter((s) => s !== sectionId)
          : [...currentSecs, sectionId];
        return { ...b, sections: nextSecs };
      });
      const nextPaths = { ...cur, branches };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    notify('Decision tree section updated');
  };

  const handleBranchDragStart = (e, idx) => {
    setDraggedBranchIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBranchDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverBranchIndex !== idx) {
      setDragOverBranchIndex(idx);
    }
  };

  const handleBranchDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedBranchIndex === null || draggedBranchIndex === targetIdx) {
      setDraggedBranchIndex(null);
      setDragOverBranchIndex(null);
      return;
    }
    setData((d) => {
      const cur = d.profile.proofpaths || { branches: [] };
      const branches = [...(cur.branches || DEFAULT_BRANCHES)];
      const [moved] = branches.splice(draggedBranchIndex, 1);
      branches.splice(targetIdx, 0, moved);
      const nextPaths = { ...cur, branches };
      const next = { ...d, profile: { ...d.profile, proofpaths: nextPaths } };
      syncToNeon(next);
      return next;
    });
    setDraggedBranchIndex(null);
    setDragOverBranchIndex(null);
    notify('Decision branch reordered in tree!');
  };

  const handleBranchDragEnd = () => {
    setDraggedBranchIndex(null);
    setDragOverBranchIndex(null);
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
      } catch { }
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
    window.open(`/p/${targetHandle}`, '_blank', 'noopener,noreferrer');
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
    setAuthMode('login');
    notify('Logged out successfully');
  };

  const handleAuthSuccess = (authData) => {
    setToken(authData.token);
    localStorage.setItem(TOKEN_KEY, authData.token);
    setUser(authData.user);
    if (authData.profile && authData.projects) {
      setData({ profile: authData.profile, projects: authData.projects });
    }
    setDbStatus('connected');
    notify(`Welcome, @${authData.user.username}! Connected to Neon DB.`);
  };

  // If viewing a standalone public profile
  if (route.mode === 'public') {
    return (
      <PublicPortfolioStandalone
        handle={route.handle}
        currentUser={user}
        onNavigateHome={navigateToWorkspace}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          navigateToWorkspace();
        }}
        notify={notify}
      />
    );
  }

  // If verifying session on initial load
  if (authChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: 16 }}>
            <span className="brand-icon">
              <span />
            </span>
            <span>
              proofpage<span className="brand-dot">.</span>
            </span>
          </div>
          <div className="spinner" />
          <p>Connecting to your workspace...</p>
        </div>
      </div>
    );
  }

  // IF NOT SIGNED IN -> SHOW AUTHENTICATION PAGE (DO NOT SHOW DASHBOARD!)
  if (!user) {
    return (
      <>
        <AuthPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onExploreDemo={() => navigateToPublic('alexbuilds')}
          notify={notify}
        />
        {toast && (
          <div className="toast">
            <Check size={17} />
            {toast}
          </div>
        )}
      </>
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
      {/* Mobile drawer backdrop - clicking closes sidebar */}
      {menu && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenu(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside ref={sidebarRef} className={'sidebar ' + (menu ? 'mobile-open' : '')}>
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
            Projects <span className="nav-count">{data.projects.length}</span>
          </button>
          <button
            className={view === 'about' ? 'active' : ''}
            onClick={() => {
              setView('about');
              setMenu(false);
            }}
          >
            <FileText size={18} />
            About & Skills
          </button>
          <button
            className={
              view === 'all_pages' ||
              view === 'education' ||
              view === 'certifications' ||
              view === 'achievements' ||
              view === 'custom_tabs'
                ? 'active'
                : ''
            }
            onClick={() => {
              setView('all_pages');
              setMenu(false);
            }}
          >
            <FolderPlus size={18} />
            All Pages{' '}
            <span className="nav-count">
              {(data.profile.education || []).length +
                (data.profile.certifications || []).length +
                (data.profile.achievements || []).length +
                (data.profile.custom_sections || []).reduce((acc, s) => acc + (s.items?.length || 0), 0)}
            </span>
          </button>
          <button
            className={view === 'proofpaths' ? 'active' : ''}
            onClick={() => {
              setView('proofpaths');
              setMenu(false);
            }}
          >
            <GitBranch size={18} />
            ProofPaths <span className="nav-count" style={{ background: '#eaf0ff', color: '#2452d8', fontWeight: 800 }}>Adaptive</span>
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
            {/* <p>Publish to Neon DB and share your personal URL anywhere.</p> */}
            <button onClick={() => navigateToPublic(data.profile.handle)}>
              View Public Page <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="side-user">
            <div className="avatar">
              {data.profile.avatar ? <img src={data.profile.avatar} alt="Avatar" /> : initials(data.profile.name || user?.username)}
            </div>
            <div>
              <strong>{data.profile.name || user?.username || 'Workspace'}</strong>
              <small>@{data.profile.handle || user?.username}</small>
            </div>
            <button title="Sign out" onClick={handleLogout} style={{ marginLeft: 'auto' }} className="side-signout-btn">
              <LogOut size={17} />
            </button>
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
                  : view === 'about'
                    ? 'About & Skills'
                    : view === 'all_pages' || view === 'education' || view === 'certifications' || view === 'achievements' || view === 'custom_tabs'
                      ? `All Pages › ${
                          activePageTab === 'education'
                            ? 'Education'
                            : activePageTab === 'certifications'
                              ? 'Certifications'
                              : activePageTab === 'achievements'
                                ? 'Achievements'
                                : (data.profile.custom_sections || []).find((s) => s.id === activePageTab)?.title || 'Custom Tab'
                        }`
                    : view === 'proofpaths'
                      ? 'ProofPaths Decision Engine'
                            : view === 'profile'
                            ? 'Profile settings'
                            : 'Public Preview'}
            </b>
          </span>

          <div className="top-actions">
            <button
              className={`outline-btn ${view === 'profile' ? 'active' : ''}`}
              title="Go to Profile settings"
              onClick={() => setView('profile')}
            >
              <UserRound size={16} /> Profile
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

          {view === 'about' && (
            <>
              <div className="page-heading">
                <div>
                  <span className="section-kicker">STORY & CAPABILITIES</span>
                  <h1>
                    About & Skills<span className="h2-dot">.</span>
                  </h1>
                  <p>Express your engineering philosophy and list your technical superpowers.</p>
                </div>
              </div>

              <div className="settings-layout">
                {/* About Me Story Card */}
                <div className="settings-card">
                  <div className="card-heading">
                    <div>
                      <h3>About Me & Personal Narrative</h3>
                      <p>Write an engaging description of your engineering journey, philosophy, and what you love building.</p>
                    </div>
                  </div>

                  <div className="field wide">
                    <span>Extended Bio & Philosophy</span>
                    <textarea
                      rows={6}
                      value={data.profile.about_text || ''}
                      onChange={(e) => updateProfile('about_text', e.target.value)}
                      placeholder="Share your personal story, what drives you, key achievements, or what problems you are excited to solve..."
                    />
                  </div>
                </div>

                {/* Technical Skills Card */}
                <div className="settings-card">
                  <div className="card-heading">
                    <div>
                      <h3>Technical Skills & Stack</h3>
                      <p>Add languages, frameworks, databases, and developer tools you master.</p>
                    </div>
                  </div>

                  <div className="skills-container">
                    <SkillInput onAdd={addSkill} />

                    <div>
                      <span className="field-hint">Quick add popular skills:</span>
                      <div className="skill-suggestions-row">
                        {[
                          'React', 'TypeScript', 'Next.js', 'Node.js', 'Python',
                          'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL',
                          'Redis', 'Git', 'Vite', 'Figma', 'System Design'
                        ]
                          .filter((s) => !(data.profile.skills || []).includes(s))
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="skill-suggest-btn"
                              onClick={() => addSkill(s)}
                            >
                              + {s}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <span className="field-hint">Your active skills ({(data.profile.skills || []).length}):</span>
                      <div className="skills-tags-wrap">
                        {(data.profile.skills || []).length === 0 ? (
                          <span style={{ fontSize: 12, color: '#9da4b0' }}>No skills added yet. Click above or type to add!</span>
                        ) : (
                          (data.profile.skills || []).map((s) => (
                            <span key={s} className="skill-tag-pill">
                              {s}
                              <button type="button" onClick={() => removeSkill(s)}>×</button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {(view === 'all_pages' || view === 'education' || view === 'certifications' || view === 'achievements' || view === 'custom_tabs') && (
            <div className="all-pages-view-wrap">
              <div className="page-heading">
                <div>
                  <span className="section-kicker">PORTFOLIO ARCHITECTURE · MODULAR PAGES</span>
                  <h1>
                    All Pages<span className="h2-dot">.</span>
                  </h1>
                  <p>
                    Manage your education, certifications, achievements, and custom portfolio tabs all in one place.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="dark-btn"
                    onClick={() => {
                      if (activePageTab === 'education') setEducationModal({ open: true, item: null });
                      else if (activePageTab === 'certifications') setCertModal({ open: true, item: null });
                      else if (activePageTab === 'achievements') setAchieveModal({ open: true, item: null });
                      else if (data.profile.custom_sections?.some((s) => s.id === activePageTab)) {
                        const cur = data.profile.custom_sections.find((s) => s.id === activePageTab);
                        setCustomModal({ open: true, item: cur });
                      } else {
                        setCustomModal({ open: true, item: null });
                      }
                    }}
                  >
                    <Plus size={16} />
                    {activePageTab === 'education'
                      ? 'Add Education'
                      : activePageTab === 'certifications'
                        ? 'Add Certification'
                        : activePageTab === 'achievements'
                          ? 'Add Achievement'
                          : 'Edit Tab'}
                  </button>
                  <button
                    className="outline-btn"
                    title="Create custom tab"
                    onClick={() => setCustomModal({ open: true, item: null })}
                  >
                    <Plus size={15} /> Add Tab
                  </button>
                </div>
              </div>

              {/* All Pages Segmented Subtabs Bar */}
              <div className="all-pages-subnav-bar">
                <button
                  type="button"
                  className={`all-pages-tab-pill ${activePageTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActivePageTab('education')}
                >
                  <GraduationCap size={16} /> Education
                  <span className="tab-pill-badge">{(data.profile.education || []).length}</span>
                </button>

                <button
                  type="button"
                  className={`all-pages-tab-pill ${activePageTab === 'certifications' ? 'active' : ''}`}
                  onClick={() => setActivePageTab('certifications')}
                >
                  <BadgeCheck size={16} /> Certifications
                  <span className="tab-pill-badge">{(data.profile.certifications || []).length}</span>
                </button>

                <button
                  type="button"
                  className={`all-pages-tab-pill ${activePageTab === 'achievements' ? 'active' : ''}`}
                  onClick={() => setActivePageTab('achievements')}
                >
                  <Trophy size={16} /> Achievements
                  <span className="tab-pill-badge">{(data.profile.achievements || []).length}</span>
                </button>

                {/* User Created Custom Tabs */}
                {(data.profile.custom_sections || []).map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`all-pages-tab-pill ${activePageTab === sec.id ? 'active' : ''}`}
                    onClick={() => setActivePageTab(sec.id)}
                  >
                    {renderBranchIcon(sec.icon || 'FileText', 15)} {sec.title}
                    <span className="tab-pill-badge">{(sec.items || []).length}</span>
                  </button>
                ))}

                {/* + Add Tab button */}
                <button
                  type="button"
                  className="all-pages-add-tab-btn"
                  title="Create a new custom tab (e.g. Resume, Services, Publications, Bookings)"
                  onClick={() => setCustomModal({ open: true, item: null })}
                >
                  <Plus size={14} /> Add Tab
                </button>
              </div>

              {/* 1. Education Subtab Content */}
              {activePageTab === 'education' && (
                <div className="items-grid">
                  {(data.profile.education || []).map((edu) => (
                    <div className="item-card" key={edu.id}>
                      <div className="item-card-top">
                        <div className="item-card-icon blue">
                          <GraduationCap size={20} />
                        </div>
                        <div className="item-card-titles">
                          <strong>{edu.school}</strong>
                          <span>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                          <div className="item-badge-row">
                            <span className="item-pill">
                              <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                              {edu.startYear || '—'} – {edu.endYear || 'Present'}
                            </span>
                            {edu.grade && <span className="item-pill highlight">{edu.grade}</span>}
                          </div>
                        </div>
                      </div>

                      {edu.description && <p className="item-card-desc">{edu.description}</p>}

                      <div className="item-card-foot">
                        <div className="item-card-actions">
                          <button
                            className="item-action-btn"
                            title="Edit education"
                            onClick={() => setEducationModal({ open: true, item: edu })}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="item-action-btn delete"
                            title="Remove education"
                            onClick={() => deleteEducation(edu.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className="add-card"
                    onClick={() => setEducationModal({ open: true, item: null })}
                  >
                    <span>
                      <Plus size={24} />
                    </span>
                    <strong>Add an education</strong>
                    <small>Degrees, universities, bootcamps.</small>
                  </button>
                </div>
              )}

              {/* 2. Certifications Subtab Content */}
              {activePageTab === 'certifications' && (
                <div className="items-grid">
                  {(data.profile.certifications || []).map((cert) => (
                    <div className="item-card" key={cert.id}>
                      <div className="item-card-top">
                        <div className="item-card-icon blue">
                          <BadgeCheck size={20} />
                        </div>
                        <div className="item-card-titles">
                          <strong>{cert.name}</strong>
                          <span>{cert.issuer}</span>
                          <div className="item-badge-row">
                            {cert.issueDate && <span className="item-pill">{cert.issueDate}</span>}
                            {cert.credentialId && <span className="item-pill highlight">ID: {cert.credentialId}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="item-card-foot">
                        {cert.credentialUrl ? (
                          <a href={safeUrl(cert.credentialUrl)} target="_blank" rel="noopener noreferrer">
                            Verify credential <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span />
                        )}

                        <div className="item-card-actions">
                          <button
                            className="item-action-btn"
                            title="Edit certification"
                            onClick={() => setCertModal({ open: true, item: cert })}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="item-action-btn delete"
                            title="Remove certification"
                            onClick={() => deleteCertification(cert.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className="add-card"
                    onClick={() => setCertModal({ open: true, item: null })}
                  >
                    <span>
                      <Plus size={24} />
                    </span>
                    <strong>Add a certification</strong>
                    <small>AWS, Meta, Google Cloud, Docker, etc.</small>
                  </button>
                </div>
              )}

              {/* 3. Achievements Subtab Content */}
              {activePageTab === 'achievements' && (
                <div className="items-grid">
                  {(data.profile.achievements || []).map((ach) => (
                    <div className="item-card" key={ach.id}>
                      <div className="item-card-top">
                        <div className="item-card-icon amber">
                          <Trophy size={20} />
                        </div>
                        <div className="item-card-titles">
                          <strong>{ach.title}</strong>
                          {ach.issuer && <span>{ach.issuer}</span>}
                          {ach.date && (
                            <div className="item-badge-row">
                              <span className="item-pill">{ach.date}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {ach.description && <p className="item-card-desc">{ach.description}</p>}

                      <div className="item-card-foot">
                        {ach.link ? (
                          <a href={safeUrl(ach.link)} target="_blank" rel="noopener noreferrer">
                            View details <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span />
                        )}

                        <div className="item-card-actions">
                          <button
                            className="item-action-btn"
                            title="Edit achievement"
                            onClick={() => setAchieveModal({ open: true, item: ach })}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="item-action-btn delete"
                            title="Remove achievement"
                            onClick={() => deleteAchievement(ach.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className="add-card"
                    onClick={() => setAchieveModal({ open: true, item: null })}
                  >
                    <span>
                      <Plus size={24} />
                    </span>
                    <strong>Add an achievement</strong>
                    <small>Hackathons, awards, honors, publications.</small>
                  </button>
                </div>
              )}

              {/* 4. Custom Tab Selected Content */}
              {(data.profile.custom_sections || []).filter((s) => s.id === activePageTab).map((sec) => (
                <div key={sec.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      {sec.kicker && (
                        <span className="section-kicker" style={{ color: '#2452d8', marginBottom: 4 }}>
                          {sec.kicker}
                        </span>
                      )}
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, margin: '2px 0 0' }}>
                        {renderBranchIcon(sec.icon || 'FileText', 22)} {sec.title}
                      </h2>
                      {sec.description && (
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#687383', maxWidth: 640 }}>
                          {sec.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="outline-btn small"
                        title="Edit tab settings"
                        onClick={() => setCustomModal({ open: true, item: sec })}
                      >
                        <Edit2 size={14} /> Tab Settings
                      </button>
                      <button
                        type="button"
                        className="outline-btn small"
                        style={{ color: '#c54037' }}
                        title="Delete tab"
                        onClick={() => {
                          deleteCustomSection(sec.id);
                          setActivePageTab('education');
                        }}
                      >
                        <Trash2 size={14} /> Delete Tab
                      </button>
                    </div>
                  </div>

                  <div className="items-grid">
                    {(sec.items || []).map((item) => (
                      <div className="item-card" key={item.id}>
                        <div className="item-card-top">
                          <div className="item-card-icon blue">
                            {renderBranchIcon(sec.icon || 'FileText', 20)}
                          </div>
                          <div className="item-card-titles">
                            <strong>{item.title}</strong>
                            {item.subtitle && <span>{item.subtitle}</span>}
                            {item.date && (
                              <div className="item-badge-row">
                                <span className="item-pill">{item.date}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {item.description && <p className="item-card-desc">{item.description}</p>}

                        <div className="item-card-foot">
                          {item.link ? (
                            <a href={safeUrl(item.link)} target="_blank" rel="noopener noreferrer">
                              View link <ArrowUpRight size={13} />
                            </a>
                          ) : (
                            <span />
                          )}

                          <div className="item-card-actions">
                            <button
                              className="item-action-btn"
                              title={`Edit ${item.title}`}
                              onClick={() => setCustomItemModal({ open: true, tabId: sec.id, item })}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="item-action-btn delete"
                              title="Remove item"
                              onClick={() => deleteCustomItem(sec.id, item.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* EXACT SAME Add Card as Education, Certifications, Achievements */}
                    <button
                      className="add-card"
                      onClick={() => setCustomItemModal({ open: true, tabId: sec.id, item: null })}
                    >
                      <span>
                        <Plus size={24} />
                      </span>
                      <strong>Add to {sec.title}</strong>
                      <small>Add an entry, item, or service.</small>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'proofpaths' && (
            <div className="proofpaths-builder-wrap">
              <div className="page-heading">
                <div>
                  <span className="section-kicker">SIGNATURE FEATURE / VISUAL DECISION TREE STUDIO</span>
                  <h1>
                    ProofPaths Decision Tree<span className="h2-dot">.</span>
                  </h1>
                  <p>
                    One profile. A different experience for every visitor. Visually drag and connect questions, decision branches, and sections.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="outline-btn" onClick={loadDefaultBranches}>
                    <RefreshCw size={15} /> Load Recommended Tree
                  </button>
                  <button className="dark-btn" onClick={() => setBranchModal({ open: true, item: null })}>
                    <Plus size={16} /> Add Decision Branch
                  </button>
                  <button className="outline-btn" onClick={() => navigateToPublic(data.profile.handle)}>
                    <Eye size={15} /> View Public Page <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* Mode Toggle Switch Bar */}
              <div className="proofpaths-toggle-bar">
                <div className="proofpaths-toggle-info">
                  <strong>
                    {data.profile.proofpaths?.enabled
                      ? '⚡ Interactive Decision Tree Mode is ACTIVE'
                      : '📜 Classic Scrolling Mode is ACTIVE'}
                  </strong>
                  <span>
                    {data.profile.proofpaths?.enabled
                      ? 'Visitors are greeted with your opening question and adaptive path buttons.'
                      : 'Visitors see the traditional full scrolling portfolio without the decision tree filter.'}
                  </span>
                </div>
                <div
                  className={`switch-pill ${data.profile.proofpaths?.enabled ? 'checked' : ''}`}
                  onClick={() =>
                    updateProofPaths({ enabled: !Boolean(data.profile.proofpaths?.enabled) })
                  }
                  title="Toggle ProofPaths mode"
                >
                  <div className="switch-pill-handle" />
                </div>
              </div>

              {/* Available Portfolio Sections Palette Deck */}
              <div className="tree-palette-deck">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="stat-icon cream" style={{ width: 34, height: 34, borderRadius: 8 }}>
                    <Workflow size={17} />
                  </span>
                  <div>
                    <strong style={{ fontSize: 13, color: '#172333', display: 'block' }}>
                      Available Content Blocks
                    </strong>
                    <span style={{ fontSize: 11, color: '#727c8a' }}>
                      Sections you can route your visitors through
                    </span>
                  </div>
                </div>

                <div className="palette-deck-chips">
                  {getAllAvailableSections(data.profile.custom_sections).map((sec) => {
                    const usageCount = (data.profile.proofpaths?.branches || []).filter((b) =>
                      b.sections?.includes(sec.id)
                    ).length;
                    return (
                      <span key={sec.id} className="palette-item-chip">
                        <span>{sec.short}</span>
                        <span className="palette-count" title={`Used in ${usageCount} path branches`}>
                          {usageCount}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Visual Decision Tree Canvas */}
              <div className="decision-tree-canvas">
                <div className="tree-top-toolbar">
                  <div className="tree-canvas-badge">
                    <Sparkles size={13} /> VISUAL DECISION TREE CANVAS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#687383', fontWeight: 600 }}>
                    <GripVertical size={16} /> Drag & drop cards to reorder tree branches
                  </div>
                </div>

                {/* 1. ROOT QUESTION NODE */}
                <div className="tree-root-container">
                  <div className="tree-root-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span className="tree-node-tag">
                        <Sparkles size={11} /> ROOT DECISION NODE · VISITOR OPENING
                      </span>
                      <span style={{ fontSize: 11, color: '#8d97a5', fontWeight: 700 }}>Step 01</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#475467', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          Opening Question Prompt (What visitors see first)
                        </label>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: 'Space Grotesk, sans-serif',
                            padding: '12px 14px',
                            borderRadius: 10,
                            border: '1.5px solid #2452d8',
                            background: '#fff',
                            color: '#172333'
                          }}
                          value={data.profile.proofpaths?.question || ''}
                          onChange={(e) => updateProofPaths({ question: e.target.value })}
                          placeholder="e.g. What brings you here today?"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#667085', marginBottom: 4 }}>
                          Subtitle Guidance (Optional)
                        </label>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            fontSize: 12,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #dcdad0',
                            background: '#fcfbfa'
                          }}
                          value={data.profile.proofpaths?.subtitle || ''}
                          onChange={(e) => updateProofPaths({ subtitle: e.target.value })}
                          placeholder="Select an option to personalize what you see on this page."
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#7a8594', textTransform: 'uppercase' }}>
                          Presets:
                        </span>
                        {[
                          'What brings you here today?',
                          'Are you here for my projects, notes, or achievements?',
                          'Want to see my content, resources, or behind the scenes?',
                          'Curious about my practice, journey, or offerings?'
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className="tag-pill"
                            style={{ cursor: 'pointer', background: '#f5f4ed', border: '1px solid #e2e0d5', fontSize: 11 }}
                            onClick={() => updateProofPaths({ question: preset })}
                          >
                            "{preset}"
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="tree-socket-hub" title="Tree Splitter Hub" />
                  </div>
                </div>

                {/* 2. CONNECTING TRUNK */}
                <div className="tree-connector-trunk">
                  <div className="tree-connector-line" />
                </div>

                {/* 3. DECISION BRANCHES (DRAGGABLE CARDS) */}
                {(!data.profile.proofpaths?.branches || data.profile.proofpaths.branches.length === 0) ? (
                  <div className="empty-tree-card">
                    <div className="stat-icon blue" style={{ width: 56, height: 56, borderRadius: 16 }}>
                      <GitBranch size={26} />
                    </div>
                    <div>
                      <h3>Your Decision Tree has no branches yet</h3>
                      <p>
                        Generate the recommended 4-branch visitor flow (Work, Proof, Story, and Connect), or create your own custom branches.
                      </p>
                    </div>
                    <button className="primary-btn" onClick={loadDefaultBranches} style={{ marginTop: 6 }}>
                      <Sparkles size={16} /> Load Recommended ProofPath Tree
                    </button>
                  </div>
                ) : (
                  <div className="tree-branches-row">
                    {data.profile.proofpaths.branches.map((branch, idx) => {
                      const isSimulated = simulatedPathId === branch.id;
                      const isDragging = draggedBranchIndex === idx;
                      const isDragOver = dragOverBranchIndex === idx;

                      return (
                        <div
                          key={branch.id}
                          className={`tree-branch-node ${isSimulated ? 'simulated-active' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                          draggable={true}
                          onDragStart={(e) => handleBranchDragStart(e, idx)}
                          onDragOver={(e) => handleBranchDragOver(e, idx)}
                          onDrop={(e) => handleBranchDrop(e, idx)}
                          onDragEnd={handleBranchDragEnd}
                        >
                          <div className="tree-node-socket-top" />

                          <div className="tree-branch-head">
                            <div className="tree-drag-grip" title="Drag to reorder in tree">
                              <GripVertical size={18} />
                            </div>

                            <div className={`branch-icon ${branch.color || 'blue'}`}>
                              {renderBranchIcon(branch.icon, 18)}
                            </div>

                            <div className="tree-branch-info">
                              <strong>{branch.label}</strong>
                              <span>{branch.subtitle || 'Click to see filtered sections'}</span>
                            </div>

                            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                              <button
                                className="item-action-btn"
                                title="Edit Branch details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBranchModal({ open: true, item: branch });
                                }}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                className="item-action-btn delete"
                                title="Remove Branch"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProofPathBranch(branch.id);
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Step-by-Step Flow Pipeline */}
                          <div className="tree-pipeline-flow">
                            <div className="tree-pipeline-title">
                              <span>VISITOR ROUTE PIPELINE</span>
                              <span style={{ color: '#2452d8' }}>{(branch.sections || []).length} sections</span>
                            </div>

                            <div className="tree-pipeline-steps">
                              {(branch.sections || []).map((secId, sIdx) => {
                                const secMeta = getAllAvailableSections(data.profile.custom_sections).find((x) => x.id === secId);
                                return (
                                  <React.Fragment key={secId}>
                                    <span className="pipeline-chip">
                                      <span style={{ color: '#2452d8', fontSize: 10, fontWeight: 800 }}>
                                        {sIdx + 1}.
                                      </span>{' '}
                                      {secMeta?.short || secId}
                                    </span>
                                    {sIdx < (branch.sections || []).length - 1 && (
                                      <span className="pipeline-arrow">➔</span>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>

                            {/* Quick Toggle Section Chips directly in the card */}
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6, paddingTop: 6, borderTop: '1px dashed #e4e2d8' }}>
                              {getAllAvailableSections(data.profile.custom_sections).map((sec) => {
                                const active = (branch.sections || []).includes(sec.id);
                                return (
                                  <button
                                    key={sec.id}
                                    type="button"
                                    className="add-section-toggle-btn"
                                    style={{
                                      background: active ? '#eaf0ff' : '#fff',
                                      color: active ? '#2452d8' : '#737e8c',
                                      borderColor: active ? '#2452d8' : '#dcdbd3'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSectionInBranch(branch.id, sec.id);
                                    }}
                                    title={active ? `Remove ${sec.short}` : `Add ${sec.short} to path`}
                                  >
                                    {active ? `✓ ${sec.short}` : `+ ${sec.short}`}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                            <button
                              type="button"
                              className="outline-btn small"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                fontSize: 11,
                                justifyContent: 'center',
                                background: isSimulated ? '#2452d8' : '#fff',
                                color: isSimulated ? '#fff' : '#172333',
                                borderColor: isSimulated ? '#2452d8' : '#e2e0d5'
                              }}
                              onClick={() => {
                                setSimulatedPathId(isSimulated ? null : branch.id);
                                notify(`Simulator: Activated "${branch.label}" flow`);
                              }}
                            >
                              <Play size={12} /> {isSimulated ? '✓ Simulating Flow' : 'Simulate Visitor Flow'}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Branch Node Card */}
                    <button
                      type="button"
                      className="add-card"
                      style={{ minHeight: 220, cursor: 'pointer', borderRadius: 16 }}
                      onClick={() => setBranchModal({ open: true, item: null })}
                    >
                      <span>
                        <Plus size={24} />
                      </span>
                      <strong>Connect New Branch</strong>
                      <small>Add another path option to your decision tree.</small>
                    </button>
                  </div>
                )}

                {/* 4. LIVE INTERACTIVE FLOW SIMULATOR DOCK */}
                {simulatedPathId && (
                  <div className="tree-live-sim-banner">
                    <div className="tree-live-sim-banner-top">
                      <strong>
                        <Zap size={18} color="#f59e0b" /> LIVE SIMULATOR: Testing Active Visitor Journey
                      </strong>
                      <button
                        className="outline-btn small"
                        style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}
                        onClick={() => setSimulatedPathId(null)}
                      >
                        Reset Simulator ✕
                      </button>
                    </div>

                    <div className="sim-output-box">
                      <div>
                        <span style={{ fontSize: 11, color: '#9ea9ba', display: 'block', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          SELECTED VISITOR CHOICE:
                        </span>
                        <strong style={{ fontSize: 15, color: '#fff' }}>
                          "{data.profile.proofpaths?.branches?.find((b) => b.id === simulatedPathId)?.label}"
                        </strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, color: '#9ea9ba', display: 'block' }}>
                          ADAPTIVE SECTIONS REVEALED:
                        </span>
                        <strong style={{ color: '#60a5fa' }}>
                          {data.profile.proofpaths?.branches
                            ?.find((b) => b.id === simulatedPathId)
                            ?.sections?.join(' ➔ ')}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Polished Analytics Insights Cards */}
              <div className="analytics-stats-grid">
                <div className="analytics-stat-card">
                  <div className="stat-icon blue">
                    <TrendingUp size={22} />
                  </div>
                  <div className="analytics-stat-content">
                    <strong>342</strong>
                    <span>Interactive Path Explorations</span>
                  </div>
                </div>

                <div className="analytics-stat-card">
                  <div className="stat-icon green">
                    <Trophy size={22} />
                  </div>
                  <div className="analytics-stat-content">
                    <strong>48%</strong>
                    <span>Top Chosen: Work & Projects</span>
                  </div>
                </div>

                <div className="analytics-stat-card">
                  <div className="stat-icon purple">
                    <Sparkles size={22} />
                  </div>
                  <div className="analytics-stat-content">
                    <strong>+64%</strong>
                    <span>Deeper Visitor Engagement Lift</span>
                  </div>
                </div>
              </div>
            </div>
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
                      label="About me"
                      value={data.profile.about_text || data.profile.bio || ''}
                      onChange={(v) => {
                        updateProfile('about_text', v);
                        updateProfile('bio', v);
                      }}
                      placeholder="Write your comprehensive about me, journey, and background..."
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

      {/* Education Modal */}
      {educationModal.open && (
        <EducationModal
          initial={educationModal.item}
          onClose={() => setEducationModal({ open: false, item: null })}
          onSave={saveEducation}
          onDelete={deleteEducation}
        />
      )}

      {/* Certification Modal */}
      {certModal.open && (
        <CertModal
          initial={certModal.item}
          onClose={() => setCertModal({ open: false, item: null })}
          onSave={saveCertification}
          onDelete={deleteCertification}
        />
      )}

      {/* Achievement Modal */}
      {achieveModal.open && (
        <AchieveModal
          initial={achieveModal.item}
          onClose={() => setAchieveModal({ open: false, item: null })}
          onSave={saveAchievement}
          onDelete={deleteAchievement}
        />
      )}

      {/* ProofPath Branch Modal */}
      {branchModal.open && (
        <BranchModal
          initial={branchModal.item}
          onClose={() => setBranchModal({ open: false, item: null })}
          onSave={saveProofPathBranch}
          onDelete={deleteProofPathBranch}
          customSections={data.profile.custom_sections || []}
        />
      )}

      {/* Custom Tab / Section Modal */}
      {customModal.open && (
        <CustomSectionModal
          initial={customModal.item}
          onClose={() => setCustomModal({ open: false, item: null })}
          onSave={saveCustomSection}
          onDelete={deleteCustomSection}
        />
      )}

      {/* Custom Tab Item Modal */}
      {customItemModal.open && (
        <CustomItemModal
          tabTitle={(data.profile.custom_sections || []).find((s) => s.id === customItemModal.tabId)?.title || 'Section'}
          initial={customItemModal.item}
          onClose={() => setCustomItemModal({ open: false, tabId: null, item: null })}
          onSave={(item) => saveCustomItem(customItemModal.tabId, item)}
          onDelete={(itemId) => deleteCustomItem(customItemModal.tabId, itemId)}
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
        </div>

        <div className="public-standalone-actions">
          <button className="outline-btn small" onClick={copyLink}>
            <Share2 size={15} /> Copy link
          </button>
          {isOwner ? (
            <button className="primary-btn small" onClick={onNavigateHome}>
              Edit in Workspace <ArrowRight size={15} />
            </button>
          ) : null}
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
                {currentUser ? 'Go to Workspace' : 'Sign In'}
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

// Reusable Public Content Layout (Full Portfolio Experience)
function PublicPortfolioContent({ profile, projects }) {
  const edus = profile.education || [];
  const certs = profile.certifications || [];
  const achs = profile.achievements || [];
  const skills = profile.skills || [];
  const aboutText = profile.about_text || profile.bio || '';

  const proofpaths = profile.proofpaths || {
    enabled: true,
    question: 'What brings you here today?',
    subtitle: 'Select a path to explore what is most relevant to you.',
    branches: []
  };

  const branches = proofpaths.branches || [];
  const [activeBranchId, setActiveBranchId] = useState(null);
  const activeBranch = branches.find((b) => b.id === activeBranchId);

  const shouldShow = (sectionKey) => {
    if (branches.length === 0) return true;
    if (!activeBranch) return false;
    return activeBranch.sections?.includes(sectionKey);
  };

  const showContent = branches.length === 0 || activeBranchId;

  return (
    <>
      {/* NETFLIX-STYLE PROFILE CHOOSER */}
      {branches.length > 0 && !activeBranchId ? (
        <div className="netflix-picker-overlay">
          <h1 className="netflix-picker-title">
            {proofpaths.question || "Who's visiting today?"}
          </h1>
          <p className="netflix-picker-subtitle">
            {proofpaths.subtitle || "Select a profile to customize what you see on this page."}
          </p>

          <div className="netflix-profiles-row">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                className="netflix-profile-card"
                onClick={() => setActiveBranchId(b.id)}
              >
                <div className={`netflix-avatar-box ${b.color || 'blue'}`}>
                  {renderBranchIcon(b.icon, 52)}
                </div>
                <div className="netflix-profile-name">{b.label}</div>
                {b.subtitle && <div className="netflix-profile-desc">{b.subtitle}</div>}
                <span className="netflix-profile-badge">
                  {(b.sections || []).length} sections
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ACTIVE PROFILE BANNER */}
      {branches.length > 0 && activeBranch ? (
        <div className="netflix-active-bar">
          <div className="netflix-active-user">
            <div className={`netflix-active-avatar ${activeBranch.color || 'blue'}`}>
              {renderBranchIcon(activeBranch.icon, 22)}
            </div>
            <div className="netflix-active-info">
              <strong>Viewing profile: {activeBranch.label}</strong>
              <span>
                Showing {activeBranch.sections?.length} relevant sections: {activeBranch.sections?.join(' · ')}
              </span>
            </div>
          </div>

          <div className="netflix-active-actions">
            <button
              type="button"
              className="netflix-classic-btn"
              style={{ background: '#2563eb', color: '#fff', borderColor: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={() => setActiveBranchId(null)}
            >
              <RefreshCw size={14} /> Switch Profile
            </button>
          </div>
        </div>
      ) : null}

      {/* Hero Section with Comprehensive About Me directly taking this place */}
      {showContent && (
        <div className="public-profile">
          <div className="public-intro">
            <div className="public-available">
              <span className="pulse" />{' '}
              {activeBranch
                ? `ADAPTIVE VIEW · ${activeBranch.label.toUpperCase()}`
                : 'OPEN TO INTERESTING WORK & COLLABORATIONS'}
            </div>
            <h1>
              {activeBranch ? (
                activeBranch.id === 'branch-hiring' ? (
                  <>I build products that <span>solve real problems.</span></>
                ) : activeBranch.id === 'branch-client' ? (
                  <>Have an idea? <span>Let's build it.</span></>
                ) : activeBranch.id === 'branch-exploring' ? (
                  <>Hey, I'm a builder who loves <span>turning ideas into products.</span></>
                ) : activeBranch.id === 'branch-connect' ? (
                  <>Good ideas start with <span>a conversation.</span></>
                ) : (
                  <>Hey, I'm <span>{profile.name || profile.handle}.</span> <span className="wave">✳</span></>
                )
              ) : (
                <>Hey, I'm <span>{profile.name || profile.handle}.</span> <span className="wave">✳</span></>
              )}
            </h1>
            <h2>
              {activeBranch ? (
                activeBranch.id === 'branch-hiring' ? (
                  'AI Engineer · Full-Stack Builder'
                ) : activeBranch.id === 'branch-client' ? (
                  'AI Automation · Product Development · Web Apps'
                ) : activeBranch.id === 'branch-exploring' ? (
                  "A little about me and what I've been creating."
                ) : activeBranch.id === 'branch-connect' ? (
                  "Find me where I share what I'm building."
                ) : (
                  profile.role || 'Full-stack builder & engineer'
                )
              ) : (
                profile.role || 'Full-stack builder & engineer'
              )}
            </h2>

            <div className="public-about-hero-text">
              {aboutText ? (
                aboutText.split('\n').map((paragraph, idx) => (
                  <p key={idx} style={{ margin: '8px 0', lineHeight: 1.7, fontSize: 16, color: '#374151' }}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p style={{ margin: '8px 0', lineHeight: 1.7, fontSize: 16, color: '#374151' }}>
                  Showcasing the thinking, decisions, and evidence behind my work.
                </p>
              )}
            </div>

            {skills.length > 0 && (
              <div className="public-skills-grid" style={{ margin: '14px 0 18px' }}>
                {skills.map((s) => (
                  <span key={s} className="public-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
            )}

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
                <a href={safeUrl(profile.email)}>
                  <Mail size={17} /> Get in touch <ArrowUpRight size={15} />
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
      )}

      {/* Anchor Navigation & Ordered Sections */}
      {(() => {
        const orderedSections =
          activeBranch && activeBranch.sections && activeBranch.sections.length > 0
            ? activeBranch.sections
            : [
                'projects',
                'skills',
                'education',
                'certifications',
                'achievements',
                ...(profile.custom_sections || []).map((s) => s.id),
                'contact'
              ];

        const renderSectionItem = (secKey) => {
          if (secKey === 'projects' && projects.length > 0) {
            return (
              <section id="projects" className="public-section" key="sec-projects">
                <div className="public-work-heading">
                  <div>
                    <span className="section-kicker">
                      FLAGSHIP CASE STUDIES / {projects.length.toString().padStart(2, '0')}
                    </span>
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
              </section>
            );
          }

          if (secKey === 'skills' && skills.length > 0) {
            return (
              <section id="skills" className="public-section" key="sec-skills">
                <div className="public-section-heading">
                  <span className="section-kicker">TECHNICAL CAPABILITIES & STACK</span>
                  <h2>
                    Technical Skills<span className="h2-dot">.</span>
                  </h2>
                </div>
                <div
                  className="public-skills-grid large"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}
                >
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="public-skill-pill"
                      style={{
                        fontSize: 13,
                        padding: '8px 18px',
                        background: '#ffffff',
                        border: '1px solid #d5ddf0',
                        borderRadius: 20,
                        fontWeight: 700,
                        color: '#2452d8'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'about') {
            return (
              <section id="about" className="public-section" key="sec-about">
                <div className="public-section-heading">
                  <span className="section-kicker">BACKGROUND & NARRATIVE</span>
                  <h2>
                    About Me<span className="h2-dot">.</span>
                  </h2>
                </div>
                <div
                  className="public-about-box"
                  style={{
                    background: '#fffefa',
                    border: '1px solid #e9e8e2',
                    borderRadius: 16,
                    padding: '28px 32px'
                  }}
                >
                  {aboutText ? (
                    aboutText.split('\n').map((paragraph, idx) => (
                      <p
                        key={idx}
                        style={{ margin: '8px 0', lineHeight: 1.8, fontSize: 15, color: '#374151' }}
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p style={{ margin: '8px 0', lineHeight: 1.8, fontSize: 15, color: '#374151' }}>
                      {profile.bio || 'I build products that solve real problems.'}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          if (secKey === 'education' && edus.length > 0) {
            return (
              <section id="education" className="public-section" key="sec-education">
                <div className="public-section-heading">
                  <span className="section-kicker">ACADEMIC BACKGROUND</span>
                  <h2>
                    Education<span className="h2-dot">.</span>
                  </h2>
                </div>

                <div className="public-timeline-list">
                  {edus.map((edu) => (
                    <div key={edu.id} className="public-timeline-item">
                      <div className="public-timeline-left">
                        <div
                          className="public-timeline-icon"
                          style={{ background: '#eaf0ff', color: '#2452d8' }}
                        >
                          <GraduationCap size={22} />
                        </div>
                        <div className="public-timeline-content">
                          <h3>{edu.school}</h3>
                          <h4>
                            {edu.degree}
                            {edu.field ? ` · ${edu.field}` : ''}
                          </h4>
                          {edu.description && <p>{edu.description}</p>}
                        </div>
                      </div>
                      <div className="public-timeline-right">
                        <span className="public-year-pill">
                          {edu.startYear || '—'} – {edu.endYear || 'Present'}
                        </span>
                        {edu.grade && <span className="item-pill highlight">{edu.grade}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'certifications' && certs.length > 0) {
            return (
              <section id="certifications" className="public-section" key="sec-certifications">
                <div className="public-section-heading">
                  <span className="section-kicker">ACCREDITED CERTIFICATIONS</span>
                  <h2>
                    Certifications & Credentials<span className="h2-dot">.</span>
                  </h2>
                </div>

                <div className="public-certs-grid">
                  {certs.map((cert) => (
                    <div key={cert.id} className="public-cert-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            background: '#e8f7ee',
                            color: '#207e49',
                            display: 'grid',
                            placeItems: 'center'
                          }}
                        >
                          <BadgeCheck size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 15 }}>{cert.name}</h3>
                          <span>{cert.issuer}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {cert.issueDate && <span className="item-pill">{cert.issueDate}</span>}
                        {cert.credentialId && (
                          <span className="item-pill highlight">ID: {cert.credentialId}</span>
                        )}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={safeUrl(cert.credentialUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: 'auto',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#2452d8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          Verify Credential <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'achievements' && achs.length > 0) {
            return (
              <section id="achievements" className="public-section" key="sec-achievements">
                <div className="public-section-heading">
                  <span className="section-kicker">AWARDS & RECOGNITION</span>
                  <h2>
                    Achievements & Honors<span className="h2-dot">.</span>
                  </h2>
                </div>

                <div className="public-achieve-grid">
                  {achs.map((ach) => (
                    <div key={ach.id} className="public-achieve-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            background: '#fef7db',
                            color: '#b78714',
                            display: 'grid',
                            placeItems: 'center'
                          }}
                        >
                          <Trophy size={19} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 15 }}>{ach.title}</h3>
                          {ach.issuer && <span>{ach.issuer}</span>}
                        </div>
                      </div>
                      {ach.date && (
                        <div>
                          <span className="item-pill">{ach.date}</span>
                        </div>
                      )}
                      {ach.description && (
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#556070', margin: 0 }}>
                          {ach.description}
                        </p>
                      )}
                      {ach.link && (
                        <a
                          href={safeUrl(ach.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: 'auto',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#2452d8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          Read announcement <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'contact') {
            return (
              <section id="contact" className="public-contact-cta" key="sec-contact">
                <div>
                  <h3>Interested in collaborating?</h3>
                  <p>
                    Whether you have a specific project, an engineering opening, or just want to discuss ideas,
                    feel free to reach out.
                  </p>
                </div>
                <div className="actions">
                  {profile.email && (
                    <a href={safeUrl(profile.email)} className="primary-btn">
                      <Mail size={16} /> Send an email
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={safeUrl(profile.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="outline-btn"
                      style={{ color: '#172333' }}
                    >
                      <Github size={16} /> GitHub
                    </a>
                  )}
                </div>
              </section>
            );
          }

          // Custom Section (by exact id or match)
          const customSec = (profile.custom_sections || []).find(
            (s) =>
              s.id === secKey ||
              s.id === `sec-${secKey}` ||
              s.title?.toLowerCase() === secKey.toLowerCase()
          );
          if (!customSec) return null;

          return (
            <section key={customSec.id} id={customSec.id} className="public-section">
              <div className="public-section-heading">
                <span className="section-kicker">{customSec.kicker || 'CUSTOM TAB & RESOURCES'}</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap'
                  }}
                >
                  <h2>
                    {customSec.title}
                    <span className="h2-dot">.</span>
                  </h2>
                  {customSec.buttonUrl && (
                    <a
                      href={safeUrl(customSec.buttonUrl)}
                      target={customSec.buttonUrl.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="primary-btn small"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <Download size={15} /> {customSec.buttonText || 'Open Link / Resource'}
                    </a>
                  )}
                </div>
                {customSec.description && (
                  <p style={{ marginTop: 6, fontSize: 15, color: '#556070', maxWidth: 700 }}>
                    {customSec.description}
                  </p>
                )}
              </div>

              {customSec.items && customSec.items.length > 0 && (
                <div className="public-achieve-grid" style={{ marginTop: 24 }}>
                  {customSec.items.map((item) => (
                    <div key={item.id} className="public-achieve-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            background: '#eaf0ff',
                            color: '#2452d8',
                            display: 'grid',
                            placeItems: 'center'
                          }}
                        >
                          {renderBranchIcon(customSec.icon || 'FileText', 19)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: 15 }}>{item.title}</h3>
                          {item.subtitle && <span>{item.subtitle}</span>}
                        </div>
                      </div>
                      {item.date && (
                        <div>
                          <span className="item-pill">{item.date}</span>
                        </div>
                      )}
                      {item.description && (
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#556070', margin: 0 }}>
                          {item.description}
                        </p>
                      )}
                      {item.link && (
                        <a
                          href={safeUrl(item.link)}
                          target={item.link.startsWith('mailto:') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          style={{
                            marginTop: 'auto',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#2452d8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          View details <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {customSec.content && (
                <div className="custom-section-box">
                  <div className="custom-section-body">
                    {customSec.content.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        };

        return (
          <>
            {showContent && (
              <nav className="public-subnav">
                {orderedSections.map((secKey) => {
                  if (secKey === 'projects' && projects.length > 0) {
                    return (
                      <a key="nav-projects" href="#projects">
                        Projects ({projects.length})
                      </a>
                    );
                  }
                  if (secKey === 'skills' && skills.length > 0) {
                    return (
                      <a key="nav-skills" href="#skills">
                        Skills ({skills.length})
                      </a>
                    );
                  }
                  if (secKey === 'about') {
                    return (
                      <a key="nav-about" href="#about">
                        About
                      </a>
                    );
                  }
                  if (secKey === 'education' && edus.length > 0) {
                    return (
                      <a key="nav-education" href="#education">
                        Education ({edus.length})
                      </a>
                    );
                  }
                  if (secKey === 'certifications' && certs.length > 0) {
                    return (
                      <a key="nav-certifications" href="#certifications">
                        Certifications ({certs.length})
                      </a>
                    );
                  }
                  if (secKey === 'achievements' && achs.length > 0) {
                    return (
                      <a key="nav-achievements" href="#achievements">
                        Achievements ({achs.length})
                      </a>
                    );
                  }
                  if (secKey === 'contact') {
                    return (
                      <a key="nav-contact" href="#contact">
                        Contact
                      </a>
                    );
                  }
                  const cSec = (profile.custom_sections || []).find(
                    (s) =>
                      s.id === secKey ||
                      s.id === `sec-${secKey}` ||
                      s.title?.toLowerCase() === secKey.toLowerCase()
                  );
                  if (cSec) {
                    return (
                      <a key={`nav-${cSec.id}`} href={`#${cSec.id}`}>
                        {cSec.title} ({(cSec.items || []).length})
                      </a>
                    );
                  }
                  return null;
                })}
              </nav>
            )}

            {showContent && orderedSections.map((secKey) => renderSectionItem(secKey))}
          </>
        );
      })()}

      {showContent && (
        <footer className="public-footer">
          <span>
            Made with{' '}
            <strong>
              proofpage<span className="brand-dot">.</span>
            </strong>
          </span>
          <span>Great work deserves great storytelling. ✳</span>
        </footer>
      )}
    </>
  );
}

// Dedicated Authentication Page (Shown whenever user is not signed in)
function AuthPage({ initialMode = 'login', onSuccess, onExploreDemo, notify }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1); // 1 | 2 | 3 for registration onboarding
  const [multipleHats, setMultipleHats] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState(['student']);
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedGoals, setSelectedGoals] = useState(['work', 'credibility']);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  const PERSONA_OPTIONS = [
    { id: 'student', label: 'Student', desc: 'Learning, projects & achievements', icon: '🎓' },
    { id: 'creator', label: 'Digital Creator', desc: 'Content, collaborations & community', icon: '✨' },
    { id: 'professional', label: 'Professional', desc: 'Career, experience & expertise', icon: '💼' },
    { id: 'business', label: 'Business Owner', desc: 'Brand, products & credibility', icon: '🏢' },
    { id: 'coach', label: 'Coach / Educator', desc: 'Knowledge, resources & impact', icon: '🏅' },
    { id: 'freelancer', label: 'Freelancer / Artist', desc: 'Creative work & client projects', icon: '🎨' },
    { id: 'wellness', label: 'Wellness / Spiritual', desc: 'Practice, journey & community', icon: '🌿' },
    { id: 'other', label: 'Something else', desc: 'Make your page entirely yours', icon: '✳️' }
  ];

  const GOAL_OPTIONS = [
    { id: 'work', label: 'Show what I do', desc: 'Work, creations, projects' },
    { id: 'story', label: 'Tell my story', desc: 'Journey, experiences, interests' },
    { id: 'credibility', label: 'Build credibility', desc: 'Reviews, achievements, proof' },
    { id: 'resources', label: 'Share useful things', desc: 'Notes, guides, collections' },
    { id: 'community', label: 'Find my people', desc: 'Socials, communities, connections' },
    { id: 'unique', label: 'Something unique', desc: "I'll decide what goes here" }
  ];

  const togglePersona = (pId) => {
    if (multipleHats) {
      setSelectedPersonas((prev) =>
        prev.includes(pId)
          ? prev.length > 1
            ? prev.filter((x) => x !== pId)
            : prev
          : [...prev, pId]
      );
    } else {
      setSelectedPersonas([pId]);
    }
  };

  const toggleGoal = (gId) => {
    setSelectedGoals((prev) =>
      prev.includes(gId)
        ? prev.length > 1
          ? prev.filter((x) => x !== gId)
          : prev
        : [...prev, gId]
    );
  };

  const primaryPersona = selectedPersonas[0] || 'student';

  const getGeneratedQuestion = () => {
    if (selfDescription.trim()) return `Curious about my work, journey, or collaborating?`;
    switch (primaryPersona) {
      case 'student':
        return 'Are you here for my projects, notes, or achievements?';
      case 'creator':
        return 'Want to see my content, resources, or behind the scenes?';
      case 'wellness':
        return 'Curious about my practice, journey, or readings?';
      case 'business':
        return 'Looking for products, our story, or client reviews?';
      case 'coach':
        return 'Want to explore my approach, resources, or testimonials?';
      case 'freelancer':
        return 'Looking to commission work, view projects, or connect?';
      case 'other':
        return 'What brings you to my space today?';
      default:
        return 'Want to see my projects, technical skills, or experience?';
    }
  };

  const getGeneratedBranches = () => {
    return [
      {
        id: 'branch-work',
        label:
          primaryPersona === 'student'
            ? 'Explore my projects'
            : primaryPersona === 'creator'
              ? 'See my creations & work'
              : 'I want to work with you',
        subtitle: 'See services, experience, and flagship projects',
        icon: 'Briefcase',
        color: 'blue',
        sections: ['projects', 'about', 'contact']
      },
      {
        id: 'branch-proof',
        label: "Show me what you've done",
        subtitle: 'Explore case studies, metrics, certifications & proof',
        icon: 'Trophy',
        color: 'amber',
        sections: ['projects', 'certifications', 'achievements']
      },
      {
        id: 'branch-story',
        label:
          primaryPersona === 'wellness'
            ? 'My journey & practice'
            : "I'm just exploring / Know me better",
        subtitle: 'Discover the story, background & education',
        icon: 'User',
        color: 'purple',
        sections: ['about', 'education', 'achievements']
      },
      {
        id: 'branch-connect',
        label: "Let's connect",
        subtitle: 'Find socials, communities, and ways to reach out',
        icon: 'Mail',
        color: 'green',
        sections: ['contact', 'about']
      }
    ];
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'alexbuilds', password: 'demo123456' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');
      onSuccess(data);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        if (!res.ok) throw new Error(data.error || 'Invalid username/email or password');
        onSuccess(data);
      } else {
        const generatedQ = getGeneratedQuestion();
        const generatedB = getGeneratedBranches();
        const personaLabels = selectedPersonas
          .map((p) => PERSONA_OPTIONS.find((x) => x.id === p)?.label || p)
          .join(', ');

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            persona: personaLabels,
            selfDescription,
            openingQuestion: generatedQ,
            branches: generatedB
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanHandle = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');

  return (
    <div className="auth-page-wrapper">
      <header className="auth-page-header">
        <div className="brand" style={{ cursor: 'default' }}>
          <span className="brand-icon">
            <span />
          </span>
          <span>
            proofpage<span className="brand-dot">.</span>
          </span>
        </div>

        <div className="auth-header-actions">
          <span className="db-pill" title="Connected to Neon PostgreSQL Serverless database">
            <span className="db-pill-dot" /> Neon DB Cloud
          </span>
          {onExploreDemo && (
            <button className="outline-btn small" onClick={onExploreDemo}>
              <Eye size={15} /> View Demo Portfolio <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </header>

      <main className="auth-page-main">
        {/* Left: Value Proposition & Showcase */}
        <section className="auth-hero-section">
          <div className="auth-hero-badge">
            <Sparkles size={13} color="#2452d8" />
            ENGINEERING-FIRST PORTFOLIO BUILDER
          </div>

          <h1>
            Proof over promises.
            <em>Showcase what you really built.</em>
          </h1>

          <p className="auth-hero-desc">
            Standard portfolios list static keywords. ProofPage highlights real architectural decisions,
            technical trade-offs, and measurable evidence with an adaptive ProofPath for every visitor.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <GitBranch size={18} />
              </div>
              <div className="auth-feature-text">
                <strong>ProofPaths Decision Engine</strong>
                <p>One profile. Different visitors see what matters to them with interactive paths.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Code2 size={18} />
              </div>
              <div className="auth-feature-text">
                <strong>Structured Proof Format</strong>
                <p>Present the problem, technical approach, metrics, and live demo side-by-side.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Database size={18} />
              </div>
              <div className="auth-feature-text">
                <strong>Persistent Cloud Storage</strong>
                <p>Auto-synced with Neon PostgreSQL so your projects are always saved safely.</p>
              </div>
            </div>
          </div>

          <div className="auth-sample-card">
            <div className="auth-sample-top">
              <span>FEATURED CASE STUDY PREVIEW</span>
              <span className="status shipped">Shipped</span>
            </div>
            <div className="auth-sample-title">Orbit Analytics — Product Growth Engine</div>
            <div className="auth-sample-metrics">
              <div>
                <b>42%</b>
                <small>Faster reporting</small>
              </div>
              <div>
                <b>1.2s</b>
                <small>Page load speed</small>
              </div>
              <div>
                <b>3</b>
                <small>Connected data sources</small>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Auth Card / Onboarding Wizard */}
        <section className="auth-card-container">
          <div className="auth-tab-switcher">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Create Account
            </button>
          </div>

          {/* ============================================================ */}
          {/* LOGIN FORM */}
          {/* ============================================================ */}
          {mode === 'login' && (
            <>
              <div className="auth-card-header">
                <h2>Sign in to ProofPage</h2>
                <p>Enter your credentials below to access your workspace and edit your projects.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="auth-error">
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="auth-field">
                  <label>
                    <span>Username or Email</span>
                  </label>
                  <div className="auth-input-wrap">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="alexbuilds or hello@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>
                    <span>Password</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} /> Sign In to Workspace
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-switch">
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setStep(1);
                      setError('');
                    }}
                  >
                    Start 3-step setup
                  </button>
                </span>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* 3-STEP GUIDED ONBOARDING REGISTRATION */}
          {/* ============================================================ */}
          {mode === 'register' && (
            <div className="onboarding-wizard">
              {/* STEP 1: WHO ARE YOU? */}
              {step === 1 && (
                <div className="onboarding-step-content">
                  <div className="onboarding-step-pill">STEP 01 OF 03 ✳</div>
                  <h2 style={{ fontSize: 24, letterSpacing: -0.8, margin: '8px 0' }}>
                    What describes you best?
                  </h2>
                  <p className="onboarding-subtitle">
                    We'll personalize your page around what you do. You can change this later.
                  </p>

                  <div className="persona-grid">
                    {PERSONA_OPTIONS.map((p) => {
                      const selected = selectedPersonas.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className={`persona-card ${selected ? 'selected' : ''}`}
                          onClick={() => togglePersona(p.id)}
                        >
                          <div className="persona-icon">{p.icon}</div>
                          <div className="persona-info">
                            <strong>{p.label}</strong>
                            <span>{p.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#475467',
                      marginBottom: 20
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={multipleHats}
                      onChange={(e) => setMultipleHats(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: '#2452d8' }}
                    />
                    I wear multiple hats (Select multiple categories)
                  </label>

                  <div className="onboarding-nav">
                    <span style={{ fontSize: 12, color: '#667085' }}>
                      Adapts starter layout & paths
                    </span>
                    <button
                      type="button"
                      className="dark-btn"
                      onClick={() => setStep(2)}
                      disabled={selectedPersonas.length === 0}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: WHAT WOULD YOU LOVE TO DO WITH YOUR PAGE? */}
              {step === 2 && (
                <div className="onboarding-step-content">
                  <div className="onboarding-step-pill">STEP 02 OF 03 ✳</div>
                  <h2 style={{ fontSize: 24, letterSpacing: -0.8, margin: '8px 0' }}>
                    What would you love to do with your page?
                  </h2>
                  <p className="onboarding-subtitle">
                    You don't need a label. Choose as many as you like.
                  </p>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#344054', marginBottom: 6 }}>
                      I would describe myself as… (optional)
                    </label>
                    <input
                      type="text"
                      className="auth-input"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #dcdad2',
                        fontSize: 13
                      }}
                      placeholder="e.g. Creative technologist building real-time audio tools"
                      value={selfDescription}
                      onChange={(e) => setSelfDescription(e.target.value)}
                    />
                  </div>

                  <div className="goals-grid">
                    {GOAL_OPTIONS.map((g) => {
                      const selected = selectedGoals.includes(g.id);
                      return (
                        <div
                          key={g.id}
                          className={`goal-card ${selected ? 'selected' : ''}`}
                          onClick={() => toggleGoal(g.id)}
                        >
                          <div className="goal-check">
                            {selected && <Check size={12} />}
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: 13, color: '#172333' }}>
                              {g.label}
                            </strong>
                            <span style={{ display: 'block', fontSize: 11, color: '#6d7785', marginTop: 2 }}>
                              {g.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="onboarding-nav">
                    <button type="button" className="outline-btn" onClick={() => setStep(1)}>
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="dark-btn"
                      onClick={() => setStep(3)}
                      disabled={selectedGoals.length === 0}
                    >
                      Build my ProofPath <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PROOFPATH PREVIEW & ACCOUNT SETUP */}
              {step === 3 && (
                <div className="onboarding-step-content">
                  <div className="onboarding-step-pill">STEP 03 OF 03 ✳</div>
                  <h2 style={{ fontSize: 24, letterSpacing: -0.8, margin: '8px 0' }}>
                    Your adaptive ProofPath is ready.
                  </h2>
                  <p className="onboarding-subtitle">
                    Visitors see this decision tree when opening your link. Claim your handle to activate it.
                  </p>

                  {/* Generated Decision-Tree Preview Card */}
                  <div
                    style={{
                      background: '#fffefa',
                      border: '1.5px solid #2452d8',
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 20
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#2452d8', letterSpacing: 0.8, marginBottom: 6 }}>
                      <Sparkles size={13} /> GENERATED OPENING QUESTION
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#172333' }}>
                      "{getGeneratedQuestion()}"
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                      {getGeneratedBranches().map((b) => (
                        <span
                          key={b.id}
                          className="branch-section-pill"
                          style={{ background: '#eaf0ff', color: '#2452d8', fontSize: 11, padding: '4px 8px' }}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                      <div className="auth-error">
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="auth-field">
                      <label>
                        <span>Choose your handle / username *</span>
                      </label>
                      <div className="auth-input-wrap">
                        <User size={16} className="auth-input-icon" />
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="e.g. sarahbuilds"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="auth-handle-preview">
                        Your public portfolio will be: <code>/p/{cleanHandle || 'yourhandle'}</code>
                      </div>
                    </div>

                    <div className="auth-field">
                      <label>
                        <span>Email address *</span>
                      </label>
                      <div className="auth-input-wrap">
                        <Mail size={16} className="auth-input-icon" />
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label>
                        <span>Password *</span>
                      </label>
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="auth-eye-btn"
                          title={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="onboarding-nav">
                      <button type="button" className="outline-btn" onClick={() => setStep(2)}>
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button type="submit" className="dark-btn" disabled={submitting}>
                        {submitting ? (
                          <>
                            <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                            <span>Creating your ProofPage...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} /> Create My ProofPage ✳
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
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
  if (!s || typeof s !== 'string') return '#';
  const trimmed = s.trim();
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (trimmed.includes('@') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `mailto:${trimmed}`;
  }
  try {
    const u = new URL(trimmed);
    return ['https:', 'http:', 'mailto:'].includes(u.protocol) ? u.href : '#';
  } catch {
    if (trimmed.startsWith('www.') || trimmed.includes('.com') || trimmed.includes('.org') || trimmed.includes('.io')) {
      return `https://${trimmed}`;
    }
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

function SkillInput({ onAdd }) {
  const [val, setVal] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (val.trim()) {
        onAdd(val.trim());
        setVal('');
      }
    }
  };
  return (
    <div className="skill-add-input-bar">
      <input
        type="text"
        placeholder="Type a skill (e.g. Next.js, Docker, Python) and press Enter..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="primary-btn small"
        onClick={() => {
          if (val.trim()) {
            onAdd(val.trim());
            setVal('');
          }
        }}
      >
        <Plus size={16} /> Add Skill
      </button>
    </div>
  );
}

function EducationModal({ initial, onClose, onSave, onDelete }) {
  const [item, setItem] = useState(
    initial || {
      id: '',
      school: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: ''
    }
  );
  const update = (k, v) => setItem((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.school.trim()) return alert('School / Institution name is required');
    onSave(item);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">EDUCATION</span>
            <h2>{initial ? 'Edit Education' : 'Add Education'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="School or Institution *"
                value={item.school}
                onChange={(v) => update('school', v)}
                placeholder="e.g. UC Berkeley, MIT, General Assembly"
                wide
              />
              <Field
                label="Degree or Program"
                value={item.degree}
                onChange={(v) => update('degree', v)}
                placeholder="e.g. B.S., M.S., Bootcamp Graduate"
              />
              <Field
                label="Field of Study"
                value={item.field}
                onChange={(v) => update('field', v)}
                placeholder="e.g. Computer Science, Software Engineering"
              />
              <Field
                label="Start Year"
                value={item.startYear}
                onChange={(v) => update('startYear', v)}
                placeholder="e.g. 2019"
              />
              <Field
                label="End Year (or Present)"
                value={item.endYear}
                onChange={(v) => update('endYear', v)}
                placeholder="e.g. 2023 or Present"
              />
              <Field
                label="Grade / GPA / Honors"
                value={item.grade}
                onChange={(v) => update('grade', v)}
                placeholder="e.g. 3.85 GPA, Dean's List, First Class"
                wide
              />
              <Field
                label="Relevant Coursework, Activities & Notes"
                value={item.description}
                onChange={(v) => update('description', v)}
                placeholder="Mention key modules, research, thesis, or societies..."
                area
                wide
              />
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Education
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CertModal({ initial, onClose, onSave, onDelete }) {
  const [item, setItem] = useState(
    initial || {
      id: '',
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: ''
    }
  );
  const update = (k, v) => setItem((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.name.trim() || !item.issuer.trim()) {
      return alert('Certification title and issuing organization are required');
    }
    onSave(item);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">CERTIFICATION</span>
            <h2>{initial ? 'Edit Certification' : 'Add Certification'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="Certification Name *"
                value={item.name}
                onChange={(v) => update('name', v)}
                placeholder="e.g. AWS Certified Solutions Architect"
                wide
              />
              <Field
                label="Issuing Organization *"
                value={item.issuer}
                onChange={(v) => update('issuer', v)}
                placeholder="e.g. Amazon Web Services, Meta, Google Cloud"
              />
              <Field
                label="Issue Date / Year"
                value={item.issueDate}
                onChange={(v) => update('issueDate', v)}
                placeholder="e.g. 2024"
              />
              <Field
                label="Credential ID / License Number"
                value={item.credentialId}
                onChange={(v) => update('credentialId', v)}
                placeholder="e.g. AWS-PSA-99381"
                wide
              />
              <Field
                label="Verification URL"
                value={item.credentialUrl}
                onChange={(v) => update('credentialUrl', v)}
                placeholder="https://..."
                wide
              />
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Certification
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function AchieveModal({ initial, onClose, onSave, onDelete }) {
  const [item, setItem] = useState(
    initial || {
      id: '',
      title: '',
      issuer: '',
      date: '',
      description: '',
      link: ''
    }
  );
  const update = (k, v) => setItem((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.title.trim()) return alert('Achievement title is required');
    onSave(item);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">ACHIEVEMENT</span>
            <h2>{initial ? 'Edit Achievement' : 'Add Achievement'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="Title or Award Name *"
                value={item.title}
                onChange={(v) => update('title', v)}
                placeholder="e.g. 1st Place Winner — Global AI Hackathon"
                wide
              />
              <Field
                label="Organization or Event"
                value={item.issuer}
                onChange={(v) => update('issuer', v)}
                placeholder="e.g. TechCrunch Disrupt 2025"
              />
              <Field
                label="Date / Year"
                value={item.date}
                onChange={(v) => update('date', v)}
                placeholder="e.g. 2025"
              />
              <Field
                label="Description & Highlights"
                value={item.description}
                onChange={(v) => update('description', v)}
                placeholder="Describe the challenge, outcome, or significance of the honor..."
                area
                wide
              />
              <Field
                label="Link / Certificate / Press URL"
                value={item.link}
                onChange={(v) => update('link', v)}
                placeholder="https://..."
                wide
              />
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Achievement
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function renderBranchIcon(iconName, size = 18) {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase size={size} />;
    case 'Trophy':
      return <Trophy size={size} />;
    case 'User':
      return <User size={size} />;
    case 'Mail':
      return <Mail size={size} />;
    case 'Compass':
      return <Compass size={size} />;
    case 'Code2':
      return <Code2 size={size} />;
    case 'GraduationCap':
      return <GraduationCap size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    case 'Heart':
      return <Heart size={size} />;
    case 'Palette':
      return <Palette size={size} />;
    case 'Globe':
      return <Globe size={size} />;
    case 'FileText':
      return <FileText size={size} />;
    case 'Download':
      return <Download size={size} />;
    case 'Calendar':
      return <Calendar size={size} />;
    case 'Layers':
      return <Layers size={size} />;
    case 'Award':
    case 'BadgeCheck':
      return <Award size={size} />;
    case 'Zap':
      return <Zap size={size} />;
    case 'Share2':
      return <Share2 size={size} />;
    default:
      return <FileText size={size} />;
  }
}

function BranchModal({ initial, onClose, onSave, onDelete, customSections = [] }) {
  const [label, setLabel] = useState(initial?.label || '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle || '');
  const [icon, setIcon] = useState(initial?.icon || 'Briefcase');
  const [color, setColor] = useState(initial?.color || 'blue');
  const [sections, setSections] = useState(
    initial?.sections || ['projects', 'contact']
  );

  const availableSections = [
    { id: 'projects', name: 'Projects & Case Studies' },
    { id: 'education', name: 'Education & Academics' },
    { id: 'certifications', name: 'Certifications & Credentials' },
    { id: 'achievements', name: 'Achievements & Honors' },
    ...(customSections || []).map((c) => ({
      id: c.id,
      name: `${c.title} (Custom Tab)`
    })),
    { id: 'contact', name: 'Contact & Social Links' }
  ];

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return alert('Please enter a branch label');
    if (sections.length === 0) return alert('Please select at least one visible section for this branch');
    onSave({
      id: initial?.id || 'branch-' + Math.random().toString(36).substring(2, 9),
      label: label.trim(),
      subtitle: subtitle.trim(),
      icon,
      color,
      sections
    });
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">PROOFPATHS DECISION ENGINE</span>
            <h2>{initial ? 'Edit Path Branch' : 'Add Path Branch'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="Branch Label (What the visitor clicks) *"
                value={label}
                onChange={setLabel}
                placeholder="e.g. I want to work with you / See my projects"
                wide
              />
              <Field
                label="Subtitle / Description"
                value={subtitle}
                onChange={setSubtitle}
                placeholder="e.g. Services, experience, and flagship projects"
                wide
              />

              <div className="field">
                <span>Branch Icon</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {['Briefcase', 'Trophy', 'User', 'Mail', 'Compass', 'Code2', 'GraduationCap', 'Sparkles', 'Heart', 'Palette'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`item-action-btn ${icon === ic ? 'active' : ''}`}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: icon === ic ? '2px solid #2452d8' : '1px solid #dcdbd3',
                        background: icon === ic ? '#eaf0ff' : '#fff'
                      }}
                      onClick={() => setIcon(ic)}
                      title={ic}
                    >
                      {renderBranchIcon(ic, 17)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>Color Theme</span>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  {['blue', 'amber', 'purple', 'green', 'pink'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`theme-dot ${color === c ? 'active' : ''}`}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: color === c ? '2px solid #172333' : '1px solid transparent',
                        background: c === 'blue' ? '#2452d8' : c === 'amber' ? '#f59e0b' : c === 'purple' ? '#7c3aed' : c === 'green' ? '#10b981' : '#ec4899',
                        cursor: 'pointer'
                      }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="field wide" style={{ marginTop: 10 }}>
                <span>Visible Sections for this Path (Which sections reveal when chosen?)</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {availableSections.map((sec) => {
                    const checked = sections.includes(sec.id);
                    return (
                      <label
                        key={sec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: checked ? '1.5px solid #2452d8' : '1px solid #e2e1d8',
                          background: checked ? '#f4f7ff' : '#fff',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 600
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSection(sec.id)}
                          style={{ accentColor: '#2452d8', width: 16, height: 16 }}
                        />
                        {sec.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(initial.id)}
              >
                <Trash2 size={15} /> Delete Branch
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Branch
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomSectionModal({ initial, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [kicker, setKicker] = useState(initial?.kicker || 'CUSTOM TAB & RESOURCES');
  const [icon, setIcon] = useState(initial?.icon || 'FileText');
  const [description, setDescription] = useState(initial?.description || '');
  const [buttonText, setButtonText] = useState(initial?.buttonText || '');
  const [buttonUrl, setButtonUrl] = useState(initial?.buttonUrl || '');
  const [content, setContent] = useState(initial?.content || '');

  const availableIcons = [
    { id: 'FileText', label: 'Resume / Document' },
    { id: 'Download', label: 'Download' },
    { id: 'Sparkles', label: 'Feature / Magic' },
    { id: 'Briefcase', label: 'Services / Work' },
    { id: 'Globe', label: 'Web / Press' },
    { id: 'Award', label: 'Certificate / Award' },
    { id: 'Calendar', label: 'Bookings / Events' },
    { id: 'Heart', label: 'Community / Wellness' },
    { id: 'Layers', label: 'Collections' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a tab title (e.g. Resume & CV)');
    onSave({
      id: initial?.id || 'custom-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      kicker: kicker.trim(),
      icon,
      description: description.trim(),
      buttonText: buttonText.trim(),
      buttonUrl: buttonUrl.trim(),
      content: content.trim()
    });
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">CUSTOM PORTFOLIO TAB</span>
            <h2>{initial ? 'Edit Custom Tab' : 'Create Custom Tab'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="Tab Title (e.g. Resume & CV, Client Services, Publications) *"
                value={title}
                onChange={setTitle}
                placeholder="Resume & CV"
                wide
              />
              <Field
                label="Section Tag / Kicker (small uppercase header)"
                value={kicker}
                onChange={setKicker}
                placeholder="CAREER OVERVIEW & PDF"
                wide
              />

              <div className="field wide">
                <span>Tab Icon</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {availableIcons.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`item-action-btn ${icon === item.id ? 'active' : ''}`}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: icon === item.id ? '2px solid #2452d8' : '1px solid #dcdbd3',
                        background: icon === item.id ? '#eaf0ff' : '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => setIcon(item.id)}
                    >
                      {renderBranchIcon(item.id, 16)} {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Short Description / Subtitle"
                value={description}
                onChange={setDescription}
                placeholder="Brief introduction or context for this tab"
                wide
              />

              <Field
                label="Action / Download Button Label (Optional)"
                value={buttonText}
                onChange={setButtonText}
                placeholder="e.g. Download Full Resume (PDF) / Book a Call"
              />

              <Field
                label="Action Button Link / URL (Optional)"
                value={buttonUrl}
                onChange={setButtonUrl}
                placeholder="https://example.com/resume.pdf"
              />

              <div className="field wide">
                <span>Detailed Content / Bullets / Highlights</span>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add bullet points, career highlights, service tiers, or any detailed notes..."
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #dcdbd3',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    lineHeight: 1.6
                  }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(initial.id)}
              >
                <Trash2 size={15} /> Delete Tab
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Tab
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomItemModal({ tabTitle = 'Section', initial, onClose, onSave, onDelete }) {
  const [item, setItem] = useState(
    initial || {
      id: '',
      title: '',
      subtitle: '',
      date: '',
      description: '',
      link: ''
    }
  );
  const update = (k, v) => setItem((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.title.trim()) return alert('Item title is required');
    onSave(item);
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-head">
          <div>
            <span className="section-kicker">{(tabTitle || 'CUSTOM').toUpperCase()}</span>
            <h2>{initial ? `Edit ${tabTitle} Entry` : `Add to ${tabTitle}`}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            <div className="form-grid">
              <Field
                label="Entry / Item Title *"
                value={item.title}
                onChange={(v) => update('title', v)}
                placeholder={`e.g. ${tabTitle === 'Services' ? 'Full-Stack MVP Development' : 'Entry / Item Title'}`}
                wide
              />
              <Field
                label="Subtitle / Role / Price"
                value={item.subtitle}
                onChange={(v) => update('subtitle', v)}
                placeholder="e.g. $3,500+ / Fixed Scope / Co-Author / Lead"
              />
              <Field
                label="Date / Timeline / Badge"
                value={item.date}
                onChange={(v) => update('date', v)}
                placeholder="e.g. 2-3 weeks / 2026 / Available Now"
              />
              <Field
                label="Description & Details"
                value={item.description}
                onChange={(v) => update('description', v)}
                placeholder="Describe this item, service tier, deliverables, or highlights in detail..."
                area
                wide
              />
              <Field
                label="Action / Resource Link (Optional)"
                value={item.link}
                onChange={(v) => update('link', v)}
                placeholder="https://example.com"
                wide
              />
            </div>
          </div>

          <div className="modal-footer">
            {initial && onDelete ? (
              <button
                type="button"
                className="outline-btn"
                style={{ color: '#c54037' }}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={15} /> Delete Entry
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button type="button" className="outline-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="dark-btn">
                <Check size={16} /> Save Entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
