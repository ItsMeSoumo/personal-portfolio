// src/app/page.jsx
import Cards from "@/components/cards";
import Slideback from "@/components/slideback";
import Text from "@/components/text";
import Menu from "@/components/menu";

export default function Page() {
  return (
    <>
      <section className="z-50">
        <Menu />
      </section>

      <section>
        <Cards />
      </section>

      <section>
        <Slideback />
      </section>

    </>
  );
}