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
      about_text TEXT DEFAULT '',
      skills JSONB DEFAULT '[]'::jsonb,
      education JSONB DEFAULT '[]'::jsonb,
      certifications JSONB DEFAULT '[]'::jsonb,
      achievements JSONB DEFAULT '[]'::jsonb,
      custom_sections JSONB DEFAULT '[]'::jsonb,
      proofpaths JSONB DEFAULT '{"enabled":true,"question":"What brings you here today?","subtitle":"Select a path to explore what is most relevant to you.","branches":[]}'::jsonb,
      location TEXT DEFAULT '',
      email TEXT DEFAULT '',
      github TEXT DEFAULT '',
      website TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Ensure new columns exist on already created tables
  await sql.query(`
    ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS about_text TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS proofpaths JSONB DEFAULT '{"enabled":true,"question":"What brings you here today?","subtitle":"Select a path to explore what is most relevant to you.","branches":[]}'::jsonb;
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
      `INSERT INTO profiles (user_id, name, handle, role, bio, location, email, github, website, avatar, about_text, skills, education, certifications, achievements, custom_sections)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb)
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
        '',
        'I am a full-stack engineer and product builder with 5+ years of experience crafting high-impact digital products. I specialize in scalable React applications, robust distributed backends, and performance-driven architectures.',
        JSON.stringify(['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL', 'Python', 'Vite', 'Redis']),
        JSON.stringify([
          {
            id: 'edu-1',
            school: 'UC Berkeley',
            degree: 'B.S. in Computer Science',
            field: 'Distributed Systems & Software Engineering',
            startYear: '2019',
            endYear: '2023',
            grade: '3.85 GPA',
            description: "Dean's Honors List. Coursework in High-Performance Database Systems, Cloud Computing, and Human-Computer Interaction."
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
        ]),
        JSON.stringify([
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
        ]),
        JSON.stringify([
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
        ]),
        JSON.stringify([
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
        ])
      ]
    );

    // Also update in case alexbuilds was created previously
    await sql.query(
      `UPDATE profiles
       SET
         about_text = COALESCE(NULLIF(about_text, ''), $1),
         skills = CASE WHEN skills IS NULL OR jsonb_array_length(skills) = 0 THEN $2::jsonb ELSE skills END,
         education = CASE WHEN education IS NULL OR jsonb_array_length(education) = 0 THEN $3::jsonb ELSE education END,
         certifications = CASE WHEN certifications IS NULL OR jsonb_array_length(certifications) = 0 THEN $4::jsonb ELSE certifications END,
         achievements = CASE WHEN achievements IS NULL OR jsonb_array_length(achievements) = 0 THEN $5::jsonb ELSE achievements END,
         custom_sections = CASE WHEN custom_sections IS NULL OR jsonb_array_length(custom_sections) = 0 THEN $6::jsonb ELSE custom_sections END
       WHERE handle = 'alexbuilds'`,
      [
        'I am a full-stack engineer and product builder with 5+ years of experience crafting high-impact digital products. I specialize in scalable React applications, robust distributed backends, and performance-driven architectures.',
        JSON.stringify(['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL', 'Python', 'Vite', 'Redis']),
        JSON.stringify([
          {
            id: 'edu-1',
            school: 'UC Berkeley',
            degree: 'B.S. in Computer Science',
            field: 'Distributed Systems & Software Engineering',
            startYear: '2019',
            endYear: '2023',
            grade: '3.85 GPA',
            description: "Dean's Honors List. Coursework in High-Performance Database Systems, Cloud Computing, and Human-Computer Interaction."
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
        ]),
        JSON.stringify([
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
        ]),
        JSON.stringify([
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
        ]),
        JSON.stringify([
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
        ])
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

  // Ensure alexbuilds has default rich portfolio data if currently empty
  await sql.query(
    `UPDATE profiles
     SET
       about_text = CASE WHEN about_text IS NULL OR about_text = '' THEN $1 ELSE about_text END,
       skills = CASE WHEN skills IS NULL OR jsonb_array_length(skills) = 0 THEN $2::jsonb ELSE skills END,
       education = CASE WHEN education IS NULL OR jsonb_array_length(education) = 0 THEN $3::jsonb ELSE education END,
       certifications = CASE WHEN certifications IS NULL OR jsonb_array_length(certifications) = 0 THEN $4::jsonb ELSE certifications END,
       achievements = CASE WHEN achievements IS NULL OR jsonb_array_length(achievements) = 0 THEN $5::jsonb ELSE achievements END,
       proofpaths = CASE WHEN proofpaths IS NULL OR jsonb_array_length(proofpaths->'branches') = 0 THEN $6::jsonb ELSE proofpaths END,
       custom_sections = CASE WHEN custom_sections IS NULL OR jsonb_array_length(custom_sections) = 0 THEN $7::jsonb ELSE custom_sections END
     WHERE handle = 'alexbuilds'`,
    [
      'I am a full-stack engineer and product builder with 5+ years of experience crafting high-impact digital products. I specialize in scalable React applications, robust distributed backends, and performance-driven architectures.',
      JSON.stringify(['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL', 'Python', 'Vite', 'Redis']),
      JSON.stringify([
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
      ]),
      JSON.stringify([
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
      ]),
      JSON.stringify([
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
      ]),
      JSON.stringify({
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
      }),
      JSON.stringify([
        {
          id: 'sec-resume',
          title: 'Resume & Curriculum Vitae',
          kicker: 'CAREER SUMMARY & EXPERIENCE',
          icon: 'FileText',
          description: 'Download full PDF resume or review highlighted timeline, tech leadership, and track record.',
          buttonText: 'Download Full Resume (PDF)',
          buttonUrl: 'https://example.com/alex-morgan-resume.pdf',
          content: '• 5+ years building and scaling distributed React, Next.js, and Node.js applications\n• Led engineering of zero-downtime microservices serving 200k+ MAU\n• Deep expertise in PostgreSQL optimization, state management, and real-time websockets'
        }
      ])
    ]
  );

  isInitialized = true;
}
