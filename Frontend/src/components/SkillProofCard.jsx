
import {
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Code,
} from "lucide-react";

const SkillProofCard = ({ skills = [], onAddEvidence, onNavigate }) => {
  const safeSkills = Array.isArray(skills) ? skills : [];

  // Calculate verified skills
  const verifiedCount = safeSkills.filter(
    (skill) => Number(skill.evidenceCount) > 0
  ).length;

  const totalSkills = safeSkills.length;

  // Calculate progress
  const progress =
    totalSkills > 0 ? (verifiedCount / totalSkills) * 100 : 0;

  // Show unverified skills first
  const sortedSkills = [...safeSkills].sort(
    (a, b) =>
      Number(Number(a.evidenceCount) > 0) -
      Number(Number(b.evidenceCount) > 0)
  );

  // Display maximum 3 skills
  const displayedSkills = sortedSkills.slice(0, 3);

  const handleAddEvidence = (skillId) => {
    if (onAddEvidence) {
      onAddEvidence(skillId);
    } else if (onNavigate) {
      onNavigate("my-skills");
    }
  };

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate("my-skills");
    }
  };

  return (
    <section className="flex min-h-[250px] w-full min-w-0 flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">

      {/* Header */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">

          {/* Left: Icon and Title */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <ShieldCheck className="h-5 w-5 text-[#DC4A1F]" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800">
                Skill Proof
              </h3>

              <p className="whitespace-nowrap text-[11px] text-slate-500">
                Verify your technical skills
              </p>
            </div>
          </div>

          {/* Right: Compact Progress */}
          <div className="flex w-[76px] shrink-0 flex-col items-end gap-1.5">
            <span className="text-xs font-bold text-slate-700">
              {verifiedCount}/{totalSkills}
            </span>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills List */}
        {totalSkills > 0 ? (
          <div className="divide-y divide-slate-100">
            {displayedSkills.map((skill) => {
              const isVerified = Number(skill.evidenceCount) > 0;

              return (
                <div
                  key={skill.id}
                  className="flex min-w-0 items-center justify-between gap-2 py-3 first:pt-1 last:pb-1"
                >
                  {/* Skill Name */}
                  <div className="flex min-w-0 items-center gap-2">
                    <Code className="h-3.5 w-3.5 shrink-0 text-slate-400/70" />

                    <span className="truncate text-xs font-semibold text-slate-700">
                      {skill.name}
                    </span>
                  </div>

                  {/* Skill Status */}
                  <div className="flex shrink-0 items-center gap-2">
                    {isVerified ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

                        <span className="text-xs font-medium text-emerald-700">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddEvidence(skill.id)}
                        className="flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-[#DC4A1F] hover:text-[#DC4A1F]"
                      >
                        <Plus className="h-3 w-3" />
                        Add proof
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
              <Code className="h-5 w-5 text-[#DC4A1F]" />
            </div>

            <p className="mb-3 text-xs font-medium text-slate-500">
              Add your first skill to start building proof
            </p>

            <button
              type="button"
              onClick={handleViewAll}
              className="flex items-center gap-1.5 rounded-lg bg-[#DC4A1F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#c9401b]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Skill
            </button>
          </div>
        )}

        {/* All Skills Verified Message */}
        {totalSkills > 0 && verifiedCount === totalSkills && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

            <p className="text-xs font-medium text-emerald-700">
              All your skills are backed by proof
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <button
        type="button"
        onClick={handleViewAll}
        className="mt-4 flex w-full items-center justify-center gap-1 border-t border-stone-100 pt-3 text-xs font-semibold text-[#DC4A1F] transition hover:gap-2"
      >
        View all skills
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
};

export default SkillProofCard;
