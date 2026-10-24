import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_xuPldryThb25@ep-solitary-dust-b5re3t7m-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const sql = neon(connectionString);

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  await sql.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT '',
      handle VARCHAR(50) UNIQUE NOT NULL,
      role TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      email TEXT DEFAULT '',
      github TEXT DEFAULT '',
      website TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(100) PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      category TEXT DEFAULT 'Full-stack',
      year TEXT DEFAULT '2026',
      status TEXT DEFAULT 'Shipped',
      description TEXT DEFAULT '',
      problem TEXT DEFAULT '',
      solution TEXT DEFAULT '',
      impact TEXT DEFAULT '',
      stack JSONB DEFAULT '[]'::jsonb,
      github TEXT DEFAULT '',
      demo TEXT DEFAULT '',
      image TEXT DEFAULT '',
      color TEXT DEFAULT 'blue',
      metrics JSONB DEFAULT '[]'::jsonb,
      featured BOOLEAN DEFAULT false,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Check if alexbuilds demo user exists
  const existing = await sql.query('SELECT id FROM users WHERE username = $1', ['alexbuilds']);
  if (!existing || existing.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('demo123456', salt);

    const userRes = await sql.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      ['alexbuilds', 'hello@example.com', hash]
    );

    const userId = userRes[0].id;

    await sql.query(
      `INSERT INTO profiles (user_id, name, handle, role, bio, location, email, github, website, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (handle) DO NOTHING`,
      [
        userId,
        'Alex Morgan',
        'alexbuilds',
        'Full-stack developer & product builder',
        'I turn complex problems into thoughtful digital products. Here’s the work, the decisions, and the evidence behind what I build.',
        'San Francisco, CA',
        'hello@example.com',
        'https://github.com',
        'https://example.com',
        ''
      ]
    );

    const defaultProjects = [
      {
        id: 'a1',
        title: 'Orbit Analytics',
        subtitle: 'A clearer way to understand product growth.',
        category: 'Full-stack',
        year: '2026',
        status: 'Shipped',
        description: 'A lightweight analytics workspace for teams that want actionable insights without the noise. Designed and engineered from discovery to deployment.',
        problem: 'Small teams had their product data scattered across multiple dashboards, making it hard to identify meaningful trends.',
        solution: 'Built a unified, lightweight dashboard with reusable metric definitions, fast filtering, and shareable reporting views.',
        impact: 'Reduced the time needed to prepare weekly reports in a sample workflow.',
        stack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Recharts']),
        github: 'https://github.com',
        demo: 'https://example.com',
        image: '',
        color: 'blue',
        metrics: JSON.stringify([
          { value: '42%', label: 'Faster reporting' },
          { value: '3', label: 'Data sources' },
          { value: '1.2s', label: 'Page load' }
        ]),
        featured: true,
        display_order: 1
      },
      {
        id: 'a2',
        title: 'Forma Studio',
        subtitle: 'Brand-consistent visuals in a few clicks.',
        category: 'Product design',
        year: '2026',
        status: 'Shipped',
        description: 'A template-first creative tool that helps independent creators publish beautiful, cohesive content.',
        problem: 'Creators waste time recreating the same layouts every week.',
        solution: 'Created reusable brand presets, an intuitive editor, and one-click image export.',
        impact: 'Streamlined the repeat content creation workflow.',
        stack: JSON.stringify(['React', 'Canvas API', 'CSS', 'Vite']),
        github: 'https://github.com',
        demo: 'https://example.com',
        image: '',
        color: 'yellow',
        metrics: JSON.stringify([
          { value: '12', label: 'Templates' },
          { value: '4:5', label: 'Export ratio' }
        ]),
        featured: false,
        display_order: 2
      },
      {
        id: 'a3',
        title: 'Relay API',
        subtitle: 'Developer-friendly event delivery.',
        category: 'Backend',
        year: '2025',
        status: 'In progress',
        description: 'An event delivery service built around clear observability and predictable retry behavior.',
        problem: 'Debugging webhook deliveries was time-consuming and difficult to reproduce.',
        solution: 'Designed a transparent event log and a replay-friendly delivery pipeline.',
        impact: 'Prototype with a documented test plan.',
        stack: JSON.stringify(['Node.js', 'Redis', 'PostgreSQL']),
        github: 'https://github.com',
        demo: '',
        image: '',
        color: 'beige',
        metrics: JSON.stringify([{ value: '100+', label: 'Test events' }]),
        featured: false,
        display_order: 3
      }
    ];

    for (const p of defaultProjects) {
      await sql.query(
        `INSERT INTO projects (id, user_id, title, subtitle, category, year, status, description, problem, solution, impact, stack, github, demo, image, color, metrics, featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17::jsonb, $18, $19)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id,
          userId,
          p.title,
          p.subtitle,
          p.category,
          p.year,
          p.status,
          p.description,
          p.problem,
          p.solution,
          p.impact,
          p.stack,
          p.github,
          p.demo,
          p.image,
          p.color,
          p.metrics,
          p.featured,
          p.display_order
        ]
      );
    }
  }

  isInitialized = true;
}
