import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useEmailVerification } from "@/hooks/use-email-verification";
import { useProfileQuery } from "@/hooks/use-profile-query";
import { useProfileForm, type ProfileFormData } from "@/hooks/use-profile-form";
import { EmailVerificationBanner } from "@/components/shared/email-verification-banner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProfileForm } from "./profile-form";
import { AvatarUploadModal } from "./avatar-upload-modal";
import { PasswordChangeForm } from "./change-password-form";
import { PencilIcon } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfilePage() {
  const { user } = useAuth();
  const { isVerified, isCooldown, cooldownSeconds, resend } = useEmailVerification();
  const { data: profile, isLoading } = useProfileQuery();
  const { form, mutation } = useProfileForm(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  if (!user) return null;

  function handleSave(data: ProfileFormData) {
    mutation.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  }

  function handleCancel() {
    form.reset();
    setIsEditing(false);
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "—";

  const displayName = profile?.name ?? user.name;

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Profile" }]} />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-heading text-h2 mb-8">Profile</h1>

        <div className="mb-6">
          <EmailVerificationBanner
            isVerified={isVerified}
            isCooldown={isCooldown}
            cooldownSeconds={cooldownSeconds}
            onResend={resend}
          />
        </div>

        <div className="mb-8 flex items-center gap-6">
          {isLoading ? (
            <Skeleton className="size-20 rounded-full" />
          ) : (
            <button type="button" onClick={() => setAvatarModalOpen(true)} className="group relative size-20 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-20">
                <AvatarImage src={profile?.avatar} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <PencilIcon className="size-6 text-white" />
              </span>
            </button>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-h4">Account Information</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-36" />
              </div>
            ) : isEditing ? (
              <ProfileForm form={form} mutation={mutation} onSubmit={handleSave} onCancel={handleCancel} />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Name</p>
                  <p className="text-body">{profile?.name ?? user.name}</p>
                </div>
                <div>
                  <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Email</p>
                  <p className="text-body">{profile?.email ?? user.email}</p>
                </div>
                <div>
                  <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Role</p>
                  <p className="text-body capitalize">{profile?.role ?? user.role}</p>
                </div>
                <div>
                  <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Member since</p>
                  <p className="text-body">{memberSince}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {profile?.role === "admin" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-heading text-h4">Admin Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Last Login IP</p>
                <p className="text-body">{profile.lastLoginIp ?? "—"}</p>
              </div>
              <div>
                <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Account Status</p>
                <p className="text-body capitalize">{profile.accountStatus ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <PasswordChangeForm />
      </div>

      {avatarModalOpen && <AvatarUploadModal open={avatarModalOpen} onOpenChange={setAvatarModalOpen} />}
    </>
  );
}
