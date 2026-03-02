---
title: "Session 3: High-Assurance Engineering"
description: "High-Assurance Engineering – TDD, Testing, and Refactoring with AI"
---

# 🗓️ Session 3: High-Assurance Engineering

**Theme:** High-Assurance Engineering – TDD, Testing, and Refactoring with AI

**One doc:** session outline, concepts, examples, and a checklist of what we learned.  
Use it to run the session and share with colleagues. No project-specific references.

---

## Part 1 — Session outline

**Audience:** Developers  
**Duration:** 90–120 minutes

| Block | Duration | Topic                                  |
| ----- | -------- | -------------------------------------- |
| 1     | 10 min   | Intro: objectives, today's flow        |
| 2     | 15 min   | TDD in 5 minutes: red–green–refactor   |
| 3     | 15 min   | How AI helps: prompts and pitfalls     |
| 4     | 25 min   | Hands-on 1: unit test with AI          |
| 5     | 25 min   | Hands-on 2: one e2e test with AI       |
| 6     | 10 min   | Running tests and fixing common issues |
| 7     | 10 min   | Q&A and next steps                     |

**Objectives by the end:**

1. Explain TDD (red–green–refactor) and when it helps.
2. Use AI to write and fix unit and e2e tests.
3. Run unit and e2e tests locally and read results.
4. Use docs to troubleshoot (browsers, env, failures).

---

## Part 2 — What is TDD?

**Test-Driven Development:** write a failing test first, then the smallest code that passes it, then refactor. The loop is **red → green → refactor**.

| Step         | What you do                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Red**      | Write a test for the behaviour you want. Run it; it fails (or the behaviour isn't there yet). |
| **Green**    | Implement just enough to make the test pass.                                                  |
| **Refactor** | Improve code and tests without changing behaviour. Keep tests green.                          |

**Why:** Clear spec, better APIs, safer refactors, fewer bugs.

**When it helps:** Business logic, services, APIs, critical user flows, bug fixes (reproduce then fix).

**When it's optional:** Throwaway scripts, one-off experiments.

---

## Part 3 — Types of tests

| Type     | Typical tool        | What it tests                                                         | Speed  |
| -------- | ------------------- | --------------------------------------------------------------------- | ------ |
| **Unit** | Vitest, Jest        | Functions and logic in isolation; mock external calls (e.g. `fetch`). | Fast   |
| **E2E**  | Playwright, Cypress | Full flows in a real browser.                                         | Slower |

- **Unit:** No browser, mock HTTP and other I/O. Good for services, utils, validation.
- **E2E:** Real UI and network (or test mode). Good for "does the critical path work?"

---

## Part 3b — How to work with Playwright (purpose and practice)

**Purpose of Playwright**

- Playwright runs **end-to-end (e2e) automated tests**: a real browser is started, the app is loaded, and tests interact with the page (click, type, navigate) and assert outcomes like a user would.
- Tests are run from the **command line** (CLI). They are **not** run by the Playwright MCP server; MCP is for interactive/ad‑hoc browser use. For the automated test suite, always use the CLI.
- Typical uses: smoke tests (core flows), feature flows, and tests that capture console/network for debugging.

**Prerequisites**

- Node and project dependencies (`npm install`). That installs the **Playwright npm package** (`@playwright/test`) from devDependencies—the test runner only.
- **Browser binary** is required separately and is **not** in `package.json`. Install once: `npx playwright install chromium` (or `npx playwright install` for all browsers). Optional: add `"postinstall": "playwright install chromium"` so browsers install after `npm install`.

**How to run tests**

- From project root: `npm run test:e2e` or `npx playwright test --project=chromium`.
- With browser visible: `npx playwright test --headed`.
- Single file: `npx playwright test path/to/spec.ts --project=chromium`.
- Headless (CI): `npx playwright test --headed=false`.
- The app can be started by Playwright via `webServer` in config, or you start it yourself and use `reuseExistingServer: true`.

**Test structure**

- Specs live in a folder like `e2e/` with `*.spec.ts` (or `*.spec.js`). Config is usually `playwright.config.ts` at the project root.
- In config you set: `testDir`, `baseURL`, and `projects` (one per browser). Use `test.describe()` and `test()` to group tests.

**Viewing results**

- **HTML report:** `npx playwright show-report` (pass/fail, traces, screenshots). If port is in use, kill the existing report process or use another port.
- **Headed mode:** Run with `--headed` to watch the browser; it may open behind other windows—check Dock/taskbar.
- **Debug mode:** `npx playwright test --debug` to step through; or `npx playwright test path/to/spec.ts -g "test name" --debug`.
- **Speed:** In config, `slowMo` (ms) adds delay between actions; increase to watch tests, set to 0 for speed.

**Playwright vs MCP**

- **Automated tests:** Run only via CLI (`npx playwright test`). No MCP server required.
- **Playwright MCP:** For interactive use (e.g. AI driving a browser via tools). It does **not** execute your `.spec.ts` files.

For common issues (executable missing, Chrome crash, browser not visible, bot detection, port in use, strict mode, CI), see the **Common issues and fixes** table in Part 6.

---

## Part 3c — Unit testing: rules and when you need them

**When you need unit tests**

- **Business logic:** Calculations, validation, rules.
- **Services and API clients:** Request shape, response handling, error mapping (e.g. 400, 403, 502).
- **Utilities and pure functions:** Same input → same output; easy to test.
- **Bug fixes:** Write a test that reproduces the bug, then fix so the test passes.
- **Critical paths:** Code that affects security, payments, or core flows.

**When unit tests are optional or lower priority**

- Throwaway or one-off scripts.
- Thin UI that only passes props; prefer e2e or component tests.
- Third-party code you don't own.

**Rules for unit tests**

| Rule                                  | Why                                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Mock external I/O**                 | Mock `fetch`, DB, file system, etc. so tests don't hit the network or disk and stay fast and deterministic.                       |
| **Keep tests fast**                   | Run in milliseconds. Slow unit tests discourage running them often.                                                               |
| **Isolate the unit**                  | Test one module or function; mock its dependencies so failures point to the unit under test.                                      |
| **Deterministic**                     | No flakiness. Same code and data → same result. Avoid random data or current time unless you control them.                        |
| **Clear names**                       | Test names describe the behaviour (e.g. `returns undefined for unknown id`, `throws when token is missing`).                      |
| **One behaviour per test**            | Each test asserts one logical behaviour. Multiple assertions are fine if they describe that single behaviour.                     |
| **Arrange–Act–Assert**                | Set up data (arrange), call the code (act), assert the outcome. Keeps tests readable.                                             |
| **Don't test implementation details** | Test observable behaviour and contracts (return value, thrown errors, calls to mocks), not internal variables or private methods. |

**Needs for a healthy unit test suite**

- A test runner (e.g. Vitest, Jest) and a way to run tests from the CLI and from CI.
- A convention for where tests live (e.g. `__tests__/*.spec.ts` next to code or a top-level `tests/` folder).
- Mocks or stubs for external dependencies (e.g. `vi.fn()`, `vi.mock()`).
- Docs or comments on how to run unit tests and how to fix common failures (e.g. env, mocks).

---

## Part 4 — How AI can help

Use AI as a **pair programmer**. Always run tests and read the code.

### Writing tests

- _"Write a unit test for this function that checks [behaviour]."_
- _"Add an e2e test that [action], then asserts [outcome]. Use the same style as in [existing spec]."_
- _"Suggest edge cases and write tests for them."_

### Using the codebase

- Point AI at real files so it matches your patterns.
- _"Our e2e tests use `getByRole` and `waitForLoadState('domcontentloaded')`. Generate a similar test for …"_

### Fixing failures

- Paste the failing output or error.
- _"This test fails with [error]. What's wrong and how do I fix it?"_
- _"Strict mode violation: getByText resolved to 2 elements. Suggest a more specific selector."_

### Improving tests

- _"Make this test more resilient to timing."_
- _"Add a case for when the API returns 403."_
- _"Mock fetch so this unit test doesn't hit the network."_

### Pitfalls

- AI can suggest wrong assertions or outdated APIs. Always run the test.
- AI may not know your env (test mode, base URL). Share snippets or doc links.

---

## Part 5 — Generic examples

### Unit test example (service getter)

```typescript
// Function: getItemById(id: string) => Item | undefined
describe("getItemById", () => {
  it("returns item when id exists", () => {
    expect(getItemById("valid-id")).toBeDefined();
    expect(getItemById("valid-id")?.name).toBe("Expected Name");
  });

  it("returns undefined for unknown id", () => {
    expect(getItemById("unknown")).toBeUndefined();
  });
});
```

### Unit test example (API client with fetch mock)

```typescript
// Function: fetchData(token: string) => Promise<Data>
beforeEach(() => {
  global.fetch = vi.fn();
});

it("throws when token is missing", async () => {
  await expect(fetchData("")).rejects.toThrow("Authentication required");
  expect(fetch).not.toHaveBeenCalled();
});

it("sends correct request body and returns data", async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ data: [] }),
  });
  const result = await fetchData("token");
  expect(result).toEqual({ data: [] });
  const body = JSON.parse((fetch as any).mock.calls[0][1].body);
  expect(body.token).toBe("token");
});
```

### E2E test example (one flow)

```typescript
test("user can open list and see first item", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  const firstCard = page.getByRole("link", { name: /item/i }).first();
  await expect(firstCard).toBeVisible({ timeout: 5000 });

  await firstCard.click();
  await page.waitForURL("**/items/**");
  await expect(page.locator("h1")).toContainText("Item");
});
```

### E2E: capturing console and network (for debugging)

```typescript
const logs: string[] = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));

const apiCalls: { url: string; status: number }[] = [];
page.on("response", async (res) => {
  if (res.url().includes("/api/")) {
    apiCalls.push({ url: res.url(), status: res.status() });
  }
});

// ... run test ...

console.log("Console:", logs);
console.log("API calls:", apiCalls);
```

---

## Part 6 — Running tests and fixing issues

### Unit tests

- Command: `npm run test:unit` or `npx vitest run`
- Config: e.g. `vitest.config.ts`
- Specs: e.g. `src/**/__tests__/*.spec.ts` or `**/*.spec.ts`

### E2E tests

- Install browsers once: `npx playwright install chromium`
- Run: `npx playwright test` or `npm run test:e2e`
- With browser visible: `npx playwright test --headed`
- One file: `npx playwright test path/to/spec.ts --project=chromium`
- Report: `npx playwright show-report`

### Two parts of "Playwright"

- **Test library (npm package):** In `devDependencies`; installed with `npm install`. This is the test runner.
- **Browser binary:** Installed separately with `npx playwright install chromium`. Not in `package.json`. Without it you get "Executable doesn't exist."
- Optional: add `"postinstall": "playwright install chromium"` so browsers install after `npm install`.

### Playwright vs MCP

- **Automated test suite:** Run only via the CLI (`npx playwright test`). No MCP server needed.
- **Playwright MCP:** For interactive use (e.g. AI driving a browser via tools). It does **not** run your `.spec.ts` files.

### Common issues and fixes

| Issue                                                        | Fix                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| "Executable doesn't exist"                                   | Run `npx playwright install chromium` (or `npx playwright install`).                                    |
| System Chrome crashes (Crashpad / "Operation not permitted") | Don't use `channel: 'chrome'` in config; use Playwright's bundled Chromium.                             |
| Browser window never appears (headed)                        | Run from a normal terminal; check Dock/taskbar; use `--headed`.                                         |
| Bot detection (e.g. Turnstile) blocks e2e                    | Use a test mode or test keys so the app bypasses or mocks verification in tests.                        |
| Port already in use (EADDRINUSE)                             | Kill the process on that port or set `reuseExistingServer: true` for the dev server.                    |
| "Strict mode violation" / selector matches 2+ elements       | Use a more specific selector (e.g. `getByRole('button', { name: 'Submit' })` or scope with `.first()`). |
| Tests pass locally but fail in CI                            | Install browsers in CI; run headless; avoid system Chrome; increase timeout if needed.                  |

---

## Part 7 — What we learned (checklist)

Use this as a recap and to design the session.

### TDD and workflow

- Red–green–refactor: fail first, then pass, then refactor.
- Test first improves design and makes refactors safer.
- TDD is most useful for logic, services, APIs, and critical flows.

### Unit testing

- Mock `fetch` (or other I/O) so unit tests don't hit the network.
- Test success and failure paths (e.g. 400, 403, 502) and edge cases (missing token, empty response).
- Test both "direct" and "wrapped" API response shapes when the client supports both.
- Keep tests next to code (e.g. `__tests__/*.spec.ts`) or in a test directory.

### E2E testing

- Install Playwright browsers once; the npm package alone is not enough.
- Prefer stable selectors: `getByRole`, `getByLabel`, then fall back to more specific locators.
- Use `waitForLoadState('domcontentloaded')` or `waitForURL()` instead of long fixed timeouts where possible.
- Headed mode (`--headed`) and `slowMo` help when watching tests; headless for CI.
- You can capture console and network in e2e (e.g. `page.on('console')`, `page.on('response')`) for debugging.
- If the app uses bot detection (e.g. Turnstile), use a test mode or test keys so e2e can run without real verification.

### Playwright specifics

- Two installs: (1) npm package in devDependencies, (2) browser binary via `playwright install`.
- Optional `postinstall` script to install Chromium after `npm install`.
- MCP is for interactive use; the automated suite runs only via CLI.
- Using system Chrome (`channel: 'chrome'`) can cause crashes in some environments; default Chromium is safer.
- Report server can conflict on port; kill the process or use a different port.

### AI assistance

- Good for: generating test skeletons, suggesting selectors, explaining failures, adding edge cases.
- Always run tests after AI suggestions; check assertions and APIs.
- Share real code and error output so AI can give relevant fixes.
- Document "how we run tests and fix issues" so AI and humans can point to one place.

### Documentation

- One "automated testing" guide: setup, run commands, and "fixing common issues" in one place.
- Clarify "package vs browser" and "CLI vs MCP" to avoid confusion.
- A generic template doc helps copy the same structure into new projects.
- List common issues (browser missing, port in use, strict mode, CI) with short fixes.

---

## Part 8 — Suggested next steps (for participants)

- Run unit and e2e suites once locally.
- Add one unit test (e.g. for a getter or an API client with mocked fetch).
- Add one e2e test (e.g. one user flow).
- Skim the team's testing docs so you know where to look when something fails.

---

## Facilitator notes

- **Before:** Ensure everyone can run unit tests and at least one e2e spec (and has run `npx playwright install chromium` if using Playwright).
- **Hands-on:** Use one shared repo/branch or a starter branch; have everyone add one test each.
- **If short on time:** Keep unit hands-on and "running tests + fixing issues"; make e2e "try at home" with this doc.
