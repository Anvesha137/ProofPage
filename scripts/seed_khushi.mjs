import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sql, initDb } from '../api/db.js';

async function seedKhushi() {
  await initDb();

  console.log('--- Seeding Khushi Profile & Data ---');

  // 1. Ensure user exists with username khushi, email khushi@gmail.com, password khushi@gmail.com
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('khushi@gmail.com', salt);

  let userRows = await sql.query('SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $2', [
    'khushi@gmail.com',
    'khushi'
  ]);

  let userId;
  if (!userRows || userRows.length === 0) {
    const created = await sql.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      ['khushi', 'khushi@gmail.com', passwordHash]
    );
    userId = created[0].id;
    console.log('Created new user with ID:', userId);
  } else {
    userId = userRows[0].id;
    await sql.query(
      'UPDATE users SET password_hash = $1, email = $2 WHERE id = $3',
      [passwordHash, 'khushi@gmail.com', userId]
    );
    console.log('Updated existing user ID:', userId, 'with new password hash');
  }

  // 2. Data payload
  const skills = [
    'Python',
    'Node.js',
    'React',
    'PostgreSQL',
    'APIs',
    'Cloud',
    'FastAPI',
    'Docker',
    'Next.js',
    'TypeScript',
    'LangChain',
    'Tailwind CSS'
  ];

  const education = [
    {
      id: 'edu-khushi-1',
      school: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      field: 'Artificial Intelligence & Distributed Systems',
      startYear: '2020',
      endYear: '2024',
      grade: '8.9 CGPA / First Class with Distinction',
      description: 'Specialized in machine learning algorithms, scalable web systems, and distributed database engineering. Capstone project on autonomous LLM multi-agent workflows.'
    }
  ];

  const certifications = [
    {
      id: 'cert-khushi-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2025',
      credentialId: 'AWS-SAA-88419',
      credentialUrl: 'https://aws.amazon.com/certification'
    },
    {
      id: 'cert-khushi-2',
      name: 'Professional Machine Learning Engineer & Cloud AI',
      issuer: 'Google Cloud',
      issueDate: '2025',
      credentialId: 'GCP-MLE-33902',
      credentialUrl: 'https://cloud.google.com/certification'
    }
  ];

  const achievements = [
    {
      id: 'ach-khushi-1',
      title: 'Winner — National AI & Web Innovation Hackathon',
      issuer: 'TechSpark Summit 2025',
      date: '2025',
      description: 'Architected an autonomous workflow copilot with real-time agent observability, taking 1st place among 200+ competing developer teams.',
      link: 'https://techspark.org'
    },
    {
      id: 'ach-khushi-2',
      title: 'Active Open Source Contributor & Technical Writer',
      issuer: 'GitHub Open Source Collective',
      date: '2024',
      description: 'Contributed core optimizations and documentation to Python & React open source toolkits with 500+ stars.',
      link: 'https://github.com'
    }
  ];

  const custom_sections = [
    {
      id: 'sec-resume',
      title: 'Resume & CV',
      kicker: 'RESUME & CONTACT',
      icon: 'FileText',
      description: 'I build products that solve real problems. AI Engineer · Full-Stack Builder. Download full resume or view highlighted career milestones.',
      buttonText: 'Download Full Resume (PDF)',
      buttonUrl: 'https://example.com/khushi-resume.pdf',
      content: '• AI Engineer & Full-Stack Builder with end-to-end expertise in Python, Node.js, React, and PostgreSQL.\n• Experienced in designing autonomous AI agents, enterprise RAG workflows, and high-performance web applications.\n• Strong foundation in cloud architectures, API security, and measurable product delivery.\n• Contact: khushi@gmail.com · Available for full-time engineering roles and high-impact advisory.',
      items: [
        {
          id: 'res-item-1',
          title: 'AI & Full-Stack Software Engineer',
          subtitle: 'Core Engineering · Remote',
          date: '2024 – Present',
          description: 'Building production AI automation workflows and web apps with Python, React, and Postgres. Lead engineer for autonomous multi-agent pipelines.',
          link: 'https://example.com/khushi-resume.pdf'
        },
        {
          id: 'res-item-2',
          title: 'Software Engineering Fellow',
          subtitle: 'Applied AI & Cloud Labs',
          date: '2023 – 2024',
          description: 'Engineered distributed microservices, optimized database query performance, and deployed scalable cloud APIs.',
          link: 'https://example.com/khushi-resume.pdf'
        }
      ]
    },
    {
      id: 'sec-services',
      title: 'Services',
      kicker: 'WHAT I CAN HELP WITH',
      icon: 'Zap',
      description: "Have an idea? Let's build it. AI Automation · Product Development · Web Apps.",
      buttonText: 'Discuss a Project',
      buttonUrl: 'mailto:khushi@gmail.com',
      content: 'How I Work:\n1. Discovery & Strategy — Deep dive into the user problem, technical requirements, and core success metrics.\n2. Rapid Prototyping & Architecture — Building a high-fidelity MVP with scalable foundations and clean code.\n3. Testing & Iteration — Real-world stress testing, API observability, and refinement.\n4. Production Deployment & Handover — Seamless deployment to cloud infrastructure with complete documentation.',
      items: [
        {
          id: 'srv-item-1',
          title: 'AI Automation & Agent Workflows',
          subtitle: 'LLMs · Multi-Agents · RAG · Automations',
          date: 'Available Now',
          description: 'Custom AI agent pipelines that automate repetitive business processes and extract actionable intelligence from messy unstructured data.',
          link: 'mailto:khushi@gmail.com'
        },
        {
          id: 'srv-item-2',
          title: 'End-to-End Product Development',
          subtitle: '0-to-1 MVP · Architecture · Delivery',
          date: 'Available Now',
          description: 'Taking your concept from wireframe to shipped production web application in record time with robust database design.',
          link: 'mailto:khushi@gmail.com'
        },
        {
          id: 'srv-item-3',
          title: 'Modern Web Applications',
          subtitle: 'React · Node.js · APIs · Cloud Infrastructure',
          date: 'Available Now',
          description: 'High-speed, responsive, and scalable web apps engineered for performance, security, and delightful UX.',
          link: 'mailto:khushi@gmail.com'
        }
      ]
    },
    {
      id: 'sec-my-journey',
      title: 'My Journey',
      kicker: "A LITTLE ABOUT ME AND WHAT I'VE BEEN CREATING",
      icon: 'Compass',
      description: "Hey, I'm a builder who loves turning ideas into products. A little about me and what I've been creating.",
      buttonText: 'Explore Projects',
      buttonUrl: '#projects',
      content: "About Me:\nI believe the best software combines thoughtful human experience with deep engineering craft. My journey started with curiosity about how software shapes the everyday world, evolving into building full-stack applications and AI systems that solve genuine pain points.\n\nThings I've Built:\nFrom autonomous agents to full-stack analytics and payment systems, I focus on shipping software that works reliably under load and delivers tangible value.",
      items: [
        {
          id: 'jrn-item-1',
          title: 'Early Foundations & First Lines of Code',
          subtitle: 'Algorithms · Web Fundamentals · Python',
          date: '2020',
          description: 'Discovered a passion for programming, computer science principles, and building web apps.',
          link: ''
        },
        {
          id: 'jrn-item-2',
          title: 'Diving Deep into Full-Stack & Systems',
          subtitle: 'React · Node.js · PostgreSQL · Cloud',
          date: '2022',
          description: 'Mastered component architecture, relational schemas, and asynchronous cloud APIs.',
          link: ''
        },
        {
          id: 'jrn-item-3',
          title: 'Pioneering AI & Autonomous Product Building',
          subtitle: 'LLMs · Agents · Cloud Architecture',
          date: '2024 – Present',
          description: 'Shipping end-to-end AI automation solutions and helping founders bring product visions to life.',
          link: ''
        }
      ]
    },
    {
      id: 'sec-connect',
      title: 'Connect',
      kicker: 'FIND ME ONLINE',
      icon: 'Share2',
      description: "Good ideas start with a conversation. Find me where I share what I'm building.",
      buttonText: 'Send an Email',
      buttonUrl: 'mailto:khushi@gmail.com',
      content: "What I Share:\nAI engineering · Building products · Learning in public\n\nGet in Touch:\nEmail · Social profile links\nFeel free to reach out for project inquiries, technical collaborations, or just to say hello!",
      items: [
        {
          id: 'con-item-1',
          title: 'Instagram',
          subtitle: '@anvesha.builds_',
          date: 'Active Daily',
          description: 'Sharing daily build logs, AI engineering experiments, and behind-the-scenes product creation.',
          link: 'https://instagram.com/anvesha.builds_'
        },
        {
          id: 'con-item-2',
          title: 'LinkedIn',
          subtitle: 'Professional updates & case studies',
          date: 'Connect',
          description: 'Connecting with engineers, founders, and teams building the future of technology.',
          link: 'https://linkedin.com'
        },
        {
          id: 'con-item-3',
          title: 'GitHub',
          subtitle: 'Projects and code repositories',
          date: 'Open Source',
          description: 'Explore source code, architecture breakdowns, and open-source contributions.',
          link: 'https://github.com'
        }
      ]
    }
  ];

  const proofpaths = {
    enabled: true,
    question: 'What brings you here today?',
    subtitle: "Choose a path. I'll show you what matters.",
    branches: [
      {
        id: 'branch-hiring',
        label: "I'm hiring",
        subtitle: 'Show me your skills',
        icon: 'Briefcase',
        color: 'blue',
        sections: ['projects', 'skills', 'certifications', 'sec-resume']
      },
      {
        id: 'branch-client',
        label: "Let's work together",
        subtitle: 'Explore your services',
        icon: 'Zap',
        color: 'amber',
        sections: ['sec-services', 'projects', 'about', 'contact']
      },
      {
        id: 'branch-exploring',
        label: 'Just exploring',
        subtitle: 'Get to know you',
        icon: 'User',
        color: 'purple',
        sections: ['about', 'sec-my-journey', 'achievements', 'education', 'projects']
      },
      {
        id: 'branch-connect',
        label: "Let's connect",
        subtitle: 'Find your socials',
        icon: 'Mail',
        color: 'green',
        sections: ['sec-connect', 'about', 'contact']
      }
    ]
  };

  // 3. Update Profiles Table
  await sql.query(
    `INSERT INTO profiles (user_id, name, handle, role, bio, location, email, github, website, avatar, about_text, skills, education, certifications, achievements, proofpaths, custom_sections)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb)
     ON CONFLICT (user_id) DO UPDATE SET
       name = EXCLUDED.name,
       handle = EXCLUDED.handle,
       role = EXCLUDED.role,
       bio = EXCLUDED.bio,
       location = EXCLUDED.location,
       email = EXCLUDED.email,
       github = EXCLUDED.github,
       website = EXCLUDED.website,
       about_text = EXCLUDED.about_text,
       skills = EXCLUDED.skills,
       education = EXCLUDED.education,
       certifications = EXCLUDED.certifications,
       achievements = EXCLUDED.achievements,
       proofpaths = EXCLUDED.proofpaths,
       custom_sections = EXCLUDED.custom_sections,
       updated_at = NOW()`,
    [
      userId,
      'Khushi',
      'khushi',
      'AI Engineer · Full-Stack Builder',
      'I build products that solve real problems.',
      'Remote',
      'khushi@gmail.com',
      'https://github.com',
      'https://instagram.com/anvesha.builds_',
      '',
      "Hey, I'm a builder who loves turning ideas into products. A little about me and what I've been creating. I specialize in AI automation, full-stack web applications, and scalable backend systems. I focus on taking ideas from 0 to 1 with clean code, intuitive user experiences, and measurable real-world impact.",
      JSON.stringify(skills),
      JSON.stringify(education),
      JSON.stringify(certifications),
      JSON.stringify(achievements),
      JSON.stringify(proofpaths),
      JSON.stringify(custom_sections)
    ]
  );
  console.log('Profile updated successfully.');

  // 4. Seed 3 Flagship Projects
  await sql.query('DELETE FROM projects WHERE user_id = $1', [userId]);

  const projects = [
    {
      id: 'p-khushi-1',
      title: 'NeuroFlow AI',
      subtitle: 'Autonomous AI workflow and agent automation engine.',
      category: 'AI & Automation',
      year: '2026',
      status: 'Shipped',
      description: 'An enterprise AI automation platform that orchestrates multi-agent tasks, document analysis, and automated customer workflows.',
      problem: 'Teams spent 15+ hours weekly manually processing support tickets, parsing unstructured data, and updating internal CRMs.',
      solution: 'Engineered an autonomous multi-agent pipeline using Python, LangChain, and PostgreSQL vector embeddings with real-time streaming.',
      impact: 'Cut document processing time by 78% and saved an estimated 25 hours per team weekly.',
      stack: JSON.stringify(['Python', 'FastAPI', 'React', 'PostgreSQL', 'Cloud']),
      github: 'https://github.com',
      demo: 'https://example.com',
      image: '',
      color: 'blue',
      metrics: JSON.stringify([
        { value: '78%', label: 'Faster Processing' },
        { value: '25 hrs', label: 'Saved Weekly' },
        { value: '99.9%', label: 'Accuracy' }
      ]),
      featured: true,
      display_order: 1
    },
    {
      id: 'p-khushi-2',
      title: 'PulseStack Analytics',
      subtitle: 'Real-time full-stack developer analytics and API observability.',
      category: 'Full-Stack',
      year: '2026',
      status: 'Shipped',
      description: 'A high-performance observability dashboard that tracks API latency, edge errors, and user interactions with zero config.',
      problem: 'Traditional APM solutions were bloated, slow to query, and lacked simple visualizations for fast-growing startups.',
      solution: 'Built a lightweight Node.js and React dashboard with optimized PostgreSQL aggregation and sub-second metrics filtering.',
      impact: 'Adopted across 4 teams, monitoring over 1.2M API events monthly with sub-100ms dashboard queries.',
      stack: JSON.stringify(['Node.js', 'React', 'PostgreSQL', 'APIs', 'Cloud']),
      github: 'https://github.com',
      demo: 'https://example.com',
      image: '',
      color: 'yellow',
      metrics: JSON.stringify([
        { value: '1.2M+', label: 'Events / Mo' },
        { value: '<100ms', label: 'Query Time' },
        { value: '4x', label: 'Faster Triage' }
      ]),
      featured: true,
      display_order: 2
    },
    {
      id: 'p-khushi-3',
      title: 'NexusPay Web Platform',
      subtitle: 'Modern payment orchestration and subscription management.',
      category: 'Web Apps',
      year: '2025',
      status: 'Shipped',
      description: 'A seamless checkout and billing portal supporting multi-currency subscriptions, webhook retries, and instant receipts.',
      problem: 'International clients faced frequent payment drop-offs and complex billing reconciliations.',
      solution: 'Architected a bulletproof checkout flow with idempotency keys, automated fallback processors, and webhook audit logs.',
      impact: 'Increased checkout conversion rate by 22% and eliminated reconciliation sync errors.',
      stack: JSON.stringify(['React', 'Node.js', 'APIs', 'PostgreSQL', 'Cloud']),
      github: 'https://github.com',
      demo: 'https://example.com',
      image: '',
      color: 'beige',
      metrics: JSON.stringify([
        { value: '+22%', label: 'Checkout Conv.' },
        { value: '0', label: 'Sync Errors' },
        { value: '150k', label: 'Users Served' }
      ]),
      featured: true,
      display_order: 3
    }
  ];

  for (const p of projects) {
    await sql.query(
      `INSERT INTO projects (id, user_id, title, subtitle, category, year, status, description, problem, solution, impact, stack, github, demo, image, color, metrics, featured, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16, $17::jsonb, $18, $19)`,
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
  console.log('Seeded 3 projects successfully.');
  console.log('--- Done! User khushi@gmail.com is fully configured. ---');
}

async function runWithRetry(fn, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed: ${err.message}. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

runWithRetry(seedKhushi)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  });
