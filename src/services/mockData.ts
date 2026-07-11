export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive';
  joiningDate: string;
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

const designations: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'QA Engineer', 'DevOps Engineer'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Manager', 'Business Development Rep'],
  HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'People Operations'],
  Finance: ['Accountant', 'Financial Analyst', 'Controller', 'Payroll Specialist'],
  Operations: ['Operations Manager', 'Project Manager', 'Scrum Master', 'Business Analyst'],
  Design: ['UI Designer', 'UX Researcher', 'Product Designer', 'Creative Director'],
  Support: ['Support Specialist', 'Support Manager', 'Technical Support', 'Customer Success'],
};

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  const usedEmails = new Set<string>();

  for (let i = 1; i <= count; i++) {
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

    employees.push({
      id: i,
      name,
      email,
      department: dept,
      designation,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      joiningDate: randomDate(new Date('2020-01-01'), new Date('2024-11-30')),
    });
  }

  return employees;
}

export const mockEmployees = generateEmployees(87);
export const DEPARTMENTS = departments;
