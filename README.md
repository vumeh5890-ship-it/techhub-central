# TechHub Central

# PROJECT: COMPLETE TECH HUB MANAGEMENT SYSTEM (THMS)

## ROLE AND DEVELOPMENT INSTRUCTIONS

Act as a senior full-stack software engineer, UI/UX designer, database architect, cybersecurity engineer and SaaS product developer.

Your task is to design, develop and implement a complete, production-ready Tech Hub Management System (THMS).

This must be a fully functional Progressive Web Application (PWA), not just a static dashboard or UI prototype.

The application will serve as the central digital management platform for a technology hub. It must allow the company administrator to manage employees, daily operations, company activities, schedules, finances, projects, equipment and other important organizational activities.

Build a professional, modern, responsive, secure and scalable system.

Do not leave buttons non-functional. Every feature must have working functionality, proper validation, database integration and appropriate feedback.

---

# 1. TECHNOLOGY STACK

Use the following technologies:

- Frontend: React with TypeScript.
- Build tool: Vite.
- Styling: Tailwind CSS.
- UI components: shadcn/ui.
- Icons: Lucide React.
- Backend and database: Supabase.
- Database: PostgreSQL.
- Authentication: Supabase Auth.
- File storage: Supabase Storage.
- Charts: Recharts.
- PWA: Vite PWA Plugin with Workbox.
- Form validation: React Hook Form and Zod.

Use clean, reusable, maintainable and well-organized code.

---

# 2. APPLICATION DESIGN AND BRANDING

Create a premium enterprise-level dashboard.

Design requirements:

- Modern SaaS dashboard appearance.
- Professional dark navy blue and white theme.
- Subtle gold or electric blue accent colors.
- Clean typography.
- Elegant cards and data visualizations.
- Responsive sidebar navigation.
- Professional tables.
- Interactive charts.
- Smooth but subtle animations.
- Light and dark mode.
- Consistent spacing and component design.

The application should look like a professionally developed enterprise management platform.

Create a professional logo placeholder with the initials THMS.

Application name: Tech Hub Management System.

The dashboard must be optimized for:
- Desktop computers.
- Windows laptops.
- Tablets.
- Android smartphones.
- iPhones.

---

# 3. AUTHENTICATION AND USER ROLES

Implement a secure authentication system.

Users should be able to log in using their email and password.

Create the following user roles:

1. SUPER ADMIN
   - Full access to the entire system.
   - Create and manage administrators.
   - Manage all company records.
   - Configure system settings.
   - Access all financial and operational reports.
   - Manage user permissions.

2. ADMIN
   - Manage employees.
   - Manage daily activities.
   - Create events and schedules.
   - Assign tasks.
   - Manage attendance.
   - View operational reports.
   - Manage company announcements.
   - Manage equipment and resources.

3. HR MANAGER
   - Manage employee records.
   - Manage recruitment.
   - Record employment and termination dates.
   - Manage attendance and leave.
   - Maintain employee documentation.

4. DEPARTMENT MANAGER
   - Manage assigned departments.
   - Assign tasks.
   - Monitor employees in their department.
   - Submit departmental reports.

5. EMPLOYEE
   - View personal profile.
   - View assigned tasks.
   - Submit task updates.
   - View schedules and announcements.
   - Submit leave requests.
   - View personal attendance records.

Implement role-based access control (RBAC).

Enforce permissions on the backend using Supabase Row Level Security (RLS). Do not rely on hiding frontend buttons for security.

---

# 4. MAIN ADMIN DASHBOARD

Create a comprehensive dashboard that displays:

- Total employees.
- Active employees.
- Inactive employees.
- Employees on leave.
- Recently recruited employees.
- Employees who have left the company.
- Today's attendance.
- Pending tasks.
- Completed tasks.
- Upcoming events.
- Today's activities.
- Monthly company expenses.
- Total recorded income.
- Available company equipment.
- Upcoming deadlines.

Include:

- Employee growth chart.
- Attendance statistics.
- Task completion chart.
- Monthly income and expenditure chart.
- Recent activities feed.
- Upcoming events calendar.
- Important notifications.

All dashboard figures must be calculated from real database records.

Provide date filters for daily, weekly, monthly and yearly analytics.

---

# 5. EMPLOYEE AND HUMAN RESOURCE MANAGEMENT

Build a complete Employee Management Module.

The administrator should be able to add, edit, view, search, filter and manage employee records.

Employee information should include:

- Employee ID (automatically generated).
- Full name.
- Profile photograph.
- Email address.
- Phone number.
- Residential address (optional).
- Gender (optional).
- Department.
- Job title.
- Employment type.
- Employment date.
- Salary information (restricted access).
- Assigned manager.
- Emergency contact (restricted access).
- Employee status.
- Additional notes.

EMPLOYEE STATUS:

- Active.
- On probation.
- On leave.
- Suspended.
- Resigned.
- Terminated.

EMPLOYMENT HISTORY:

Record:

- Date employee was hired.
- Position at employment.
- Department.
- Previous positions.
- Promotion dates.
- Salary changes.
- Resignation date.
- Termination date.
- Reason for departure.
- Person who authorized the termination.
- Exit interview notes.

IMPORTANT:

Never permanently delete an employee when they leave the company.

Instead, archive their record and maintain their complete employment history.

Create a separate Former Employees page where the administrator can view:

- Former employee names.
- Their positions.
- Employment dates.
- Departure dates.
- Departure reasons, subject to permissions.

Add employee search, filtering, sorting and downloadable employee records.

---

# 6. DEPARTMENT MANAGEMENT

Allow administrators to create and manage company departments.

Examples:

- Software Development.
- Web Development.
- UI/UX Design.
- Graphics Design.
- Digital Marketing.
- AI and Automation.
- Cybersecurity.
- Administration.
- Finance.

Each department should have:

- Department name.
- Department description.
- Department manager.
- Number of employees.
- Assigned projects.
- Department activities.
- Department performance.

Allow employees to be transferred between departments while preserving their history.

---

# 7. DAILY OPERATIONS MANAGEMENT

This is one of the most important modules.

Create a Daily Operations Management section where the administrator can monitor everything happening within the tech hub.

Features:

- Create daily activity records.
- Record what happened each day.
- Assign responsibilities.
- Assign employees to activities.
- Set start and end times.
- Record activity locations.
- Set activity priorities.
- Track progress.
- Record completed activities.
- Record unfinished activities.
- Add operational notes.
- Attach relevant documents and photographs.

Each daily activity should have:

- Activity title.
- Description.
- Date.
- Start time.
- End time.
- Responsible employee.
- Department.
- Priority.
- Status.
- Completion notes.

Create a daily activity report that the administrator can review at the end of each working day.

Include a historical activity log so management can review what happened on any previous date.

---

# 8. ATTENDANCE MANAGEMENT

Create an employee attendance system.

Features:

- Daily attendance records.
- Check-in time.
- Check-out time.
- Late arrival records.
- Absence records.
- Leave records.
- Attendance history.
- Monthly attendance summaries.

Allow authorized administrators to correct attendance records with an audit trail.

Optionally support QR-based check-in with administrator-controlled verification.

Do not use invasive employee surveillance.

---

# 9. TASK AND PROJECT MANAGEMENT

Build an integrated project and task management module.

Administrators and department managers should be able to:

- Create projects.
- Assign employees.
- Create tasks.
- Set deadlines.
- Set task priorities.
- Add task descriptions.
- Attach files.
- Monitor task progress.
- Add comments.
- Mark tasks as completed.

Task statuses:

- To Do.
- In Progress.
- Under Review.
- Completed.
- On Hold.
- Cancelled.

Create:

- Kanban board.
- Task list.
- Project overview.
- Project timeline.
- Employee task performance dashboard.

Allow employees to update their assigned tasks.

---

# 10. EVENTS AND FUTURE ACTIVITIES MANAGEMENT

Create an advanced scheduling and events module.

The administrator should be able to schedule future activities such as:

- Staff meetings.
- Training sessions.
- Workshops.
- Tech conferences.
- Company events.
- Project presentations.
- Client meetings.
- Seminars.
- Hackathons.
- Team-building activities.

Each event should contain:

- Event title.
- Description.
- Event category.
- Date.
- Start time.
- End time.
- Venue.
- Organizer.
- Assigned participants.
- Required resources.
- Event status.
- Additional notes.

Include an interactive calendar with:

- Daily view.
- Weekly view.
- Monthly view.

Allow administrators to edit, reschedule or cancel events.

Display upcoming events on the main dashboard.

Create automatic in-app reminders for upcoming events.

---

# 11. LEAVE AND REQUEST MANAGEMENT

Employees should be able to submit requests for:

- Annual leave.
- Sick leave.
- Personal leave.
- Emergency leave.
- Other approved leave categories.

The administrator or authorized HR manager should be able to:

- Approve requests.
- Reject requests.
- Request additional information.
- Add approval comments.
- Review leave history.

Maintain a complete record of every decision.

---

# 12. FINANCIAL MANAGEMENT

Create a company financial management module.

Features:

INCOME:
- Record company income.
- Record income sources.
- Record payment dates.
- Record payment descriptions.
- Record payment methods.

EXPENSES:
- Record company expenses.
- Categorize expenses.
- Record transaction dates.
- Record amounts.
- Record payment methods.
- Upload receipts.

CATEGORIES:
- Salaries.
- Electricity.
- Internet.
- Equipment.
- Maintenance.
- Transportation.
- Office supplies.
- Training.
- Marketing.
- Other expenses.

FINANCIAL DASHBOARD:

Display:

- Total income.
- Total expenses.
- Net balance.
- Monthly financial performance.
- Income breakdown.
- Expense breakdown.

Allow authorized users to generate downloadable financial reports.

Use Nigerian Naira (₦) as the default currency, with configurable currency settings.

Financial records must have restricted access.

---

# 13. EQUIPMENT AND ASSET MANAGEMENT

Create an inventory management module.

Track company assets such as:

- Desktop computers.
- Laptops.
- Monitors.
- Keyboards.
- Mice.
- Printers.
- Routers.
- Projectors.
- Furniture.
- Other equipment.

Each asset should have:

- Asset ID.
- Asset name.
- Category.
- Serial number.
- Purchase date.
- Purchase price.
- Current condition.
- Assigned employee.
- Location.
- Maintenance history.
- Warranty information.
- Asset status.

Statuses:

- Available.
- Assigned.
- Under Maintenance.
- Damaged.
- Retired.

Allow administrators to assign and reassign assets.

Maintain an asset assignment history.

---

# 14. ANNOUNCEMENTS AND COMMUNICATION

Create an internal company communication module.

Administrators should be able to publish announcements such as:

- Important company information.
- Meeting announcements.
- Policy updates.
- Upcoming events.
- Emergency notices.
- General information.

Employees should be able to view announcements from their dashboard.

Include read/unread status.

Create an in-app notification center.

Notifications should be generated for:

- New task assignments.
- Task deadlines.
- Event reminders.
- Leave decisions.
- New announcements.
- Important administrative updates.

---

# 15. REPORTS AND ANALYTICS

Create a dedicated reports section.

Allow administrators to generate:

- Employee reports.
- Former employee reports.
- Recruitment reports.
- Attendance reports.
- Daily activity reports.
- Department reports.
- Task completion reports.
- Project reports.
- Event reports.
- Financial reports.
- Equipment reports.

Provide date-range filtering.

Allow reports to be exported as:

- PDF.
- Excel.
- CSV.

Create professional report layouts with company branding.

---

# 16. AUDIT LOG AND SYSTEM ACTIVITY

Create a comprehensive audit log.

Track important system actions, including:

- User logins.
- Employee creation.
- Employee record updates.
- Employee status changes.
- Employment terminations.
- Financial record creation.
- Financial record modifications.
- Event creation and cancellation.
- Permission changes.
- Record archival.

Each audit entry should contain:

- User responsible.
- Action performed.
- Date and time.
- Affected record.
- Previous value where appropriate.
- New value where appropriate.

Audit logs must be protected from ordinary users modifying or deleting them.

---

# 17. PROGRESSIVE WEB APP (PWA)

The entire application MUST be developed as a Progressive Web Application.

Implement:

- Web app manifest.
- Service worker.
- Workbox caching.
- Installable application.
- Custom application icon.
- Splash screen support.
- Standalone display mode.
- Responsive mobile interface.
- Offline fallback page.
- Update notifications.

OFFLINE FUNCTIONALITY:

Allow appropriate read-only cached information to remain accessible when internet connectivity is unavailable.

Where safe, allow users to draft operational records offline and synchronize them when connectivity returns.

Implement conflict detection to prevent accidental overwriting of newer database records.

Do not claim that an offline change has been saved to the central database until synchronization succeeds.

Ensure sensitive employee and financial information is not exposed through insecure caching.

The application must be installable on Windows 11 through supported browsers and on Android devices.

---

# 18. NOTIFICATIONS AND REMINDERS

Build a notification system for:

- Upcoming meetings.
- Upcoming events.
- Pending approvals.
- Overdue tasks.
- Employee leave requests.
- Important deadlines.

Use in-app notifications by default.

Make browser push notifications an optional feature requiring user permission.

Provide notification preferences for each user.

---

# 19. SYSTEM SETTINGS

Create an administrator settings section.

Allow authorized administrators to manage:

- Company name.
- Company logo.
- Company address.
- Contact information.
- Working days.
- Working hours.
- Departments.
- Job titles.
- Currency.
- Time zone.
- Notification preferences.
- User roles.
- Access permissions.

Set the default time zone to Africa/Lagos.

Set the default currency to NGN (₦).

---

# 20. DATABASE ARCHITECTURE

Create a properly structured PostgreSQL database using Supabase.

Include appropriate tables for:

- profiles
- user_roles
- employees
- employment_history
- departments
- attendance
- leave_requests
- daily_activities
- activity_assignments
- projects
- tasks
- task_comments
- events
- event_participants
- announcements
- notifications
- financial_transactions
- assets
- asset_assignments
- maintenance_records
- audit_logs
- company_settings

Requirements:

- Use UUID primary keys.
- Create appropriate foreign keys.
- Add indexes for frequently searched fields.
- Use timestamps.
- Maintain relational integrity.
- Use database constraints.
- Use Row Level Security.
- Create appropriate database policies.
- Use Supabase migrations for schema changes.

Never expose the Supabase service role key in frontend code.

---

# 21. SECURITY AND DATA PROTECTION

Implement professional security practices.

- Secure authentication.
- Role-based permissions.
- Supabase Row Level Security.
- Input validation.
- Secure file uploads.
- Protection against unauthorized access.
- Proper session management.
- Audit trails.
- Secure password handling.
- Restricted financial and HR information.

Employees must only access information they are authorized to view.

Only authorized management users should access sensitive employee records, salaries and financial information.

---

# 22. USER EXPERIENCE

Create a simple and intuitive navigation system.

SIDEBAR:

1. Dashboard
2. Employees
3. Former Employees
4. Departments
5. Daily Operations
6. Attendance
7. Tasks & Projects
8. Events & Calendar
9. Leave Requests
10. Finance
11. Equipment & Assets
12. Announcements
13. Reports
14. Audit Logs
15. Settings

Add a global search feature.

Add profile settings.

Add a notification bell.

Add breadcrumbs.

Use confirmation dialogs for sensitive actions.

Provide loading states, empty states, success messages and error messages.

Make all tables searchable, sortable and filterable.

---

# 23. DEVELOPMENT AND IMPLEMENTATION REQUIREMENTS

Build this application systematically.

PHASE 1:
- Set up the application.
- Build the design system.
- Create authentication.
- Configure Supabase.
- Create database schemas.
- Implement role-based access.

PHASE 2:
- Build the admin dashboard.
- Build employee management.
- Build department management.
- Build attendance management.

PHASE 3:
- Build daily operations.
- Build task and project management.
- Build event scheduling.
- Build leave management.

PHASE 4:
- Build finance.
- Build asset management.
- Build announcements.
- Build notifications.

PHASE 5:
- Build analytics and reporting.
- Build audit logs.
- Complete PWA functionality.
- Implement offline support.

PHASE 6:
- Test all modules.
- Test permissions.
- Test mobile responsiveness.
- Test database operations.
- Test offline and synchronization functionality.
- Fix all identified bugs.

IMPORTANT DEVELOPMENT RULES:

1. Do not create a frontend-only demonstration.
2. Do not use fake statistics as real company data.
3. Do not leave buttons or forms without functionality.
4. Connect every module to the database.
5. Implement proper validation.
6. Use reusable components.
7. Create realistic empty states when no records exist.
8. Protect sensitive information.
9. Ensure that all modules communicate correctly.
10. Maintain a professional and consistent design.

If a feature requires external credentials or configuration, clearly identify what is required rather than pretending it is already connected.

---

# FINAL PRODUCT EXPECTATION

Deliver a fully functional Tech Hub Management System that can be used to manage an actual technology company.

The administrator should be able to open the application and understand the entire company's operational situation from one dashboard.

The system must make it possible to answer questions such as:

- How many employees currently work here?
- Who are the employees?
- When was each employee hired?
- Who has resigned or been terminated?
- What activities happened today?
- What activities are scheduled for tomorrow?
- Which projects are currently running?
- Which tasks are overdue?
- Which employees are absent?
- What events are coming up?
- How much money has the company earned and spent?
- What equipment does the company own?
- Who is responsible for each task?
- What happened in the company during a particular month?

The final result should be a professional, secure, scalable and installable Progressive Web Application.

Build the actual working product, not merely a visual representation of the requirements.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6c17eff8-214e-42d0-8a2e-dbad2462561d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
