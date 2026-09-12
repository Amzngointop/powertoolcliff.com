export function TextPage({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-narrow px-5 pb-20 pt-10" data-page-layout="text-page">
      <p className="label label-lg !text-blue">{kicker}</p>
      <h1 className="mt-1 text-[36px] md:text-[44px]">{title}</h1>
      <div className="prose-block mt-6 text-[16px] leading-[1.7] [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2+p]:mt-3">{children}</div>
    </article>
  )
}
