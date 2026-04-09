import { Suspense } from "react";
import Settings from "@/components/settings/settings";
import Loading from "./loading";

function SettingsContent() {
  return <Settings />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsContent />
    </Suspense>
  );
}
