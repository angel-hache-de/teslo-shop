import { FC } from "react";
import Head from "next/head";

import { Navbar, SideMenu } from "../ui";

interface Props {
  children: JSX.Element | JSX.Element[];
  imageFullUrl?: string;
  pageDescription: string;
  title: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  imageFullUrl,
  pageDescription,
  title,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <nav>
        <Navbar />
      </nav>

      <SideMenu />

      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        {children}
      </main>

      <footer>{/* Footer */}</footer>
    </>
  );
};
