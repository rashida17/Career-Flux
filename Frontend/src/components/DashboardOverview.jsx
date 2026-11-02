// STATISTIC CARD
function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-200 border-l-4 border-l-brand-500 bg-white p-5 transition hover:border-brand-200 hover:border-l-brand-500 hover:shadow-soft">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
 
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          {value}
        </h2>
 
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {note}
        </p>
      </div>
 
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon size={23} />
      </div>
    </div>
  );
}
 
export default function DashboardOverview({ banner, stats = [] }) {
  const BannerIcon = banner?.icon;
 
  return (
    <>
      {/* Banner card */}
      {banner && (
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 border-l-4 border-l-brand-500 bg-white p-5 shadow-soft transition hover:border-brand-200 hover:border-l-brand-500 md:flex-row md:items-center md:p-6">
          <div className="flex items-start gap-4">
            {BannerIcon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <BannerIcon size={24} />
              </div>
            )}
 
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900">{banner.title}</h2>
 
                {banner.badge && (
                  <span
                    className={
                      banner.badgeClassName ??
                      "rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-800"
                    }
                  >
                    {banner.badge}
                  </span>
                )}
              </div>
 
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                {banner.description}
              </p>
            </div>
          </div>
 
          {banner.buttonLabel && (
            <button
              type="button"
              onClick={banner.onButtonClick}
              className="shrink-0 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              {banner.buttonLabel}
            </button>
          )}
        </section>
      )}
 
      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>
    </>
  );
}