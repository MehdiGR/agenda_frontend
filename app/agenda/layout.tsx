import { ReactNode } from "react";
import MainMenu from "../components/navbar";
interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <MainMenu />
      <main className="p-6">{children}</main>
    </>
  );
}
