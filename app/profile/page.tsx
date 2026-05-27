import { AppFooter } from "@/widgets/footer";
import { ProfilePage } from "@/widgets/profile";

export default function Profile() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <ProfilePage />
      </div>
      <AppFooter activeHref="/profile" />
    </div>
  );
}
