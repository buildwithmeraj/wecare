import ProfilePage from "@/components/ProfilePage";

export const metadata = {
  title: `Profile ${process.env.PAGE_TITLE}`,
};

export default function Page() {
  return <ProfilePage />;
}
