import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
