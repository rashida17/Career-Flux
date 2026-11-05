function DashboardCard({ title, children, action, onAction }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900">{title}</h2>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }) {
  return <p className="text-sm text-stone-500">{children}</p>;
}

export function AiSkillSuggestionsCard({ user, onNavigate }) {
  return (
    <DashboardCard
      title="AI Skill Suggestions"
      action="Manage skills"
      onAction={() => onNavigate("My Skills")}
    >
      {user.skillSuggestions?.length ? (
        <ul className="space-y-3">
          {user.skillSuggestions.map((skill) => (
            <li key={skill.name}>
              <p className="text-sm font-semibold text-slate-800">{skill.name}</p>
              <p className="mt-1 text-xs text-stone-500">{skill.reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>No skill suggestions yet.</EmptyState>
      )}
    </DashboardCard>
  );
}

export function ApplicationStatus({ userApplications, onNavigate }) {
  return (
    <DashboardCard
      title="Application Status"
      action="View all"
      onAction={() => onNavigate("My Applications")}
    >
      {userApplications.length ? (
        <ul className="space-y-3">
          {userApplications.map((application) => (
            <li
              key={application.id}
              className="flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {application.jobTitle}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {application.company}
                </p>
              </div>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                {application.status.replaceAll("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>You have not applied to any jobs yet.</EmptyState>
      )}
    </DashboardCard>
  );
}

export function LearningRoadmapCard({ user, onNavigate }) {
  const roadmap = user.roadmap;

  return (
    <DashboardCard
      title="Career Roadmap"
      action="View roadmap"
      onAction={() => onNavigate("Career Roadmap")}
    >
      {roadmap ? (
        <>
          <p className="text-sm font-semibold text-slate-800">
            {roadmap.targetJobTitle}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {roadmap.learned} of {roadmap.total} skills completed
          </p>
          {roadmap.missingSkills?.length > 0 && (
            <ul className="mt-3 space-y-2">
              {roadmap.missingSkills.map((skill) => (
                <li key={skill.name} className="text-sm text-stone-600">
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <EmptyState>Create a roadmap to plan your next career steps.</EmptyState>
      )}
    </DashboardCard>
  );
}

export function SkillProofCard({ skills, onNavigate }) {
  return (
    <DashboardCard
      title="Skill Proof"
      action="Add proof"
      onAction={() => onNavigate("My Skills")}
    >
      {skills.length ? (
        <ul className="space-y-2">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="font-medium text-slate-800">{skill.name}</span>
              <span className="text-xs text-stone-500">
                {skill.evidenceCount} proof{skill.evidenceCount === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Add evidence to verify your skills.</EmptyState>
      )}
    </DashboardCard>
  );
}
