"use client";

import { User, Lock, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  passwordSchema,
  type ProfileSchema,
  type PasswordSchema,
} from "@/lib/zodSchema";
import { deleteAccount, updateProfile, updatePassword } from "@/server/settings/actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-context";
import type { ThemeColors } from "@/lib/theme-config";

const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card className="rounded-xl border-gray-200 py-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">{children}</CardContent>
  </Card>
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
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-base md:text-md">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="flex items-center w-full sm:w-auto pl-14 sm:pl-0">
      {action}
    </div>
  </div>
);

function ProfileForm({ setOpen, theme }: { setOpen: (open: boolean) => void; theme: ThemeColors }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Import router to refresh data
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            fullName: profile.full_name,
          });
        } else {
          form.reset({
            fullName: user.user_metadata.full_name || "",
          });
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, [form]);

  async function onSubmit(data: ProfileSchema) {
    const result = await updateProfile(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully");
      
      // Update the client-side session to reflect changes immediately
      const supabase = createClient();
      await supabase.auth.refreshSession(); 
      
      setOpen(false);
      router.refresh(); // Refreshes server components to show new name
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...form.register("fullName")}
          placeholder="Enter your full name"
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={theme.primaryBgClass}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

function PasswordForm({ setOpen, theme }: { setOpen: (open: boolean) => void; theme: ThemeColors }) {
  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordSchema) {
    const result = await updatePassword(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Password updated successfully");
      setOpen(false);
      form.reset();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          {...form.register("currentPassword")}
          placeholder="Enter current password"
        />
        {form.formState.errors.currentPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...form.register("newPassword")}
          placeholder="Enter new password"
        />
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...form.register("confirmPassword")}
          placeholder="Confirm new password"
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={theme.primaryBgClass}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Password
        </Button>
      </div>
    </form>
  );
}

function DeleteAccountAction({ theme }: { theme: ThemeColors }) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmValid = confirmation.trim() === "DELETE";

  async function handleDeleteAccount() {
    setIsDeleting(true);
    let didDelete = false;
    try {
      const result = await deleteAccount({ confirmation });
      if (result.error) {
        toast.error(result.error);
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Your account has been deleted.");
      didDelete = true;
      router.replace("/login");
      router.refresh();
    } finally {
      setIsDeleting(false);
      if (didDelete) {
        setDialogOpen(false);
        setConfirmation("");
      }
    }
  }

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setConfirmation("");
        }
      }}
    >
      <AlertDialogTriggerButton onClick={() => setDialogOpen(true)} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              This will delete your DocuLens account and immediately remove your access to the platform.
            </span>
            <span className="block">
              To continue, type <strong>DELETE</strong> below.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-confirmation">Confirmation</Label>
          <Input
            id="delete-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder='Type "DELETE"'
            disabled={isDeleting}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertDialogTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={onClick}>
      Delete Account
    </Button>
  );
}

export default function Settings() {
  const { theme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [accountRole, setAccountRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadRole() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAccountRole(null);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setAccountRole(data?.role || "user");
    }

    loadRole();
  }, []);

  return (
    <div className="space-y-8 p-6 lg:p-8 w-full">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
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
          description="Update your display name"
          action={
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <ProfileForm setOpen={setProfileOpen} theme={theme} />
              </DialogContent>
            </Dialog>
          }
        />
        
        <SettingItem
          icon={Lock}
            title="Password"
            description="Change your password"
            action={
              <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and a new password.
                    </DialogDescription>
                  </DialogHeader>
                  <PasswordForm setOpen={setPasswordOpen} theme={theme} />
                </DialogContent>
              </Dialog>
            }
          />
      </SettingsSection>

      {accountRole === "user" && (
        <SettingsSection
          title="Danger Zone"
          description="Delete your account and remove your access to DocuLens."
        >
          <SettingItem
            icon={Trash2}
            title="Delete Account"
            description="This permanently removes your access until an administrator restores the account."
            action={<DeleteAccountAction theme={theme} />}
          />
        </SettingsSection>
      )}
    </div>
  );
}
