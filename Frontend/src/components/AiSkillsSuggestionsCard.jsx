
import { useState } from "react";
import {
  Sparkles,
  Compass,
  Lock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Target,
  BookOpen,
  GraduationCap,
  Plus,
  Check,
} from "lucide-react";

// 1. AI Skill Suggestions Card
export function AiSkillSuggestionsCard({ user, onNavigate, onAddSkill }) {
  const hasSkills = user?.skills?.length > 0;
  const profileProgress = user?.profileCompletionProgress || 0;

  const existingSkills = (user?.skills || []).map((skill) =>
    skill.toLowerCase()
  );

  const suggestions = (user?.skillSuggestions || [])
    .filter((skill) => !existingSkills.includes(skill.name.toLowerCase()))
    .slice(0, 3);

  const [addedSkills, setAddedSkills] = useState([]);

  const handleAddSkill = (skill) => {
    setAddedSkills((previous) =>
      previous.includes(skill) ? previous : [...previous, skill]
    );

    onAddSkill?.(skill);
  };

  return (
    <div className="relative flex min-h-[330px] h-full flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C84B31]/15 bg-[#FDF3F0] text-[#C84B31]">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-stone-800">
              AI Skill Suggestions
            </h3>
            <p className="mt-0.5 text-[11px] text-stone-500">
              Skills recommended for your career growth
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#FDF3F0] px-2 py-1 text-[9px] font-extrabold uppercase text-[#C84B31]">
          <Zap size={10} className="fill-[#C84B31]" />
          AI Powered
        </span>
      </div>

      {/* CONTENT */}
      {hasSkills ? (
        <div className="flex flex-1 flex-col justify-between space-y-4">

          {/* CURRENT SKILLS */}
          <div>
            <p className="mb-2 text-xs font-semibold text-stone-600">
              Your current skills
            </p>

            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate?.("My Skills")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-sm"
                >
                  <CheckCircle2
                    size={13}
                    className="shrink-0 text-emerald-600"
                  />
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* RECOMMENDED SKILLS */}
          <div className="border-t border-stone-100 pt-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-stone-700">
                Recommended skills
              </p>
              <span className="text-[10px] font-medium text-stone-400">
                Based on job trends
              </span>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-2.5">
                {suggestions.map((skill, idx) => {
                  const isAdded = addedSkills.includes(skill.name);

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-[#FAF8F5]/60 px-3 py-2 transition-colors hover:border-stone-200"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-800">
                          {skill.name}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-4 text-stone-500">
                          {skill.reason}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddSkill(skill.name)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-all duration-200 ${
                          isAdded
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-[#DC4A1F] text-[#DC4A1F] hover:bg-[#DC4A1F] hover:text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={11} />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus size={11} />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg bg-[#FAF8F5] p-3 text-center text-[11px] text-stone-500">
                No new skill suggestions available right now.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("my-skills")}
            className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold text-[#DC4A1F] transition-all hover:gap-2.5"
          >
            Explore My Skills
            <ArrowRight size={13} />
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-200 bg-[#FAF8F5]/70 p-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <Lock size={19} />
          </div>

          <h4 className="text-xs font-bold text-stone-800">
            Unlock AI Skill Analysis
          </h4>

          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-stone-500">
            Complete your profile and set your target job title to unlock
            personalized skill matching.
          </p>

          <button
            type="button"
            onClick={() => onNavigate?.("My Profile")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#DC4A1F] transition hover:gap-2.5"
          >
            Complete Profile ({profileProgress}%)
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// 2. Learning Roadmap Card
export function LearningRoadmapCard({ user, onNavigate }) {
  const roadmap = user?.roadmap;
  const hasRoadmap = Boolean(roadmap);

  const targetJob = roadmap?.targetJobTitle || user?.targetJobTitle || "Your Target Role";
  const ready = roadmap?.learned || 0;
  const total = roadmap?.total || 0;
  const progress = total > 0 ? Math.min((ready / total) * 100, 100) : 0;

  const missingSkills = (roadmap?.missingSkills || []).slice(0, 3);

  return (
    <div className="relative flex min-h-[330px] h-full flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C84B31]/15 bg-[#FDF3F0] text-[#C84B31]">
            <Compass size={19} />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-stone-800">
              Learning Roadmap
            </h3>
            <p className="mt-0.5 text-[11px] text-stone-500">
              Your personalized learning path
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#FDF3F0] px-2 py-1 text-[9px] font-extrabold uppercase text-[#C84B31]">
          <Zap size={10} className="fill-[#C84B31]" />
          AI Powered
        </span>
      </div>

      {/* CONTENT */}
      {hasRoadmap ? (
        <div className="flex flex-1 flex-col justify-between space-y-4">

          {/* TARGET ROLE */}
          <div className="rounded-xl border border-stone-100 bg-[#FAF8F5]/70 p-3">
            <div className="flex items-center gap-2">
              <Target size={15} className="text-[#DC4A1F]" />
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                Your target role
              </p>
            </div>
            <p className="mt-1 text-sm font-bold text-stone-800">
              {targetJob}
            </p>
          </div>

          {/* PROGRESS */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-stone-700">
                Learning progress
              </p>
              <p className="text-[11px] font-bold text-stone-600">
                {ready} of {total} skills ready
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-[#DC4A1F] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* MISSING SKILLS */}
          <div>
            <p className="mb-2.5 text-xs font-semibold text-stone-700">
              Skills to learn next
            </p>

            {missingSkills.length > 0 ? (
              <div className="space-y-2.5">
                {missingSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FDF3F0] text-[#DC4A1F]">
                        <BookOpen size={13} />
                      </div>
                      <p className="truncate text-xs font-semibold text-stone-700">
                        {skill.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate?.("Career Roadmap")}
                      className="shrink-0 text-[10px] font-bold text-[#DC4A1F] transition hover:underline"
                    >
                      Start learning
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-[#FAF8F5] p-3 text-center text-[11px] text-stone-500">
                Great progress! No missing skills to show.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("Career Roadmap")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DC4A1F] py-2.5 text-xs font-bold text-[#DC4A1F] transition-all hover:bg-[#DC4A1F] hover:text-white"
          >
            Open Full Roadmap
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-200 bg-[#FAF8F5]/70 p-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <GraduationCap size={19} />
          </div>

          <h4 className="text-xs font-bold text-stone-800">
            Your Roadmap Is Not Ready Yet
          </h4>

          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-stone-500">
            Complete your profile and add your target role to generate a
            personalized learning roadmap.
          </p>

          <button
            type="button"
            onClick={() => onNavigate?.("My Profile")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#DC4A1F] transition hover:gap-2.5"
          >
            Setup Profile Now
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
