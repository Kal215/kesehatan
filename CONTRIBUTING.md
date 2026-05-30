# 🤝 Contributing Guidelines

## Sebelum Mulai

1. Fork repository ini
2. Clone ke lokal
3. Create feature branch

## Development Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Setup database
npm run db:generate
npm run db:push

# Start dev server
npm run dev
```

## Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
# atau
git checkout -b fix/bug-name
# atau  
git checkout -b docs/documentation-name
```

### 2. Make Changes
- Write code sesuai conventions
- Add comments untuk logic kompleks
- Update tests jika diperlukan

### 3. Follow Code Standards

#### TypeScript
- Use type annotations
- Avoid `any` type
- Use interfaces untuk objects

#### Naming Conventions
- camelCase untuk variables/functions
- PascalCase untuk components/classes
- UPPERCASE untuk constants

#### File Structure
- Components di `components/`
- Pages di `app/`
- Utilities di `lib/`
- Server actions di `actions/`

### 4. Commit Messages

Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Dependencies, config

Examples:
```
feat: Add pregnancy examination form
fix: Correct visit status update logic
docs: Add API documentation
refactor: Simplify patient search logic
```

### 5. Testing

```bash
# Run tests
npm run test

# Check types
npm run type-check

# Lint code
npm run lint
```

### 6. Push & Create PR

```bash
git push origin feature/feature-name
```

Di GitHub:
1. Create Pull Request
2. Provide clear description
3. Link related issues
4. Request review

## Code Review Process

- Minimum 1 approval required
- All checks must pass
- No conflicts with main branch

## Merge

1. Squash commits (if needed)
2. Merge ke main
3. Delete feature branch

## Documentation

- Update relevant markdown files
- Add JSDoc comments
- Update changelog jika diperlukan

## Reporting Issues

Use GitHub Issues dengan template:

- Title: Clear & descriptive
- Description: Detailed explanation
- Steps to reproduce: Clear steps
- Expected vs actual behavior
- Screenshots/logs jika relevan

## Code of Conduct

- Respectful communication
- Constructive feedback
- No harassment
- Help others learn

---

Happy contributing! 🚀
