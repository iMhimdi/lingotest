import type { PropsWithChildren } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";

import IntercomClientComponent from "@/components/IntercomClientComponent";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const MainLayout = async ({ children }: PropsWithChildren) => {
  // Fetch user data on the server
  const user = await currentUser();
  const { userId } = auth(); // Get userId separately, as user might be null if not logged in

  // Extract email (handle potential nulls)
  // Find the primary email address using the primaryEmailAddressId
  const userEmail = user?.emailAddresses?.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

  return (
    <>
      <SpeedInsights />
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full pt-[50px] lg:pl-[256px] lg:pt-0">
        <div className="mx-auto h-full max-w-[1056px] pt-6">{children}</div>
      </main>
      {/* Conditionally render Intercom for logged-in users */}
      {userId && (
        <IntercomClientComponent userId={userId} userEmail={userEmail} />
      )}
    </>
  );
};

export default MainLayout;
