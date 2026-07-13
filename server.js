import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');

// Helper to seed data if empty
function seedEmployees() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (data.employees && data.employees.length > 0) {
    return;
  }

  const firstNames = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
    'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
    'Timothy', 'Deborah',
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  ];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Support'];
  const designations = {
    Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'QA Engineer', 'DevOps Engineer'],
    Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
    Sales: ['Sales Executive', 'Account Manager', 'Sales Manager', 'Business Development Rep'],
    HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'People Operations'],
    Finance: ['Accountant', 'Financial Analyst', 'Controller', 'Payroll Specialist'],
    Operations: ['Operations Manager', 'Project Manager', 'Scrum Master', 'Business Analyst'],
    Design: ['UI Designer', 'UX Researcher', 'Product Designer', 'Creative Director'],
    Support: ['Support Specialist', 'Support Manager', 'Technical Support', 'Customer Success'],
  };

  const employees = [];
  const usedEmails = new Set();

  for (let i = 1; i <= 80; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${first} ${last}`;
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const desigs = designations[dept];
    const designation = desigs[Math.floor(Math.random() * desigs.length)];

    let email = `${first.toLowerCase()}.${last.toLowerCase()}@company.com`;
    let suffix = 1;
    while (usedEmails.has(email)) {
      email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@company.com`;
      suffix++;
    }
    usedEmails.add(email);

    const start = new Date('2020-01-01');
    const end = new Date('2024-11-30');
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const joiningDate = d.toISOString().split('T')[0];

    employees.push({
      id: i,
      name,
      email,
      department: dept,
      designation,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      joiningDate,
    });
  }

  data.employees = employees;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log(`[Seed] Seeded ${employees.length} employees successfully.`);
}

seedEmployees();

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom Auth Login endpoint
server.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
  if (user) {
    res.json({
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-${user.email}`,
      user: { name: user.name, email: user.email }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Custom Auth Register endpoint
server.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const userExists = db.users.some(u => u.email.toLowerCase() === email?.toLowerCase());
  if (userExists) {
    return res.status(400).json({ message: 'A user with this email address already exists' });
  }
  const newUser = { id: db.users.length + 1, name, email, password };
  db.users.push(newUser);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-${email}`,
    user: { name, email }
  });
});

// Duplicate employee email and name validations
server.use((req, res, next) => {
  if (req.path === '/api/v1/employees' || req.path === '/employees') {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const { name, email } = req.body;

    if (req.method === 'POST') {
      if (email && db.employees.some(emp => emp.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ message: 'An employee with this email already exists.' });
      }
      if (name && db.employees.some(emp => emp.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({ message: 'An employee with this name already exists.' });
      }
    }
  }

  const employeeIdMatch = req.path.match(/^\/(?:api\/v1\/)?employees\/(\d+)$/);
  if (employeeIdMatch && req.method === 'PUT') {
    const targetId = parseInt(employeeIdMatch[1], 10);
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const { name, email } = req.body;

    if (email && db.employees.some(emp => emp.id !== targetId && emp.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }
    if (name && db.employees.some(emp => emp.id !== targetId && emp.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: 'An employee with this name already exists.' });
    }
  }

  next();
});

// Rewrite prefix /api/v1/* to /$1 for default json-server endpoints
server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1'
}));

const router = jsonServer.router(dbPath);
server.use(router);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
