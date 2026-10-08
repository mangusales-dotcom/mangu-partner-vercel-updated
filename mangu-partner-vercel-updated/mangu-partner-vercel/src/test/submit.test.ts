import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitPayload, flushPending } from "@/lib/submit";
describe("submit queue", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it("posts once, reuses id on retry, clears queue", async () => {
    const calls: any[] = [];
    vi.stubGlobal("fetch", vi.fn(async (_u: string, o: any) => { calls.push(JSON.parse(o.body)); if (calls.length === 1) throw new Error("offline"); return new Response(""); }));
    const p = { registrantType: "mechanic" as const, submissionId: "abc-1", fullName: "Test", utm: "" };
    expect(await submitPayload(p)).toBe(false);
    expect(JSON.parse(localStorage.getItem("mangu_pending")!)).toHaveLength(1);
    await flushPending();
    expect(calls.map(c => c.submissionId)).toEqual(["abc-1","abc-1"]);
    expect(localStorage.getItem("mangu_pending")).toBeNull();
  });
});
