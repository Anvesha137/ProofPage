import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sql, initDb } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'proofpage_super_secret_jwt_key_2026_neon';

// Helper to parse JSON body across Vite and Vercel
async function getBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, status, data) {
  if (typeof res.status === 'function') {
    res.status(status);
  } else {
    res.statusCode = status;
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function authenticate(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function generateUniqueCode(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

function formatProfile(p) {
  if (!p) return null;
  const parseJsonSafe = (val, def = []) => {
    if (!val) return def;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch {
      return def;
    }
  };

  return {
    name: p.name || '',
    handle: p.handle || '',
    role: p.role || '',
    bio: p.bio || '',
    about_text: p.about_text || '',
    location: p.location || '',
    email: p.email || '',
    github: p.github || '',
    website: p.website || '',
    avatar: p.avatar || '',
    skills: parseJsonSafe(p.skills, []),
    education: parseJsonSafe(p.education, []),
    certifications: parseJsonSafe(p.certifications, []),
    achievements: parseJsonSafe(p.achievements, []),
    custom_sections: parseJsonSafe(p.custom_sections, []),
    proofpaths: parseJsonSafe(p.proofpaths, {
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
    })
  };
}

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    return res.end();
  }

  try {
    await initDb();

    // Parse URL and pathname
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = parsedUrl.pathname;
    
    // Normalize path (handle leading /api or trailing slash)
    pathname = pathname.replace(/\/+$/, '');

    // 1. PUBLIC PROFILE ROUTE: /api/public/:handle or /api/public?handle=...
    if (pathname.startsWith('/api/public') || pathname === '/api/public') {
      let handle = parsedUrl.searchParams.get('handle');
      if (!handle) {
        const parts = pathname.split('/').filter(Boolean);
        // parts = ['api', 'public', ':handle']
        if (parts.length >= 3) {
          handle = parts[2];
        }
      }

      if (!handle) {
        return sendJson(res, 400, { error: 'Username/handle is required' });
      }

      handle = handle.toLowerCase().trim();

      const profileRows = await sql.query(
        'SELECT * FROM profiles WHERE LOWER(handle) = $1 LIMIT 1',
        [handle]
      );

      if (!profileRows || profileRows.length === 0) {
        return sendJson(res, 404, { error: 'User profile not found' });
      }

      const profile = profileRows[0];
      const projectRows = await sql.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY display_order ASC, created_at DESC',
        [profile.user_id]
      );

      const projects = projectRows.map((p) => ({
        ...p,
        stack: typeof p.stack === 'string' ? JSON.parse(p.stack) : (p.stack || []),
        metrics: typeof p.metrics === 'string' ? JSON.parse(p.metrics) : (p.metrics || [])
      }));

      return sendJson(res, 200, {
        profile: formatProfile(profile),
        projects
      });
    }

    // 2. AUTH REGISTER: POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await getBody(req);
      let { username, email, password } = body;

      if (!username || !email || !password) {
        return sendJson(res, 400, { error: 'Username, email, and password are required' });
      }

      username = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      email = email.toLowerCase().trim();

      if (username.length < 3) {
        return sendJson(res, 400, { error: 'Username must be at least 3 characters (letters, numbers, underscores)' });
      }

      if (password.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters' });
      }

      // Check existing username or email
      const existing = await sql.query(
        'SELECT id FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $2 LIMIT 1',
        [username, email]
      );

      if (existing && existing.length > 0) {
        return sendJson(res, 409, { error: 'Username or email is already taken' });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const userRes = await sql.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, passwordHash]
      );

      const user = userRes[0];

      // Create initial profile
      const displayName = username.charAt(0).toUpperCase() + username.slice(1);
      const customRole = body.profile?.role || (body.persona ? `${body.persona}` : 'Full-stack builder');
      const customBio = body.profile?.bio || `Hi, I'm ${displayName}. I design and build high-quality digital products.`;
      const customAbout = body.profile?.about_text || body.selfDescription || `I am an engineer and creator dedicated to building reliable, high-performance web products.`;
      const customSkills = body.profile?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'CSS'];
      const customProofpaths = body.profile?.proofpaths || {
        enabled: true,
        question: body.openingQuestion || 'What brings you here today?',
        subtitle: 'Select a path to explore what is most relevant to you, or view the full page.',
        branches: body.branches || [
          {
            id: 'branch-work',
            label: 'I want to work with you',
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
      };

      const profileRes = await sql.query(
        `INSERT INTO profiles (user_id, name, handle, role, bio, location, email, github, website, avatar, about_text, skills, education, certifications, achievements, proofpaths, custom_sections)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb)
         RETURNING *`,
        [
          user.id,
          displayName,
          username,
          customRole,
          customBio,
          'Remote',
          email,
          '',
          '',
          '',
          customAbout,
          JSON.stringify(customSkills),
          JSON.stringify(body.profile?.education || []),
          JSON.stringify(body.profile?.certifications || []),
          JSON.stringify(body.profile?.achievements || []),
          JSON.stringify(customProofpaths),
          JSON.stringify(body.profile?.custom_sections || [])
        ]
      );

      // Create starter project
      const starterId = 'p-' + Math.random().toString(36).substring(2, 9);
      const starterProject = {
        id: starterId,
        user_id: user.id,
        title: 'First Flagship Project',
        subtitle: 'A thoughtful solution built with modern web technologies.',
        category: 'Full-stack',
        year: '2026',
        status: 'Shipped',
        description: 'Document your journey, key decisions, and measurable results here.',
        problem: 'Clear problem statement that motivated building this application.',
        solution: 'Engineered an intuitive interface with reliable architecture.',
        impact: 'Delivered measurable improvements and positive user feedback.',
        stack: JSON.stringify(['React', 'PostgreSQL', 'Vercel']),
        github: '',
        demo: '',
        image: '',
        color: 'blue',
        metrics: JSON.stringify([
          { value: '100%', label: 'Uptime' },
          { value: '<1s', label: 'Response time' }
        ]),
        featured: true,
        display_order: 1
      };

      await sql.query(
        `INSERT INTO projects (id, user_id, title, subtitle, category, year, status, description, problem, solution, impact, stack, github, demo, image, color, metrics, featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17::jsonb, $18, $19)`,
        [
          starterProject.id,
          starterProject.user_id,
          starterProject.title,
          starterProject.subtitle,
          starterProject.category,
          starterProject.year,
          starterProject.status,
          starterProject.description,
          starterProject.problem,
          starterProject.solution,
          starterProject.impact,
          starterProject.stack,
          starterProject.github,
          starterProject.demo,
          starterProject.image,
          starterProject.color,
          starterProject.metrics,
          starterProject.featured,
          starterProject.display_order
        ]
      );

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return sendJson(res, 201, {
        token,
        user: { id: user.id, username: user.username, email: user.email },
        profile: formatProfile(profileRes[0]),
        projects: [
          {
            ...starterProject,
            stack: ['React', 'PostgreSQL', 'Vercel'],
            metrics: [
              { value: '100%', label: 'Uptime' },
              { value: '<1s', label: 'Response time' }
            ]
          }
        ]
      });
    }

    // 3. AUTH LOGIN: POST /api/auth/login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await getBody(req);
      const { identifier, password } = body;

      if (!identifier || !password) {
        return sendJson(res, 400, { error: 'Username/email and password are required' });
      }

      const idLower = identifier.toLowerCase().trim();
      const users = await sql.query(
        'SELECT * FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1',
        [idLower]
      );

      if (!users || users.length === 0) {
        return sendJson(res, 401, { error: 'Invalid username/email or password' });
      }

      const user = users[0];
      const valid = bcrypt.compareSync(password, user.password_hash);
      if (!valid) {
        return sendJson(res, 401, { error: 'Invalid username/email or password' });
      }

      // Fetch profile & projects
      const profiles = await sql.query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [user.id]);
      const profile = profiles[0] || {
        name: user.username,
        handle: user.username,
        role: '',
        bio: '',
        location: '',
        email: user.email,
        github: '',
        website: '',
        avatar: ''
      };

      const projectRows = await sql.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY display_order ASC, created_at DESC',
        [user.id]
      );

      const projects = projectRows.map((p) => ({
        ...p,
        stack: typeof p.stack === 'string' ? JSON.parse(p.stack) : (p.stack || []),
        metrics: typeof p.metrics === 'string' ? JSON.parse(p.metrics) : (p.metrics || [])
      }));

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return sendJson(res, 200, {
        token,
        user: { id: user.id, username: user.username, email: user.email },
        profile: formatProfile(profile),
        projects
      });
    }

    // 4. AUTH ME: GET /api/auth/me
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const auth = authenticate(req);
      if (!auth) {
        return sendJson(res, 401, { error: 'Unauthorized or token expired' });
      }

      const users = await sql.query('SELECT id, username, email FROM users WHERE id = $1 LIMIT 1', [auth.userId]);
      if (!users || users.length === 0) {
        return sendJson(res, 404, { error: 'User not found' });
      }

      const user = users[0];
      const profiles = await sql.query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [user.id]);
      const profile = profiles[0] || {
        name: user.username,
        handle: user.username,
        role: '',
        bio: '',
        location: '',
        email: user.email,
        github: '',
        website: '',
        avatar: ''
      };

      const projectRows = await sql.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY display_order ASC, created_at DESC',
        [user.id]
      );

      const projects = projectRows.map((p) => ({
        ...p,
        stack: typeof p.stack === 'string' ? JSON.parse(p.stack) : (p.stack || []),
        metrics: typeof p.metrics === 'string' ? JSON.parse(p.metrics) : (p.metrics || [])
      }));

      return sendJson(res, 200, {
        user,
        profile: formatProfile(profile),
        projects
      });
    }

    // 5. SAVE / SYNC PORTFOLIO: POST /api/portfolio/sync
    if (pathname === '/api/portfolio/sync' && (req.method === 'POST' || req.method === 'PUT')) {
      const auth = authenticate(req);
      if (!auth) {
        return sendJson(res, 401, { error: 'Unauthorized or token expired' });
      }

      const body = await getBody(req);
      const { profile, projects } = body;

      if (!profile) {
        return sendJson(res, 400, { error: 'Profile data is required' });
      }

      let newHandle = (profile.handle || auth.username).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      if (!newHandle) newHandle = auth.username;

      // Check if handle is taken by another user
      const conflict = await sql.query(
        'SELECT id, user_id FROM profiles WHERE LOWER(handle) = $1 AND user_id != $2 LIMIT 1',
        [newHandle, auth.userId]
      );

      if (conflict && conflict.length > 0) {
        return sendJson(res, 409, { error: `Handle @${newHandle} is already taken by another user` });
      }

      // Upsert profile
      await sql.query(
        `INSERT INTO profiles (user_id, name, handle, role, bio, location, email, github, website, avatar, about_text, skills, education, certifications, achievements, proofpaths, custom_sections, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
           name = EXCLUDED.name,
           handle = EXCLUDED.handle,
           role = EXCLUDED.role,
           bio = EXCLUDED.bio,
           location = EXCLUDED.location,
           email = EXCLUDED.email,
           github = EXCLUDED.github,
           website = EXCLUDED.website,
           avatar = EXCLUDED.avatar,
           about_text = EXCLUDED.about_text,
           skills = EXCLUDED.skills,
           education = EXCLUDED.education,
           certifications = EXCLUDED.certifications,
           achievements = EXCLUDED.achievements,
           proofpaths = EXCLUDED.proofpaths,
           custom_sections = EXCLUDED.custom_sections,
           updated_at = NOW()`,
        [
          auth.userId,
          profile.name || '',
          newHandle,
          profile.role || '',
          profile.bio || '',
          profile.location || '',
          profile.email || '',
          profile.github || '',
          profile.website || '',
          profile.avatar || '',
          profile.about_text || '',
          JSON.stringify(profile.skills || []),
          JSON.stringify(profile.education || []),
          JSON.stringify(profile.certifications || []),
          JSON.stringify(profile.achievements || []),
          JSON.stringify(profile.proofpaths || { enabled: true, question: 'What brings you here today?', subtitle: 'Select a path to explore what is most relevant to you.', branches: [] }),
          JSON.stringify(profile.custom_sections || [])
        ]
      );

      // Update username in users table if changed
      await sql.query('UPDATE users SET username = $1 WHERE id = $2', [newHandle, auth.userId]);

      // Sync projects: delete old and insert new with display order
      if (Array.isArray(projects)) {
        await sql.query('DELETE FROM projects WHERE user_id = $1', [auth.userId]);

        for (let i = 0; i < projects.length; i++) {
          const p = projects[i];
          const pid = p.id || 'p-' + Math.random().toString(36).substring(2, 9);
          await sql.query(
            `INSERT INTO projects (id, user_id, title, subtitle, category, year, status, description, problem, solution, impact, stack, github, demo, image, color, metrics, featured, display_order, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17::jsonb, $18, $19, NOW(), NOW())
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               subtitle = EXCLUDED.subtitle,
               category = EXCLUDED.category,
               year = EXCLUDED.year,
               status = EXCLUDED.status,
               description = EXCLUDED.description,
               problem = EXCLUDED.problem,
               solution = EXCLUDED.solution,
               impact = EXCLUDED.impact,
               stack = EXCLUDED.stack,
               github = EXCLUDED.github,
               demo = EXCLUDED.demo,
               image = EXCLUDED.image,
               color = EXCLUDED.color,
               metrics = EXCLUDED.metrics,
               featured = EXCLUDED.featured,
               display_order = EXCLUDED.display_order,
               updated_at = NOW()`,
            [
              pid,
              auth.userId,
              p.title || 'Untitled',
              p.subtitle || '',
              p.category || 'Full-stack',
              p.year || '2026',
              p.status || 'Shipped',
              p.description || '',
              p.problem || '',
              p.solution || '',
              p.impact || '',
              JSON.stringify(p.stack || []),
              p.github || '',
              p.demo || '',
              p.image || '',
              p.color || 'blue',
              JSON.stringify(p.metrics || []),
              Boolean(p.featured),
              i + 1
            ]
          );
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Portfolio saved to database successfully',
        handle: newHandle
      });
    }

    // Default 404 for unknown api endpoint
    return sendJson(res, 404, { error: `Endpoint ${pathname} not found` });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: 'Internal server error: ' + (err.message || String(err)) });
  }
}
