# Net Wealth Tax Lab

> *What if taxes were based on **Net Wealth** instead of Annual Income?*

Demo available at [taxcalc.taylormadetraffic.com](https://taxcalc.taylormadetraffic.com)


![Screenshot](public/NetWealthTabLab.png)

---

### What could go right

- Encourages circulation of wealth rather than accumulation.
- Eliminates most deductions, credits, and loopholes by design.
- Naturally progressive — those who hold more, contribute more.

### What could go wrong

- May discourage saving and incentivize spending.
- Valuing illiquid assets (property, private equity) is hard.
- Debt deductions create new avenues for manipulation.

---

## Defining Net Wealth

The central question is deceptively simple: *what counts?* Our working definition is **Net Wealth = Assets − Debts**, applied to every individual — including minors, who would file through a legal guardian. This prevents hiding wealth in non-filing relatives. Each side is broken into categories that can be taxed or deducted at independent rates.

These categories are starting points — you can add, remove, or adjust them in the calculator. The goal is to find a minimal set that's both auditable and hard to game.

### Assets (taxed)

- **Liquid Capital** — Immediately accessible capital including checking accounts, money market accounts, cryptocurrency wallets, and brokerage cash. Proceeds from selling assets (stocks, business equity, IP, tangible goods) enter this category once converted to liquid form.
- **Reserved Capital** — Capital with restricted access or early withdrawal penalties, including savings accounts, CDs, IRAs, 401(k)s, pension funds, and life insurance cash value.
- **Foreign-Held Capital** — Capital held in foreign jurisdictions regardless of asset type — bank accounts, investments, property, or other holdings. Taxed at a higher rate because this capital is not circulating in the domestic economy, and appraising foreign-held assets is inherently difficult.
- **Productive Property** — Real estate in active economic use — housing people, growing food, running a business, or otherwise serving its zoned purpose at meaningful capacity. Utilization must be substantial and arm's-length. Defining "meaningful capacity" is the main loophole risk; tying classification to zoning compliance, minimum occupancy thresholds, and municipal assessment data could help.
- **Idle Property** — Real estate not serving its zoned purpose or operating well below capacity — effectively functioning as a store of value. Includes vacant land, buildings with token occupancy, and underutilized seasonal properties. The elevated rate is designed to make land speculation expensive and push property back into productive use, directly addressing housing shortages. How should "idle" be defined and enforced? Open question.

### Debts (deducted)

Each debt category carries a deduction rate — the percentage of that debt that reduces your tax obligation. Rates decrease in the order listed, roughly reflecting how "productive" the debt is to the broader economy. This ranking is debatable and we'd love to hear other arguments.

- **Business Debt** — Outstanding loans, credit lines, bonds, or mortgage debt on commercial and investment property held for business operations.
- **Personal Debt** — Consumer credit card balances, auto loans, residential mortgage debt, and other personal liabilities.
- **Student Debt** — Outstanding educational loans (federal and private).
- **Health Debt** — Unpaid medical bills, hospital balances, and health-related loans.

---

## ⚠️ The Debt Problem

Debt deductions are the most dangerous part of this model. Any system that reduces your tax bill based on how much you owe creates an incentive to owe more — or to *appear* to owe more. A few scenarios we're thinking about:

- **Manufactured debt** — A wealthy individual takes a loan from a shell company they control offshore. On paper they have debt; in reality they have access to the same capital. The deduction would be free money.
- **Overseas creditor opacity** — If the creditor is a foreign entity, verifying that the debt is real and arm's-length becomes much harder. Cross-border lending could become the new tax shelter.
- **Circular lending** — Two parties lend to each other. Both claim deductions. Neither has actually parted with any capital. Without netting rules, the system double-counts.
- **Strategic medical debt** — Elective procedures billed at inflated prices to a related-party provider. The "debt" is real on paper but engineered for deduction value.

### Possible safeguards worth exploring

- Require domestic, regulated creditors for deductions to apply.
- Cap total debt deductions as a percentage of gross assets.
- Net related-party debts (you can't owe yourself).
- Use declining deduction rates at higher net wealth tiers — debt relief matters more to the lower brackets.

---

## Open Questions

This model raises more questions than it answers. That's the point — it's a thinking tool, not a finished product. Some of the harder ones:

- **Banks and Corporations** — Should entities be taxed on net wealth too, or only individuals? Corporate balance sheets are structured very differently from personal ones.
- **Transition** — You can't switch tax systems overnight. What does a 10-year phase-in look like? Would you run both systems in parallel?
- **Enforcement and Privacy** — A net wealth tax requires knowing what people own. How do you balance enforcement with civil liberties? Could zero-knowledge proofs or privacy-preserving audits help?
- **Capital Flight** — If only one country does this, wealth may simply leave. Is this viable without international coordination?
- **Asset Transfers** — Universal individual filing closes the simplest loophole — gifting assets to relatives to lower your bracket. But what about transfers to non-relatives, shell entities, or foreign nationals?

---

## Contribute

This is an open-source thought experiment. We're looking for economists, tax attorneys, policy researchers, engineers — or anyone who finds this interesting and wants to poke holes in it.

Open Issues or Pull Requests on [GitHub](https://github.com/eliataylor/taxcalc). You can also contribute to this Google Doc of [research](https://docs.google.com/document/d/1qCxG9i8CHDaBKULj7ITyCVCcWngkd6edAwGGiV1Z2Zo/edit?usp=sharing) gathered by Gemini.

---

<p align="center">
  <a href="https://github.com/sponsors/eliataylor">Sponsor this project</a>
</p>
