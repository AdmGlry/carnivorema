import { describe, expect, it } from "vitest";
import { parsePage, parsePrice } from "./marjane.js";

const html = `<h1>Boucherie</h1>
<div class="jsx-1 product-card row"><a class="image" href="/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie/5014-viande-hachee-de-b%C5%93uf-500g"><img src="https://img/x.webp"></a>
<div class="wrapper"><h2 class="title">Viande hachée de bœuf 500g</h2><section class="prices"><span class="price">54,90DH</span><span class="old-price">57,90DH</span></section></div></div>
<a href="/courses-en-ligne/11-marche/51-boucherie-volaille/275-volailles">Volailles</a>
<a href="/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie?page=2&x=1">2</a>`;

describe("marjane", () => {
  it("lit les prix", () => {
    expect(parsePrice("39,90DH")).toBe(39.9);
    expect(parsePrice("1 299,00 DH")).toBe(1299);
  });
  it("extrait produits, promotions et liens", () => {
    const { products, links } = parsePage(html, "https://www.marjane.ma/courses-en-ligne/11-marche");
    expect(products).toEqual([
      expect.objectContaining({ name: "Viande hachée de bœuf 500g", priceMad: 54.9, oldPriceMad: 57.9, category: "Boucherie" }),
    ]);
    expect(links).toContain("https://www.marjane.ma/courses-en-ligne/11-marche/51-boucherie-volaille/275-volailles");
    expect(links).toContain("https://www.marjane.ma/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie?page=2");
  });
});
