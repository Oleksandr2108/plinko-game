export function ProfileStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] p-4">
      <p className="text-[12px] text-(--colorSmallText)">{label}</p>
      <p className="mt-2 text-[16px] font-bold text-white">{value}</p>
    </article>
  );
}
