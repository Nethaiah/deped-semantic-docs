"use client";

import { Settings2, User, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="space-y-4">{children}</div>
    <Separator className="my-6" />
  </div>
);

const SettingItem = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

export default function Settings() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings2 className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <SettingsSection
        title="Profile"
        description="Update your personal information and preferences"
      >
        <SettingItem
          icon={User}
          title="Personal Information"
          description="Update your name, email, and other personal details"
          action={
            <Button variant="outline" size="sm">
              Edit
            </Button>
          }
        />
      </SettingsSection>

      <div className="pt-4">
        <Link href="/forgot-password">
          <Button variant="destructive" className="cursor-pointer">
            Forgot Password
          </Button>
        </Link>
      </div>
    </div>
  );
}
