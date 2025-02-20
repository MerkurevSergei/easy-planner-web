import "./globals.css";
import Header from '@components/header/header';

export const metadata = {
  title: "Easy Planner",
  description: "Easy project management and planning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header/>
        <main>{children}</main>
      </body>
    </html>
  );
}