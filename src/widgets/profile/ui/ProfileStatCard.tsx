export function ProfileStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[10px] border border-(--borderColor) bg-(--bgSurface) p-4">
      <p className="text-[12px] text-(--colorSmallText)">{label}</p>
      <p className="mt-2 text-[16px] font-bold text-(--colorWhite)">{value}</p>
    </article>
  );
}
