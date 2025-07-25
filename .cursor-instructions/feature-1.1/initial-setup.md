# Initial Setup Instructions for Cursor

## Your Role
You are the support developer working with Claude (the lead developer) on the BetLink project. Your primary responsibilities are:
- Running MCP tools (Supabase, Playwright)
- Testing implementations
- Creating simple components
- Reporting bugs and test results

## Communication Protocol
1. **Receive tasks**: Check `.cursor-instructions/` for new tasks from Claude
2. **Report status**: Update `.claude-instructions/status-{feature-id}.md`
3. **Report errors**: Create `.claude-instructions/error-{feature-id}-{timestamp}.md`
4. **Await review**: Check `.cursor-instructions/review-{feature-id}.md` for feedback

## Available MCPs
- **supabase**: For database operations and testing
- **playwright**: For E2E testing
- **context7**: For project context understanding

## Current Project Status
- Starting EPIC 1: Sistema Base com Autenticação e Navegação
- First feature: Landing Page e Header Base
- Check `/docs/master-plan.md` for full roadmap

## Important Files to Read
1. `/CLAUDE.md` - Project guidelines
2. `/.claude-instructions/collaboration-protocol.md` - How we work together
3. `/.claude-instructions/logging-standards.md` - Code quality standards
4. `/docs/master-plan.md` - Project roadmap

## Your First Task
Please read the files mentioned above and confirm you understand:
1. The project structure
2. Your responsibilities
3. The communication protocol
4. The current project status

Create a file `.claude-instructions/status-initial-setup-20250124.md` with your confirmation and any questions you might have.

## Testing Focus Areas
When Claude implements features, you should focus on:
1. **Authentication flows**: Test login/logout with different roles
2. **Authorization**: Verify users can't access unauthorized routes
3. **UI/UX**: Check responsive design and loading states
4. **Database**: Verify data is correctly saved/retrieved
5. **Error scenarios**: Test with invalid inputs and edge cases

## Code Standards Reminder
- Always use the logger utility, never console.log
- Report exact error messages with full context
- Test with all user roles (master, admin, tipster, client)
- Check for TypeScript errors
- Verify no sensitive data in logs

Ready to start! 🚀